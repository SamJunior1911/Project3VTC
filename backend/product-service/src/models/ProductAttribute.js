import mongoose from "mongoose";

const productAttributeSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  attribute_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attribute",
    required: true,
  },
  type: { type: String, required: true },
  values: [{ type: String, required: true }],
});

export default mongoose.model("ProductAttribute", productAttributeSchema);
