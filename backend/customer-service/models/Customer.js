import mongoose from "mongoose";
import { hashPassword } from "../utils/password.js";

const customerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    birthDay: { type: Date },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    phone: { type: String, trim: true, unique: true },
    addresses: [
      {
        fullName: { type: String, required: true },
        phone: { type: String, required: true, trim: true },
        address: {
          city: { type: String },
          district: { type: String },
          ward: { type: String },
        },
        addressDetail: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
    city: { type: String },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dyourcloudname/image/upload/default-avatar.png",
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 300, partialFilterExpression: { isVerified: false } }
);

customerSchema.pre("save", async function (next) {
  // Hash password sau khi update
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

customerSchema.pre("save", function (next) {
  const uniqueAddresses = new Set(
    this.addresses.map(
      (a) =>
        `${a.address.city}-${a.address.district}-${a.address.ward}-${a.addressDetail}`
    )
  );

  if (uniqueAddresses.size !== this.addresses.length) {
    return next(new Error("Địa chỉ bị trùng lặp"));
  }
  next();
});

export const Customer = mongoose.model("Customer", customerSchema, "customers");
