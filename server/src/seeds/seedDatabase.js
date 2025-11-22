import Role from "../models/Role.js";
import User from "../models/User.js";
import sequelize from "../config/db.js";
import logger from "../config/logger.js";

const seedDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    logger.info("Database connection established");

    // Create/update roles
    const roles = [
      { role_name: "admin", role_id: 1 },
      { role_name: "user", role_id: 2 },
      { role_name: "manager", role_id: 3 },
      { role_name: "viewer", role_id: 4 },
    ];

    for (const role of roles) {
      await Role.findOrCreate({
        where: { role_name: role.role_name },
        defaults: role,
      });
      logger.info(`Role '${role.role_name}' initialized`);
    }

    // Find admin role
    const adminRole = await Role.findOne({ where: { role_name: "admin" } });

    // Create a test admin user
    const adminUser = await User.findOrCreate({
      where: { email: "admin@stockmaster.com" },
      defaults: {
        name: "Admin User",
        email: "admin@stockmaster.com",
        password: "Admin@123456", // This will be hashed by the model hook
        role_key: adminRole.role_key,
        is_active: true,
      },
    });

    if (adminUser[1]) {
      logger.info("Admin user created: admin@stockmaster.com (password: Admin@123456)");
    } else {
      logger.info("Admin user already exists");
    }

    // Create a test regular user
    const regularUser = await User.findOrCreate({
      where: { email: "user@stockmaster.com" },
      defaults: {
        name: "Regular User",
        email: "user@stockmaster.com",
        password: "User@123456", // This will be hashed by the model hook
        role_key: 2, // Regular user role
        is_active: true,
      },
    });

    if (regularUser[1]) {
      logger.info("Regular user created: user@stockmaster.com (password: User@123456)");
    } else {
      logger.info("Regular user already exists");
    }

    logger.info("Seed completed successfully");
  } catch (error) {
    logger.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
