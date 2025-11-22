import db from "../config/db.js";
import { DataTypes } from "sequelize";

// Migration to add password column to dim_user table
export const up = async () => {
  try {
    const queryInterface = db.getQueryInterface();
    
    // Check if password column already exists
    const columns = await queryInterface.describeTable("dim_user");
    
    if (!columns.password) {
      await queryInterface.addColumn("dim_user", "password", {
        type: DataTypes.STRING,
        allowNull: true, // nullable during migration
      });
      console.log("✅ Password column added to dim_user table");
    } else {
      console.log("ℹ️ Password column already exists in dim_user table");
    }
  } catch (error) {
    console.error("❌ Migration error:", error.message);
    throw error;
  }
};

export const down = async () => {
  try {
    const queryInterface = db.getQueryInterface();
    await queryInterface.removeColumn("dim_user", "password");
    console.log("✅ Password column removed from dim_user table");
  } catch (error) {
    console.error("❌ Rollback error:", error.message);
    throw error;
  }
};
