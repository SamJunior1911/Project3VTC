import { Customer } from "../models/Customer.js";
import { VerificationToken } from "../models/VerificationToken.js";
import {
  changePasswordService,
  getAllCustomersService,
  loginService,
  registerService,
  resetPasswordService,
  sendOTPForUpdateService,
  sendVerifyEmailService,
  toggleCustomerStatusService,
  verifyEmailService,
  sendOTPForResetService,
  getCustomerByIdService,
} from "../services/customer.service.js";

import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await registerService(fullName, email, password);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const googleCallbackController = (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
};

export const googleFailureController = (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/login`);
};

export const getProfile = (req, res) => {
  const customer = req.customer;
  const profileData = {
    id: customer._id,
    fullName: customer.fullName,
    email: customer.email,
    birthDay: customer.birthDay,
    phoneNumber: customer.phone,
    avatar: customer.avatar,
    isVerified: customer.isVerified,
    isActive: customer.isActive,
    addresses: customer.addresses || [],
  };

  res.json(profileData);
};

export const changePasswordController = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    throw new Error("Mật khẩu mới và xác nhận mật khẩu mới không khớp");
  }
  try {
    const customer = req.customer;
    await changePasswordService(
      customer,
      oldPassword,
      newPassword,
      confirmNewPassword
    );
    res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfileController = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = [
    "fullName",
    "birthDay",
    "newEmail",
    "phone",
    "address",
    "otp",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ message: "Cập nhật không hợp lệ" });
  }

  const requireOTP = ["newEmail", "phone"].some((field) => req.body[field]);

  if (requireOTP) {
    const { otp } = req.body;
    const oldEmail = req.customer.email;

    if (!otp) {
      return res.status(400).json({ message: "Không có mã OTP" });
    }

    const customer = await Customer.findOne({ email: oldEmail });
    if (!customer) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const otpRecord = await VerificationToken.findOne({
      userId: customer._id,
      token: otp,
      type: "profile_update_otp",
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP không hợp lệ" });
    }

    await VerificationToken.deleteOne({ _id: otpRecord._id });
  }

  if (req.body.newEmail) {
    const { newEmail } = req.body;
    if (newEmail !== req.customer.email) {
      const existingCustomer = await Customer.findOne({ email: newEmail });
      if (existingCustomer) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
      req.customer.email = newEmail;
    }
  }

  if (req.body.phone) {
    const { phone } = req.body;
    if (phone && phone !== req.customer.phone) {
      const existingCustomer = await Customer.findOne({ phone: phone });
      if (existingCustomer) {
        return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
      }
      req.customer.phone = phone;
    }
  }

  try {
    updates
      .filter((u) => u !== "newEmail")
      .forEach((update) => {
        req.customer[update] = req.body[update];
      });
    await req.customer.save();
    res.status(200).json({ message: "Đã thay đổi thông tin thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendOTPForUpdateController = async (req, res) => {
  const oldEmail = req.customer.email;

  try {
    await sendOTPForUpdateService(oldEmail);
    res.json({ message: "OTP đã được gửi đến email cũ" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendOTPForResetController = async (req, res) => {
  const { email } = req.body;

  try {
    await sendOTPForResetService(email);
    res.json({ message: "OTP đã được gửi đến email" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendVerifyEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    await sendVerifyEmailService(email);
    res.status(200).json({ message: "Email xác thực đã được gửi" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPasswordController = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const customer = await resetPasswordService(email, otp, newPassword);
    res
      .status(200)
      .json({ message: "Mật khẩu đã được thay đổi thành công", customer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateAvatarController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được upload" });
    }

    const avatarUrl = req.file.path;

    req.customer.avatar = avatarUrl;
    await req.customer.save();

    res.status(200).json({ message: "Avatar đã được cập nhật" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCustomerController = async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;

    const result = await getAllCustomersService(page, limit);

    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleCustomerStatusController = async (req, res) => {
  try {
    const { customerId } = req.params;

    const result = await toggleCustomerStatusService(customerId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyEmailController = async (req, res) => {
  const { token } = req.query;

  try {
    const customer = await verifyEmailService(token);
    res.status(200).json({
      message: "Xác thực email thành công",
      customer: {
        id: customer._id,
        email: customer.email,
        isVerified: customer.isVerified,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCustomerController = async (req, res) => {
  try {
    if (!req.customer) {
      return res
        .status(404)
        .json({ exists: false, message: "Customer not found" });
    }
    return res.status(200).json({
      exists: true,
    });
  } catch (error) {
    res.status(400).json({ exists: false, message: error.message });
  }
};
export const getCustomerByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("CustomerId:", id);
    const customerData = await getCustomerByIdService(id);
    console.log("CustomerData:", customerData);

    if (!customerData) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    return res.status(200).json({ success: true, data: customerData });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy thông tin người dùng",
      error: error.message,
    });
  }
};

// export const addAddressController = async (req, res) => {
//   const addressData = req.body;

//   try {
//     const newAddress = await
//   } catch (error) {

//   }
// };

export const getAddressesController = async (req, res) => {
  try {
    const customer = req.customer;
    const addresses = customer.addresses || [];
    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy danh sách địa chỉ",
      error: error.message,
    });
  }
};
export const addAddressController = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressDetail,
      address: { city, district, ward },
      isDefault = false,
    } = req.body;
    console.log(req.body);
    const customer = req.customer;
    const newAddress = {
      address: {
        city: city,
        district: district,
        ward: ward,
      },
      addressDetail,
      isDefault: isDefault,
    };
    if (fullName) newAddress.fullName = fullName;
    if (phone) newAddress.phone = phone;

    console.log(newAddress);
    customer.addresses.push(newAddress);

    if (customer.addresses.length === 1) {
      customer.addresses[0].isDefault = true;
    }

    await customer.save();

    return res.status(201).json({
      success: true,
      message: "Thêm địa chỉ thành công",
      data: customer.addresses.at(-1),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Trùng dữ liệu (ví dụ: phone đã tồn tại).",
      });
    }
    console.log(error);
    return res.status(500).json({ success: false, message: "Có lỗi xảy ra" });
  }
};
export const deleteAddressController = async (req, res) => {
  try {
    const customer = req.customer;
    const { id: address_id } = req.params;
    if (!address_id) {
      res
        .status(400)
        .json({ success: false, message: "Thiếu ID địa chỉ cần xóa." });
    }

    const addressIndex = customer.addresses.findIndex(
      (addr) => addr._id.toString() === address_id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Địa chỉ không tồn tại",
      });
    }

    const deletedAddress = customer.addresses[addressIndex];

    customer.addresses.splice(addressIndex, 1);

    if (deletedAddress.isDefault && customer.addresses.length > 0) {
      customer.addresses[0].isDefault = true;
    }

    await customer.save();
    return res.status(200).json({
      success: true,
      message: "Xóa địa chỉ thành công.",
      deletedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi xóa địa chỉ",
      error: error.message,
    });
  }
};

export const updateAddressController = async (req, res) => {
  try {
    const customer = req.customer;
    const { id: address_id } = req.params;
    const updates = req.body;

    if (!address_id) {
      res
        .status(400)
        .json({ success: false, message: "Thiếu ID địa chỉ cần cập nhật." });
    }

    const addressIndex = customer.addresses.findIndex(
      (addr) => addr._id.toString() === address_id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Địa chỉ không tồn tại",
      });
    }

    if (updates.isDefault === true) {
      customer.addresses.forEach((addr, index) => {
        if (index != addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    Object.keys(updates).forEach((key) => {
      customer.addresses[addressIndex][key] = updates[key];
    });

    await customer.save();

    const updatedAddress = customer.addresses[addressIndex];
    return res.status(200).json({
      success: true,
      message: "Cập nhật địa chỉ thành công.",
      data: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi cập nhật địa chỉ.",
      error: error.message,
    });
  }
};
