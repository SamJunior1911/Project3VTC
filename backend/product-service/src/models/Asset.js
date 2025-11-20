import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    file_name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true, // QUAN TRỌNG: để xoá ảnh trên Cloudinary
    },
    type: {
      type: String,
      enum: ["image", "video", "document"],
      required: true,
    },
    size: {
      type: Number,
    },
    delete_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // tự tạo createdAt, updatedAt
  }
);

export default mongoose.model("Asset", assetSchema);