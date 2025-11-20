import nodemailer from "nodemailer";
import { checkOtpRateLimit } from "../utils/rateLimiter.js";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  const rateLimit = await checkOtpRateLimit(email);
  if (!rateLimit.allowed) {
    throw new Error(
      `Bạn đã gửi OTP gần đây. Vui lòng thử lại sau ${rateLimit.remainingTime} giây.`
    );
  }
  const mailOption = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOption);
};

export const sendVerificationEmail = async (email, token) => {
  const rateLimit = await checkOtpRateLimit(email);
  if (!rateLimit.allowed) {
    throw new Error(
      `Bạn đã gửi OTP gần đây. Vui lòng thử lại sau ${rateLimit.remainingTime} giây.`
    );
  }
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Xác thực email đăng ký",
    html: `
      <h2>Xác thực email của bạn</h2>
      <p>Click vào link dưới đây để xác thực email:</p>
      <a href="${verificationUrl}">Xác thực email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, otp) => {
  const rateLimit = await checkOtpRateLimit(email);
  if (!rateLimit.allowed) {
    throw new Error(
      `Bạn đã gửi OTP gần đây. Vui lòng thử lại sau ${rateLimit.remainingTime} giây.`
    );
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Đặt lại mật khẩu",
    text: `Mã OTP để đặt lại mật khẩu của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
  };

  await transporter.sendMail(mailOptions);
};
