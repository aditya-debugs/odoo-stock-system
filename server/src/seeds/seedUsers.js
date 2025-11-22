import dotenv from "dotenv";
import sequelize from "../config/db.js";
import User from "../models/User.js";
import logger from "../config/logger.js";

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "User123!",
    role: "user",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "User123!",
    role: "user",
  },
];

const seedUsers = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established");

    await sequelize.sync({ force: true });
    logger.info("Database tables created");

    await User.bulkCreate(users);
    logger.info("Users seeded successfully");

    process.exit(0);
  } catch (error) {
    logger.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
