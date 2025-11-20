import express from "express";
import { Customer } from "../models/Customer.js";
import {
  getProfile,
  loginController,
  registerController,
  resetPasswordController,
  sendOTPForResetController,
  sendOTPForUpdateController,
  updateAvatarController,
  updateProfileController,
  googleCallbackController,
  googleFailureController,
  getAllCustomerController,
  toggleCustomerStatusController,
  verifyEmailController,
  sendVerifyEmailController,
  getCustomerController,
  changePasswordController,
  getCustomerByIdController,
  getAddressesController,
  updateAddressController,
  addAddressController,
  deleteAddressController,
} from "../controller/customer.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { upload } from "../middleware/upload.js";
import passport from "../config/passport.js";

const router = express.Router();

// Google OAuth
router.get("/google", (req, res, next) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: JSON.stringify({ redirect }),
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/auth/error?message=Đăng+nhập+Google+thất+bại+do+tài+khoản+đã+bị+cấm`,
  }),
  (req, res) => {
    const state = JSON.parse(req.query.state || "{}");
    const redirect = state.redirect || "/";
    googleCallbackController(req, res, redirect);
  }
);

router.get("/google/failure", googleFailureController);

//auth
router.post(`/register`, registerController);
router.post(`/login`, loginController);

//Profile
router.get(`/profile`, requireAuth, getProfile);
router.patch(`/profile`, requireAuth, updateProfileController);
router.post(`/create-address`, requireAuth, addAddressController);
router.patch(`/update-address`, requireAuth, updateAddressController);
router.get(`/addresses`, requireAuth, getAddressesController);
router.delete(`/address/:id`, requireAuth, deleteAddressController);
router.patch(`/address/:id`, requireAuth, updateAddressController);
//OTP - verification
router.get(`/send-otp-update`, requireAuth, sendOTPForUpdateController);
router.post(`/send-otp-reset`, sendOTPForResetController);
router.post(`/reset-password`, resetPasswordController);
router.get("/verify-email", verifyEmailController);
router.post("/send-verification", sendVerifyEmailController);

//avatar
router.patch(
  "/avatar",
  requireAuth,
  upload.single("avatar"),
  updateAvatarController
);
router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email)
      return res.status(400).json({ message: "Email không được để trống" });

    const exists = await Customer.findOne({ email }); // 👈 nếu Customer undefined => lỗi server
    res.json({ exists: !!exists });
  } catch (err) {
    console.error("Lỗi check-email:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
// customer
router.get("/admin/customers", getAllCustomerController); // Lấy tất cả khách hàng
router.get("/admin/customer", requireAuth, getCustomerController);
router.get("/:id", getCustomerByIdController);
router.patch(
  "/admin/customer/:customerId/toggle-status",
  toggleCustomerStatusController
); // Khóa/mở khóa tài khoản
router.patch("/change-password", requireAuth, changePasswordController);

export default router;
