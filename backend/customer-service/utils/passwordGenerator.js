import crypto from "crypto";

// Tạo mật khẩu ngẫu nhiên
export const randomPassword = () => {
  return crypto.randomBytes(4).toString("hex");
};
