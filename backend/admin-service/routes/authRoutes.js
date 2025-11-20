import express from "express";
import {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getAdminInfo,
  changePassword,
} from "../controllers/authController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", verifyAdmin, getAdminInfo);
router.put("/change-password", verifyAdmin, changePassword);
export default router;
