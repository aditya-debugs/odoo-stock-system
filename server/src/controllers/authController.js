import { validationResult } from "express-validator";
import {
  registerUserService,
  loginUserService,
} from "../services/userService.js";
import User from "../models/User.js";
import demoAccounts from "../data/demoAccounts.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const result = await registerUserService(name, email, password);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await loginUserService(email, password);

    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Demo login — issues a JWT for a demo user without touching the DB.
// Accepts { email } or { role } in body. If none, defaults to admin.
export const demoLogin = async (req, res) => {
  try {
    const { email, role } = req.body || {};

    let user = null;

    if (email) {
      user = demoAccounts.find((a) => a.email === email);
    } else if (role) {
      user = demoAccounts.find((a) => a.role === role);
    } else {
      user = demoAccounts.find((a) => a.role === "admin");
    }

    if (!user) {
      return res.status(400).json({ success: false, message: "Demo user not found" });
    }

    const token = generateToken(user.id ?? 0);

    // return a user object (no password) and token similar to login endpoint
    const { password: _pwd, ...userSafe } = user;

    return res.json({ success: true, message: "Demo login", data: { user: userSafe, token } });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Demo login failed" });
  }
};
