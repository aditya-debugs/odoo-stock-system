import crypto from "crypto";
import User from "../models/User.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "./emailService.js";
import logger from "../config/logger.js";
import { Op } from "sequelize";

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const requestPasswordReset = async (email) => {
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not for security
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return {
        success: true,
        message: "If an account exists with this email, you will receive a password reset code.",
      };
    }

    if (!user.is_active) {
      const error = new Error("Account is deactivated");
      error.statusCode = 403;
      throw error;
    }

    // Delete any existing unused tokens for this user
    await PasswordResetToken.destroy({
      where: {
        user_key: user.user_key,
        is_used: false,
      },
    });

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await PasswordResetToken.create({
      user_key: user.user_key,
      email: user.email,
      otp,
      expires_at: expiresAt,
      is_used: false,
    });

    // Get email data for frontend to send via EmailJS
    const emailData = await sendPasswordResetEmail(user.email, otp, user.name);

    logger.info(`Password reset OTP generated for user: ${email}`);

    return {
      success: true,
      message: "Password reset code has been sent to your email.",
      emailData, // Return email data for frontend
    };
  } catch (error) {
    logger.error("Request password reset error:", error.message);
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    // Find valid, unused token
    const resetToken = await PasswordResetToken.findOne({
      where: {
        email,
        otp,
        is_used: false,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
      order: [["created_at", "DESC"]],
    });

    if (!resetToken) {
      const error = new Error("Invalid or expired verification code");
      error.statusCode = 400;
      throw error;
    }

    logger.info(`OTP verified successfully for email: ${email}`);

    return {
      success: true,
      message: "Verification code is valid",
      tokenId: resetToken.id,
    };
  } catch (error) {
    logger.error("Verify OTP error:", error.message);
    throw error;
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    // Verify OTP again
    const resetToken = await PasswordResetToken.findOne({
      where: {
        email,
        otp,
        is_used: false,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
      order: [["created_at", "DESC"]],
    });

    if (!resetToken) {
      const error = new Error("Invalid or expired verification code");
      error.statusCode = 400;
      throw error;
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Update password (will be hashed by the beforeUpdate hook)
    await user.update({ password: newPassword });

    // Mark token as used
    await resetToken.update({ is_used: true });

    // Get success email data for frontend to send via EmailJS
    const emailData = await sendPasswordResetSuccessEmail(user.email, user.name);

    logger.info(`Password reset successfully for user: ${email}`);

    return {
      success: true,
      message: "Password has been reset successfully",
      emailData, // Return email data for frontend
    };
  } catch (error) {
    logger.error("Reset password error:", error.message);
    throw error;
  }
};
