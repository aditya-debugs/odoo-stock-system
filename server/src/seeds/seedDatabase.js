import Role from "../models/Role.js";
import User from "../models/User.js";
import sequelize from "../config/db.js";
import logger from "../config/logger.js";

const seedDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info("Database connection established");

    // Create/update roles - Only 2 roles
    const roles = [
      { role_name: "inventory_manager", role_id: 1 },
      { role_name: "warehouse_staff", role_id: 2 },
    ];

    for (const role of roles) {
      await Role.findOrCreate({
        where: { role_name: role.role_name },
        defaults: role,
      });
      logger.info(`Role '${role.role_name}' initialized`);
    }

    // Find inventory manager role
    const managerRole = await Role.findOne({ where: { role_name: "inventory_manager" } });

    // Create a test inventory manager user
    const managerUser = await User.findOrCreate({
      where: { email: "manager@stockmaster.com" },
      defaults: {
        name: "Inventory Manager",
        email: "manager@stockmaster.com",
        password: "Manager@123456", // This will be hashed by the model hook
        role_key: managerRole.role_key,
        is_active: true,
      },
    });

    if (managerUser[1]) {
      logger.info("Inventory Manager created: manager@stockmaster.com (password: Manager@123456)");
    } else {
      logger.info("Inventory Manager already exists");
    }

    // Find warehouse staff role
    const staffRole = await Role.findOne({ where: { role_name: "warehouse_staff" } });

    // Create a test warehouse staff user
    const staffUser = await User.findOrCreate({
      where: { email: "staff@stockmaster.com" },
      defaults: {
        name: "Warehouse Staff",
        email: "staff@stockmaster.com",
        password: "Staff@123456", // This will be hashed by the model hook
        role_key: staffRole.role_key,
        is_active: true,
      },
    });

    if (staffUser[1]) {
      logger.info("Warehouse Staff created: staff@stockmaster.com (password: Staff@123456)");
    } else {
      logger.info("Warehouse Staff already exists");
    }

    logger.info("Seed completed successfully");
  } catch (error) {
    logger.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
