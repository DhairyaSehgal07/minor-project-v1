import express from "express";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
import {
  registerFarmer,
  loginFarmer,
  logoutFarmer,
  getFarmerProfile,
  updateFarmerProfile,
} from "../controllers/farmerController.js";
import {
  farmerForgotPassword,
  resetFarmerPasswordForm,
  updateFarmerPassword,
  successPage,
} from "../utils/farmerForgotPassword.js";
import {
  mobileOtpHandler,
  verifyFarmerMobile,
} from "../utils/phoneVerification.js";

// Authentication routes//
router.post("/register", registerFarmer);
router.post("/login", loginFarmer);
router.post("/logout", logoutFarmer);
router
  .route("/profile")
  .get(protect, getFarmerProfile)
  .put(protect, updateFarmerProfile);

//Reset password routes//
router.post("/forgot-password", farmerForgotPassword);
router
  .route("/reset-password")
  .get(resetFarmerPasswordForm)
  .put(updateFarmerPassword);
router.get("/reset-password/success", successPage);

//verify Mobile Number routes//
router.post("/send-otp", mobileOtpHandler);
router.post("/verify-mobile", verifyFarmerMobile);

export default router;
