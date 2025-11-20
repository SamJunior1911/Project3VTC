import express from "express";
import {
  createOrderController,
  getAllOrderCustomerController,
  getAllOrdersAdminController,
  getOrderSummaryController,
  updateOrderStatusController,
  getOrderDetail,
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/create", createOrderController);
router.get("/get", getOrderSummaryController);
router.post("/update", updateOrderStatusController);

router.get("/customer", getAllOrderCustomerController);
router.get("/admin", getAllOrdersAdminController);

router.get("/orderdetail/:id", getOrderDetail);
export default router;
