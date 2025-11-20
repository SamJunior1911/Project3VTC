import CartRoutes from "./CartRoutes.js";

export const router = (app) => {
  app.use("/api/cart", CartRoutes);
};
