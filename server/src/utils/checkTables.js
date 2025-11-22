import sequelize from "../config/db.js";
import { Product, Category, Stock } from "../models/index.js";

const checkTables = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Check if tables exist
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('dim_product', 'dim_category', 'dim_stock')
    `);

    console.log("\n📋 Existing tables:", tables.map(t => t.table_name));

    // Sync models to create tables if they don't exist
    await Product.sync({ alter: true });
    console.log("✅ Product table synced");

    await Category.sync({ alter: true });
    console.log("✅ Category table synced");

    await Stock.sync({ alter: true });
    console.log("✅ Stock table synced");

    // Check counts
    const productCount = await Product.count();
    const categoryCount = await Category.count();
    const stockCount = await Stock.count();

    console.log("\n📊 Current data:");
    console.log(`- Products: ${productCount}`);
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Stock records: ${stockCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkTables();
