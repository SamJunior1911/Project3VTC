import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  token: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "email_verification",
      "password_reset",
      "profile_update_otp",
      "phone_verification", // Nếu sau này có verify phone
    ],
    required: true,
  },
  expiresAt: { type: Date, required: true },
});

verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema,
  "verification-token"
);
