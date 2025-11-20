import express from "express";
import {
  createCoupon,
  getCouponByIdOrCode,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  useCoupon,
  validateCoupon,
  ListCoupon,
} from "../controller/CouponController.js";

const router = express.Router();
router.post("/validate", validateCoupon);
router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.get("/listcoupon", ListCoupon);
router.get("/:id", getCouponByIdOrCode);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);
router.patch("/:id/use", useCoupon);
export default router;
