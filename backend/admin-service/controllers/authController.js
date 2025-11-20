import Admin from "../models/Admin.js";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import dotenv from "dotenv";
  dotenv.config({ path: "./src/.env" });

  const API_CUSTOMER =
    process.env.API_CUSTOMER || "http://localhost:5100/api/customer";
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Kiểm tra trùng email trong Admin Service
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email đã tồn tại trong Admin" });
    }

    try {
      const customerResponse = await axios.get(
        `${API_CUSTOMER}/check-email`,
        { params: { email } }
      );

      if (customerResponse.data.exists) {
        return res.status(400).json({
          message: "Email đã tồn tại trong hệ thống",
        });
      }
    } catch (err) {
      console.error(
        "Lỗi khi gọi Customer Service:",
        err.response?.data || err.message
      );

      if (err.code === "ECONNREFUSED") {
        return res.status(503).json({
          message:
            "Customer Service hiện không khả dụng. Vui lòng thử lại sau.",
        });
      }

      return res.status(500).json({
        message: "Không thể kiểm tra email khách hàng",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Tạo admin thành công",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (err) {
    console.error(" Lỗi hệ thống:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ message: "Đăng nhập thành công", token });
  } catch (err) {
    console.error(" Lỗi login:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Email không tồn tại trong hệ thống" });
    }

    // Tạo mã xác nhận 6 số
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu mã và hạn sử dụng (5 phút)
    admin.resetCode = resetCode;
    admin.resetCodeExpires = Date.now() + 5 * 60 * 1000;
    await admin.save();

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SamShop Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã xác nhận đặt lại mật khẩu (Admin)",
      html: `
        <h3>Xin chào ${admin.name},</h3>
        <p>Mã xác nhận để đặt lại mật khẩu là:</p>
        <h2>${resetCode}</h2>
        <p>Mã này có hiệu lực trong 5 phút.</p>
      `,
    });

    return res.json({ message: "Đã gửi mã xác nhận đến email của bạn" });
  } catch (err) {
    console.error("Lỗi forgotPassword:", err);
    res.status(500).json({ message: "Lỗi server khi gửi email" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    if (
      !admin.resetCode ||
      admin.resetCode !== resetCode ||
      Date.now() > admin.resetCodeExpires
    ) {
      return res
        .status(400)
        .json({ message: "Mã xác nhận không hợp lệ hoặc đã hết hạn" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetCode = undefined;
    admin.resetCodeExpires = undefined;
    await admin.save();

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (err) {
    console.error("Lỗi resetPassword:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getAdminInfo = async (req, res) => {
  try {
    // Middleware verifyAdmin set req.admin, không phải req.user
    const adminId = req.admin?.id || req.user?.id;
    
    if (!adminId) {
      return res.status(401).json({ message: "Không tìm thấy thông tin admin trong token" });
    }

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Không tìm thấy admin" });
    }

    res.json({ admin });
  } catch (error) {
    console.error("Error in getAdminInfo:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin?.id || req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: "Không tìm thấy thông tin admin trong token" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Không tìm thấy admin" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Hash mật khẩu mới và lưu
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
