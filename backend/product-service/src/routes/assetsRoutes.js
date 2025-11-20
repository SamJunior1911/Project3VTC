import express from "express";
import { listAssetsByProduct } from "../controller/AssetController.js";
const router = express.Router();
router.get("/:id", listAssetsByProduct);
export default router;
