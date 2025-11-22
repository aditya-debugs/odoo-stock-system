// Check if line tables exist in the database
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

async function checkLineTables() {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connected\n");

    // Check for line tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE '%_line%'
      ORDER BY table_name;
    `);

    console.log("=== Line Tables ===");
    if (tables.length > 0) {
      tables.forEach((t) => {
        console.log(`✓ ${t.table_name}`);
      });
    } else {
      console.log("✗ No line tables found");
    }

    console.log("\n=== Fact Tables ===");
    const [factTables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'fact_%'
      ORDER BY table_name;
    `);
    
    factTables.forEach((t) => {
      console.log(`✓ ${t.table_name}`);
    });

    // Get structure of each fact table
    for (const table of factTables) {
      console.log(`\n=== ${table.table_name} Structure ===`);
      const [columns] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' 
          AND table_name = '${table.table_name}'
        ORDER BY ordinal_position;
      `);
      
      columns.forEach((col) => {
        console.log(`  ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
      });
    }

    await sequelize.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkLineTables();
