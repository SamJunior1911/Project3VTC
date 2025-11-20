import express from "express";
import {
  AddToCart,
  GetCart,
  RemoveFromCart,
  updateCartDetail,
  SyncCart,
} from "../controller/CartController.js";

import { requireAuth } from "../middleware/requireAuth.js"; // Middleware JWT

const router = express.Router();

// Cập nhật số lượng
router.put("/:id", requireAuth, updateCartDetail);

// Thêm sản phẩm vào giỏ hàng
router.post("/add/:id", requireAuth, AddToCart);

// Lấy giỏ hàng
router.get("/", requireAuth, GetCart);

// Xóa sản phẩm
router.delete("/:id", requireAuth, RemoveFromCart);

// Đồng bộ giỏ hàng session DB
router.post("/sync", requireAuth, async (req, res) => {
  try {
    const pendingCart = req.body.cart || [];
    if (pendingCart.length === 0)
      return res.status(400).json({ message: "Cart trống" });

    // Gọi controller SyncCart
    await SyncCart(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sync cart thất bại", error: err.message });
  }
});

export default router;
