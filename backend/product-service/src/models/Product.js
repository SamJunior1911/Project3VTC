// src/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // nếu có collection Category
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      //Là một chuỗi ký tự dùng trong URL để nhận diện sản phẩm thay vì dùng id.
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0, // % giảm giá
      min: 0,
      max: 100,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    sold: {
      //so luong san pham ban ra
      type: Number,
      default: 0,
      min: 0,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    is_feature: {
      //Là cờ boolean (true/false) để đánh dấu sản phẩm nổi bật.
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
