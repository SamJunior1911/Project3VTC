// import mongoose from "mongoose";
// import Asset from "../models/Asset.js";

// export const listAssetsByProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const objectId = new mongoose.Types.ObjectId(id);
//     const assets = await Asset.find({ product_id: objectId });
//     res.status(200).json(assets);
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server", error: err.message });
//   }
// };

import mongoose from "mongoose";
import Asset from "../models/Asset.js";

export const listAssetsByProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const assets = await Asset.find({ product_id: id }).sort({ createdAt: 1 });
    res.json(assets);
  } catch (error) {
    console.error("listAssetsByProduct error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};