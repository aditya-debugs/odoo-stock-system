import User from "./User.js";
import Role from "./Role.js";
import Product from "./Product.js";

// Set up associations
User.belongsTo(Role, { foreignKey: "role_key", targetKey: "role_key" });

export { User, Role, Product };
