import express from "express";
import { register, login, getMe, demoLogin } from "../controllers/authController.js";
import { 
  requestReset, 
  verifyResetOTP, 
  resetUserPassword 
} from "../controllers/passwordResetController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
} from "../validations/userValidation.js";
import {
  validateRequestReset,
  validateVerifyOTP,
  validateResetPassword,
} from "../validations/passwordResetValidation.js";

const router = express.Router();

// Authentication routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/demo-login", demoLogin);
router.get("/me", authMiddleware, getMe);

// Password reset routes
router.post("/forgot-password", validateRequestReset, requestReset);
router.post("/verify-otp", validateVerifyOTP, verifyResetOTP);
router.post("/reset-password", validateResetPassword, resetUserPassword);

export default router;
