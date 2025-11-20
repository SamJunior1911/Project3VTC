import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

export default mongoose.model("Attribute", attributeSchema);
//  { "_id": "a1", "name": "Màu sắc", "description": "Các màu có sẵn" },
//size
