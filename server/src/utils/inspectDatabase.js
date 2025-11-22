import sequelize from "../config/db.js";
import logger from "../config/logger.js";

// Script to inspect your existing PostgreSQL database tables

const inspectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection successful!");

    // Get all table names
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log("\n=== TABLES IN YOUR DATABASE ===");
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });

    // Get columns for each table
    for (const table of tables) {
      console.log(`\n=== Columns in '${table.table_name}' ===`);

      const [columns] = await sequelize.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = '${table.table_name}'
        ORDER BY ordinal_position;
      `);

      columns.forEach((col) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} ${
            col.is_nullable === "NO" ? "(NOT NULL)" : ""
          }`
        );
      });
    }

    process.exit(0);
  } catch (error) {
    logger.error("Error inspecting database:", error);
    process.exit(1);
  }
};

inspectDatabase();
