import User from "../models/User.js";
import Role from "../models/Role.js";
import { generateToken } from "../utils/generateToken.js";
import logger from "../config/logger.js";

export const registerUserService = async (name, email, password, roleName = "warehouse_staff") => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.statusCode = 400;
      throw error;
    }

    // Validate role name (security check) - only 2 roles allowed
    const allowedRoles = ["inventory_manager", "warehouse_staff"];
    if (!allowedRoles.includes(roleName)) {
      const error = new Error("Invalid role selected. Only 'inventory_manager' and 'warehouse_staff' are allowed.");
      error.statusCode = 400;
      throw error;
    }

    // Get or create the specified role
    let userRole = await Role.findOne({ where: { role_name: roleName } });
    
    if (!userRole) {
      const error = new Error(`Role '${roleName}' not found. Please contact administrator.`);
      error.statusCode = 400;
      throw error;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role_key: userRole.role_key,
      is_active: true,
    });

    logger.info(`New user created: ${email} with role: ${roleName} (role_key: ${userRole.role_key})`);

    // Generate token using user_key
    const token = generateToken(user.user_key);

    // Format response (exclude password, include role name)
    const userResponse = {
      ...user.toJSON(),
      role: userRole.role_name, // Add the actual role name
    };

    return {
      user: userResponse,
      token,
    };
  } catch (error) {
    logger.error("Register service error:", error.message);
    throw error;
  }
};

export const loginUserService = async (email, password) => {
  try {
    // Find user by email (without association since it might not be loaded)
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Check if user is active
    if (!user.is_active) {
      const error = new Error("Account is deactivated");
      error.statusCode = 401;
      throw error;
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Get the user's role name
    const userRole = await Role.findByPk(user.role_key);
    const roleName = userRole ? userRole.role_name : "warehouse_staff"; // fallback

    // Generate token using user_key
    const token = generateToken(user.user_key);

    // Format response (exclude password, include role name)
    const userResponse = {
      ...user.toJSON(),
      role: roleName, // Add the actual role name
    };

    return {
      user: userResponse,
      token,
    };
  } catch (error) {
    logger.error("Login service error:", error.message);
    throw error;
  }
};
