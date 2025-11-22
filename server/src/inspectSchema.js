import sequelize from "./config/db.js";
import logger from "./config/logger.js";

const inspectExistingSchema = async () => {
  try {
    // Check fact_receipts structure
    const [receiptsCols] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'fact_receipts'
      ORDER BY ordinal_position;
    `);

    logger.info("\n📋 fact_receipts columns:");
    receiptsCols.forEach((col) => {
      logger.info(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    // Check fact_stock_movement structure
    const [movementCols] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'fact_stock_movement'
      ORDER BY ordinal_position;
    `);

    logger.info("\n📋 fact_stock_movement columns:");
    movementCols.forEach((col) => {
      logger.info(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

  } catch (error) {
    logger.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
};

inspectExistingSchema();
