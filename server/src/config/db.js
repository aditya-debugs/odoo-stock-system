import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Ensure password is treated as a string and handle special characters
const sequelize = new Sequelize(
  process.env.DB_NAME || "Stock_Inventory",
  process.env.DB_USER || "postgres",
  String(process.env.DB_PASSWORD || ""),
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export { sequelize };
export default sequelize;
