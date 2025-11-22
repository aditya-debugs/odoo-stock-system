import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUserService = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    const error = new Error("User with this email already exists");
    error.statusCode = 400;
    throw error;
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate token
  const token = generateToken(user.id);

  return {
    user,
    token,
  };
};

export const loginUserService = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // Check if user is active
  if (!user.isActive) {
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

  // Generate token
  const token = generateToken(user.id);

  return {
    user,
    token,
  };
};
