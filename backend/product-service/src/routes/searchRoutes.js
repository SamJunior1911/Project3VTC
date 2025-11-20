import express from "express";
import { SearchController } from "../controller/SearchController.js";
const router = express.Router();
router.get("/", SearchController);
export default router;
