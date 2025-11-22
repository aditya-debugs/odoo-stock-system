import logger from "../config/logger.js";

// EmailJS configuration - emails will be sent from frontend
// This service prepares the email data and logs it
// The actual sending happens via EmailJS SDK on the frontend

export const sendPasswordResetEmail = async (email, otp, userName) => {
  try {
    // Log OTP for development/testing
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info("📧 PASSWORD RESET OTP");
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(`Email: ${email}`);
    logger.info(`OTP Code: ${otp}`);
    logger.info(`User: ${userName || "Unknown"}`);
    logger.info(`Valid for: 10 minutes`);
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const mailOptions = {
      to_email: email,
      to_name: userName || "User",
      otp_code: otp,
      subject: "Password Reset Request - StockMaster",
      message: `Hello ${userName || "User"},\n\nWe received a request to reset your password. Use this verification code: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
    };

    // Return email data for frontend to send via EmailJS
    return mailOptions;
  } catch (error) {
    logger.error("❌ Error sending password reset email:", error.message);
    throw error;
  }
};

export const sendPasswordResetSuccessEmail = async (email, userName) => {
  try {
    logger.info(`✅ Password successfully reset for ${email}`);
    
    const mailOptions = {
      to_email: email,
      to_name: userName || "User",
      subject: "Password Changed Successfully - StockMaster",
      message: `Hello ${userName || "User"},\n\nYour password has been successfully changed. You can now log in with your new password.\n\nIf you didn't make this change, please contact support immediately.`,
    };

    // Return email data for frontend to send via EmailJS
    return mailOptions;
  } catch (error) {
    logger.error("❌ Error sending confirmation email:", error.message);
    throw error;
  }
};
