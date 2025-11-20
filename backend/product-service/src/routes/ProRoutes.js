import express from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
//khi upload file, multer sẽ lưu file tạm vào folder "uploads/" trên server của bạn.

import {
  ListProduct,
  CreateProduct,
  DeleteProduct,
  getProductById,
  DecreaseStock,
  UpdateProduct,
  ListActiveProduct,
  getSuggest,
  getDetail,
} from "../controller/ProductController.js";
const router = express.Router();

router.get("/", ListProduct);
router.get("/listproduct", ListActiveProduct);
router.get("/:id", getProductById);
router.get("/:slug/detail", getDetail);
router.post("/get-suggest-books", getSuggest);
router.post("/", upload.array("files", 10), CreateProduct);
router.delete("/:slug", DeleteProduct);
router.post("/decrease-stock", DecreaseStock);
router.put("/:slug", upload.array("files", 10), UpdateProduct);
router.post("/get-suggest-books", getSuggest);
export default router;
