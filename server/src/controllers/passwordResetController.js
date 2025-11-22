import { validationResult } from "express-validator";
import {
  requestPasswordReset,
  verifyOTP,
  resetPassword,
} from "../services/passwordResetService.js";
import logger from "../config/logger.js";

export const requestReset = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const result = await requestPasswordReset(email);

    res.json(result);
  } catch (error) {
    logger.error("Request reset controller error:", error.message);
    next(error);
  }
};

export const verifyResetOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;
    const result = await verifyOTP(email, otp);

    res.json(result);
  } catch (error) {
    logger.error("Verify OTP controller error:", error.message);
    next(error);
  }
};

export const resetUserPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;
    const result = await resetPassword(email, otp, newPassword);

    res.json(result);
  } catch (error) {
    logger.error("Reset password controller error:", error.message);
    next(error);
  }
};
