import User from "./User.js";
import Role from "./Role.js";
import Product from "./Product.js";
import Category from "./Category.js";
import Stock from "./Stock.js";
import PasswordResetToken from "./PasswordResetToken.js";
import Warehouse from "./Warehouse.js";
import Location from "./Location.js";
import Operation from "./Operation.js";
import StockMovement from "./StockMovement.js";
import Receipt from "./Receipt.js";
import Delivery from "./Delivery.js";
import Transfer from "./Transfer.js";
import Adjustment from "./Adjustment.js";

// Set up associations
User.belongsTo(Role, { foreignKey: "role_key", targetKey: "role_key" });
PasswordResetToken.belongsTo(User, { foreignKey: "user_key", targetKey: "user_key" });

// Warehouse-Location associations
Warehouse.hasMany(Location, { foreignKey: "warehouse_key", sourceKey: "warehouse_key", as: "locations" });
Location.belongsTo(Warehouse, { foreignKey: "warehouse_key", targetKey: "warehouse_key", as: "warehouse" });

// Self-referencing Location association (parent-child)
Location.hasMany(Location, { foreignKey: "parent_location_key", sourceKey: "location_key", as: "children" });
Location.belongsTo(Location, { foreignKey: "parent_location_key", targetKey: "location_key", as: "parent" });

// Product-Category associations
Product.belongsTo(Category, { foreignKey: "category_key", targetKey: "category_key", as: "category" });
Category.hasMany(Product, { foreignKey: "category_key", sourceKey: "category_key", as: "products" });

// Product-Stock associations
Product.hasMany(Stock, { foreignKey: "product_key", sourceKey: "product_key", as: "stock" });
Stock.belongsTo(Product, { foreignKey: "product_key", targetKey: "product_key", as: "product" });

// Location-Stock associations
Location.hasMany(Stock, { foreignKey: "location_key", sourceKey: "location_key", as: "stock" });
Stock.belongsTo(Location, { foreignKey: "location_key", targetKey: "location_key", as: "location" });

// Operation associations (parent for all operations)
Operation.belongsTo(User, { foreignKey: "created_by_key", targetKey: "user_key", as: "creator" });
Operation.belongsTo(User, { foreignKey: "validated_by_key", targetKey: "user_key", as: "validator" });

// Receipt associations
Receipt.belongsTo(Operation, { foreignKey: "operation_key", targetKey: "operation_key", as: "operation" });
Operation.hasOne(Receipt, { foreignKey: "operation_key", sourceKey: "operation_key", as: "receipt" });

// Delivery associations
Delivery.belongsTo(Operation, { foreignKey: "operation_key", targetKey: "operation_key", as: "operation" });
Operation.hasOne(Delivery, { foreignKey: "operation_key", sourceKey: "operation_key", as: "delivery" });

// Transfer associations
Transfer.belongsTo(Operation, { foreignKey: "operation_key", targetKey: "operation_key", as: "operation" });
Operation.hasOne(Transfer, { foreignKey: "operation_key", sourceKey: "operation_key", as: "transfer" });

// Adjustment associations
Adjustment.belongsTo(Operation, { foreignKey: "operation_key", targetKey: "operation_key", as: "operation" });
Operation.hasOne(Adjustment, { foreignKey: "operation_key", sourceKey: "operation_key", as: "adjustment" });

// Stock Movement associations
StockMovement.belongsTo(Operation, { foreignKey: "operation_key", targetKey: "operation_key", as: "operation" });
StockMovement.belongsTo(Product, { foreignKey: "product_key", targetKey: "product_key", as: "product" });
StockMovement.belongsTo(Location, { foreignKey: "from_location_key", targetKey: "location_key", as: "fromLocation" });
StockMovement.belongsTo(Location, { foreignKey: "to_location_key", targetKey: "location_key", as: "toLocation" });
StockMovement.belongsTo(User, { foreignKey: "created_by_key", targetKey: "user_key", as: "creator" });
Operation.hasMany(StockMovement, { foreignKey: "operation_key", sourceKey: "operation_key", as: "movements" });

export { 
  User, 
  Role, 
  Product, 
  Category, 
  Stock, 
  PasswordResetToken, 
  Warehouse, 
  Location,
  Operation,
  StockMovement,
  Receipt,
  Delivery,
  Transfer,
  Adjustment
};
