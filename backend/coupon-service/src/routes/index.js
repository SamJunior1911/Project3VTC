import CouponRoutes from "./CouponRoutes.js";
export const router = (app) => {
  app.use("/api/coupons", CouponRoutes);
};
