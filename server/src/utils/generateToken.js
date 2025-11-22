import jwt from "jsonwebtoken";

// Use a default secret for local/dev when JWT_SECRET is not provided to avoid crashes
const getSecret = () => process.env.JWT_SECRET || "dev_jwt_secret_change_in_prod";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const rawSign = (payload, options = {}) => {
  return jwt.sign(payload, getSecret(), options);
};
