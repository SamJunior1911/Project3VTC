import ProRoutes from "./ProRoutes.js";
import CategoryRoutes from "./CategoryRoutes.js";
import ProductAttributeRoutes from "./ProductAttributeRoutes.js";
import AttributeRoutes from "./AttributeRoutes.js";
import assetsRoutes from "./assetsRoutes.js";
import searchRoutes from "./searchRoutes.js";
export const router = (app) => {
  app.use("/api/products", ProRoutes);
  app.use("/categories", CategoryRoutes);
  app.use("/api/productsattribute", ProductAttributeRoutes);
  app.use("/api/attributes", AttributeRoutes);
  app.use("/api/assets", assetsRoutes);
  app.use("/search", searchRoutes);
};
