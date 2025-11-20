import express from "express";
import {
  listProductAttributes,
  createProductAttribute,
  updateProductAttribute,
  deleteProductAttribute,
} from "../controller/ProductAttributeController.js";

const router = express.Router();

// Lấy attribute của product
router.get("/:productId", listProductAttributes);

// Tạo attribute cho product
router.post("/", createProductAttribute);

// Cập nhật attribute
router.put("/:id", updateProductAttribute);

// Xóa attribute
router.delete("/:id", deleteProductAttribute);

export default router;
