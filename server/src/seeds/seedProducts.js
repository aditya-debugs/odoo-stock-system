import sequelize from "../config/db.js";
import { Product, Category, Stock, Location, Warehouse } from "../models/index.js";

const seedProductData = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Create sample categories
    const categories = [
      { category_id: "CAT-000001", name: "Electronics", description: "Electronic items and accessories" },
      { category_id: "CAT-000002", name: "Office Supplies", description: "Office and stationery items" },
      { category_id: "CAT-000003", name: "Furniture", description: "Office and home furniture" },
    ];

    console.log("\n📦 Creating categories...");
    for (const cat of categories) {
      const [category, created] = await Category.findOrCreate({
        where: { category_id: cat.category_id },
        defaults: cat,
      });
      console.log(`${created ? "Created" : "Found"}: ${category.name}`);
    }

    // Get category keys
    const electronicsCategory = await Category.findOne({ where: { name: "Electronics" } });
    const officeCategory = await Category.findOne({ where: { name: "Office Supplies" } });
    const furnitureCategory = await Category.findOne({ where: { name: "Furniture" } });

    // Create sample products
    const products = [
      {
        product_id: "PROD-000001",
        name: "Wireless Mouse",
        sku: "MOUSE-WL-001",
        description: "Ergonomic wireless mouse with USB receiver",
        category_key: electronicsCategory.category_key,
        uom: "Pieces",
        reorder_point: 20,
        price: 25.99,
        is_active: true,
      },
      {
        product_id: "PROD-000002",
        name: "USB Keyboard",
        sku: "KB-USB-001",
        description: "Standard USB keyboard with numeric keypad",
        category_key: electronicsCategory.category_key,
        uom: "Pieces",
        reorder_point: 15,
        price: 35.50,
        is_active: true,
      },
      {
        product_id: "PROD-000003",
        name: "A4 Paper Ream",
        sku: "PAPER-A4-500",
        description: "500 sheets of A4 white paper",
        category_key: officeCategory.category_key,
        uom: "Reams",
        reorder_point: 50,
        price: 5.99,
        is_active: true,
      },
      {
        product_id: "PROD-000004",
        name: "Office Chair",
        sku: "CHAIR-OFF-001",
        description: "Ergonomic office chair with adjustable height",
        category_key: furnitureCategory.category_key,
        uom: "Pieces",
        reorder_point: 5,
        price: 199.99,
        is_active: true,
      },
      {
        product_id: "PROD-000005",
        name: "Ballpoint Pen Box",
        sku: "PEN-BALL-50",
        description: "Box of 50 blue ballpoint pens",
        category_key: officeCategory.category_key,
        uom: "Boxes",
        reorder_point: 10,
        price: 12.50,
        is_active: true,
      },
    ];

    console.log("\n📦 Creating products...");
    for (const prod of products) {
      const [product, created] = await Product.findOrCreate({
        where: { sku: prod.sku },
        defaults: prod,
      });
      console.log(`${created ? "Created" : "Found"}: ${product.name} (${product.sku})`);
    }

    // Try to get first location for stock initialization (skip if none)
    try {
      const location = await Location.findOne();

      if (location) {
        console.log("\n📦 Creating initial stock records...");
        const allProducts = await Product.findAll();
        
        for (const product of allProducts) {
          const [stock, created] = await Stock.findOrCreate({
            where: {
              product_key: product.product_key,
              location_key: location.location_key,
            },
            defaults: {
              product_key: product.product_key,
              location_key: location.location_key,
              quantity: Math.floor(Math.random() * 100) + 50, // Random quantity between 50-150
              reserved_quantity: 0,
              last_updated: new Date(),
            },
          });
          
          if (created) {
            console.log(`Stock created for ${product.name}: ${stock.quantity} ${product.uom}`);
          }
        }
      } else {
        console.log("\n⚠️ No locations found. Skipping stock initialization.");
        console.log("   Products are created. You can add stock later via Settings.");
      }
    } catch (error) {
      console.log("\n⚠️ Could not initialize stock (location table may not exist yet).");
      console.log("   Products are created. You can add stock later.");
    }

    const productCount = await Product.count();
    const categoryCount = await Category.count();
    const stockCount = await Stock.count();

    console.log("\n✅ Seeding complete!");
    console.log(`📊 Total: ${categoryCount} categories, ${productCount} products, ${stockCount} stock records`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedProductData();
