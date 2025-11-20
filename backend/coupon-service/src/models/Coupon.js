import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    coupon_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    coupon_type: {
      type: String,
      enum: ["percent", "fixed"], //percent (giảm theo %) hoặc fixed (giảm theo số tiền cố định).
      required: true,
    },

    coupon_value: {
      type: Number,
      required: true, //nếu là loại %, thì là số phần trăm; nếu là loại cố định, thì là số tiền.
      default: 0,
    },

    coupon_start: {
      type: Date,
      required: true,
    },

    coupon_end: {
      type: Date,
      required: true,
    },

    coupon_min_spend: {
      type: Number,
      default: 0, //Số tiền tối thiểu cần đạt để mã có hiệu lực (ví dụ: chỉ áp dụng nếu đơn hàng ≥ 500,000đ).
    },

    coupon_max_spend: {
      type: Number,
      default: null, //Giới hạn tối đa giá trị đơn hàng được phép áp dụng mã (nếu có).
    },

    coupon_uses_per_coupon: {
      type: Number,
      default: 1, //Số lần mã có thể được sử dụng tổng cộng (toàn hệ thống).
    },
    coupon_used_count: { type: Number, default: 0 }, //Thêm trường đếm số lần đã dùng (

    coupon_status: {
      type: String,
      enum: ["active", "expired", "disabled"], //active, expired, disabled
      default: "active",
    },

    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "create_at", updatedAt: "update_at" },
    collection: "coupons",
  }
);

// ✅ Tự động kiểm tra hết hạn coupon mỗi khi truy vấn
couponSchema.pre("find", function (next) {
  const now = new Date();
  this.where({
    $or: [
      { coupon_status: "disabled" },
      { coupon_end: { $gte: now } }, // còn hiệu lực
    ],
  });
  next();
});

// ✅ Hàm kiểm tra xem coupon có còn dùng được không
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.coupon_status === "active" &&
    now >= this.coupon_start &&
    now <= this.coupon_end
  );
};

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
