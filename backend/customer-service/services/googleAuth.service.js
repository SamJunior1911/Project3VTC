// services/authService.js
import { Customer } from "../models/Customer.js";
import { randomPassword } from "../utils/passwordGenerator.js";

export const handleGoogleLogin = async (profile) => {
  let customer = await Customer.findOne({ email: profile.emails[0].value });

  if (customer) {
    // Nếu đã có tài khoản, cập nhật thông tin(cần xem xét thêm về việc ghi đè thông tin)
    customer.fullName = `${profile.name.givenName} ${profile.name.familyName}`;

    if (!customer.avatar) {
      customer.avatar = profile.photos[0].value;
    }
    if (customer.isActive === false) {
      return null;
    }
    customer.isVerified = true;
    await customer.save();
  } else {
    // Nếu chưa có tài khoản, tạo mới
    customer = new Customer({
      email: profile.emails[0].value,
      fullName: `${profile.name.givenName} ${profile.name.familyName}`,
      avatar: profile.photos[0].value,
      password: randomPassword(),
      isActive: true,
      isVerified: true,
    });
    await customer.save();
  }

  return customer;
};
