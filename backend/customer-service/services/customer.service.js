import jwt from "jsonwebtoken";
import { Customer } from "../models/Customer.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateOTP } from "../utils/otpGenerator.js";
import {
  sendOTP,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/emailService.js";
import { VerificationToken } from "../models/VerificationToken.js";
import { randomToken } from "../utils/tokenGenerator.js";
import bcrypt from "bcrypt";

export const registerService = async (fullName, inputEmail, password) => {
  const email = inputEmail.toLowerCase().trim();

  // 1️⃣ Kiểm tra email đã tồn tại
  const existingUser = await Customer.findOne({ email });
  if (existingUser) throw new Error("Email already exists");

  // 2️⃣ Kiểm tra độ mạnh của mật khẩu
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Mật khẩu phải có ít nhất 8 ký tự, gồm 1 chữ hoa và 1 ký tự đặc biệt"
    );
  }

  // 3️⃣ Tạo người dùng mới (middleware trong model sẽ tự hash password)
  const customer = new Customer({
    fullName,
    email,
    password,
    isVerified: false,
    isActive: true,
  });
  await customer.save();

  // 4️⃣ Xoá token xác thực cũ (nếu có)
  await VerificationToken.deleteMany({
    userId: customer._id,
    type: "email_verification",
  });

  // 5️⃣ Tạo token xác thực email (JWT)
  const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // 6️⃣ Lưu token vào bảng VerificationToken
  await VerificationToken.create({
    userId: customer._id,
    token: verifyToken,
    type: "email_verification",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // 7️⃣ Gửi email xác thực
  await sendVerificationEmail(email, verifyToken);

  // 8️⃣ Trả về kết quả
  return {
    message: "Đăng ký thành công, vui lòng kiểm tra email để xác thực!",
    customer: {
      id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
    },
  };
};
export const loginService = async (email, password) => {
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error("Không tồn tại người dùng.");
  }
  if (customer.isActive === false) {
    throw new Error("Tai khoan da bi chan.");
  }

  const isMatchPassword = await comparePassword(password, customer.password);
  if (!isMatchPassword) throw new Error("Mật khẩu không chính xác");

  const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const customerData = customer.toObject();
  delete customerData.password;

  return { token, customer: customerData };
};

export const sendOTPForUpdateService = async (email) => {
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error("Email không tồn tại trong hệ thống");
  }

  const otp = generateOTP();
  const expireAt = new Date(Date.now() + 5 * 60 * 1000);

  await VerificationToken.deleteMany({
    userId: customer._id,
    type: "profile_update_otp",
  });

  await VerificationToken.create({
    userId: customer._id,
    token: otp,
    type: "profile_update_otp",
    expiresAt: expireAt,
  });

  await sendOTP(email, otp);
};

export const sendOTPForResetService = async (email) => {
  const customer = await Customer.findOne({ email });
  if (customer) {
    const otp = generateOTP();

    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    await VerificationToken.deleteMany({
      userId: customer._id,
      type: "password_reset",
    });

    await VerificationToken.create({
      userId: customer._id,
      token: otp,
      type: "password_reset",
      expiresAt: expireAt,
    });

    await sendPasswordResetEmail(email, otp);
  }
};

export const sendVerifyEmailService = async (email) => {
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error("Email không tồn tại");
  }

  if (customer.isVerified) {
    throw new Error("Email đã được xác thực trước đó");
  }

  // Xóa token cũ (nếu có)
  await VerificationToken.deleteMany({
    userId: customer._id,
    type: "email_verification",
  });

  const verificationToken = randomToken();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await VerificationToken.create({
    userId: customer._id,
    token: verificationToken,
    type: "email_verification",
    expiresAt,
  });

  await sendVerificationEmail(email, verificationToken);
};

export const resetPasswordService = async (email, otp, newPassword) => {
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error("Người dùng không tồn tại");
  }
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    throw new Error(
      "Mật khẩu phải có ít nhất 8 ký tự, gồm 1 chữ hoa và 1 ký tự đặc biệt"
    );
  }
  const otpRecord = await VerificationToken.findOne({
    userId: customer._id,
    token: otp,
    type: "password_reset",
    expiresAt: { $gt: new Date() },
  });
  console.log(otp);
  if (!otpRecord) {
    throw new Error("Mã otp không tồn tại hoặc đã hết hạn");
  }

  const hashedPassword = await hashPassword(newPassword);

  const updatedCustomer = await Customer.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );

  await VerificationToken.deleteOne({ _id: otpRecord.id });

  return updatedCustomer;
};

export const getAllCustomersService = async (page = 1, limit = 3) => {
  const skip = (page - 1) * limit;

  // Lấy danh sách khách hàng theo phân trang
  const customers = await Customer.find()
    .select("-password -avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Đếm tổng số lượng khách hàng và thống kê
  const totalCustomer = await Customer.countDocuments();
  const activeCount = await Customer.countDocuments({ isActive: true });
  const verifiedCount = await Customer.countDocuments({ isVerified: true });
  const inactiveCount = await Customer.countDocuments({ isActive: false });

  return {
    customers,
    totalCustomer,
    activeCount,
    verifiedCount,
    inactiveCount,
    page: parseInt(page),
    totalPage: Math.ceil(totalCustomer / limit),
  };
};

export const toggleCustomerStatusService = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error("Người dùng không tồn tại");
  }

  customer.isActive = !customer.isActive; //đảo trạng thái
  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    { isActive: customer.isActive },
    { new: true }
  );

  return {
    message: updatedCustomer.isActive
      ? "Tài khoản đã được mở khóa"
      : "Tài khoản đã bị khóa",
    customer: {
      id: updatedCustomer._id,
      isActive: updatedCustomer.isActive,
    },
  };
};

export const verifyEmailService = async (token) => {
  const verificationRecord = await VerificationToken.findOne({
    token,
    type: "email_verification",
    expiresAt: { $gt: new Date() },
  });

  if (!verificationRecord) {
    throw new Error("Token xác thực không hợp lệ hoặc đã hết hạn");
  }

  const customer = await Customer.findOneAndUpdate(
    verificationRecord.userId,
    { isVerified: true },
    { new: true }
  );

  if (!customer) {
    throw new Error("Người dùng không tồn tại");
  }

  await VerificationToken.deleteOne({ _id: verificationRecord._id });

  return customer;
};

export const changePasswordService = async (
  customer,
  oldPassword,
  newPassword
) => {
  if (!oldPassword || !newPassword) {
    throw new Error(
      "Mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu mới là bắt buộc"
    );
  }

  try {
    const isMatch = await bcrypt.compare(oldPassword, customer.password);
    if (!isMatch) {
      throw new Error("Mật khẩu cũ không đúng");
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      throw new Error(
        "Mật khẩu phải có ít nhất 8 ký tự, gồm 1 chữ hoa và 1 ký tự đặc biệt"
      );
    }
    customer.password = newPassword;
    await customer.save();
    return;
  } catch (error) {
    throw error;
  }
};
export const getCustomerByIdService = async (customerId) => {
  try {
    // Dùng findById để trả về object trực tiếp
    const customer = await Customer.findById(customerId).select("-password");
    return customer; // object hoặc null nếu không tồn tại
  } catch (error) {
    throw new Error(error);
  }
};
