import sequelize from "./config/db.js";
import logger from "./config/logger.js";

// Import all models
import * as models from "./models/index.js";

const checkDatabase = async () => {
  try {
    logger.info("🔍 Checking database connection...");
    
    // Test connection
    await sequelize.authenticate();
    logger.info("✅ Database connected successfully");

    // Check if tables exist
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    logger.info("\n📋 Existing tables:");
    results.forEach((row) => {
      logger.info(`   ✓ ${row.table_name}`);
    });

    logger.info(`\n📊 Total tables: ${results.length}`);

    // Check for required operations tables
    const requiredTables = [
      "dim_stock_movement",
      "fact_receipt",
      "fact_receipt_line",
      "fact_delivery",
      "fact_delivery_line",
      "fact_transfer",
      "fact_transfer_line",
      "fact_adjustment",
      "fact_adjustment_line",
    ];

    const existingTableNames = results.map((r) => r.table_name);
    const missingTables = requiredTables.filter((t) => !existingTableNames.includes(t));

    if (missingTables.length > 0) {
      logger.warn("\n⚠️  Missing tables:");
      missingTables.forEach((table) => logger.warn(`   ✗ ${table}`));
      logger.info("\n💡 Run: node src/migrations/create_operations_tables.js");
    } else {
      logger.info("\n✅ All operations tables exist!");
    }

  } catch (error) {
    logger.error("❌ Database check failed:", error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
};

checkDatabase();
