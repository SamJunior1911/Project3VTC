import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "admin" },
  resetCode: String, // mã xác nhận quên mật khẩu
  resetCodeExpires: Date,
});

export default mongoose.model("Admin", adminSchema);
