import express from "express";
import {
  createPaymentController,
  momoCallbackController,
  vnpayCallbackController,
  getPaymentsByOrderId,
} from "../controller/paymentController.js";

const router = express.Router();

router.post("/create-payment", createPaymentController);

// Nhận callback từ MoMo
router.post("/momo/callback", momoCallbackController);

//Nhận callback từ vnpay
router.get("/vnpay/callback", vnpayCallbackController);
router.get("/:order_id", getPaymentsByOrderId);

export default router;
