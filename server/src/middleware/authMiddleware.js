import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import logger from "../config/logger.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_key");

    // Find user by user_key
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Get the user's role name
    const userRole = await Role.findByPk(user.role_key);
    const roleName = userRole ? userRole.role_name : "warehouse_staff";

    // Attach user to request with role name
    req.user = {
      ...user.toJSON(),
      role: roleName,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    logger.error("Auth middleware error:", error.message);
    next(error);
  }
};
