import User from "./User.js";
import Role from "./Role.js";
import Product from "./Product.js";
import Category from "./Category.js";
import Stock from "./Stock.js";
import PasswordResetToken from "./PasswordResetToken.js";
import Warehouse from "./Warehouse.js";
import Location from "./Location.js";
import StockMovement from "./StockMovement.js";
import Receipt from "./Receipt.js";
import ReceiptLine from "./ReceiptLine.js";
import Delivery from "./Delivery.js";
import DeliveryLine from "./DeliveryLine.js";
import Transfer from "./Transfer.js";
import TransferLine from "./TransferLine.js";
import Adjustment from "./Adjustment.js";
import AdjustmentLine from "./AdjustmentLine.js";

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

// Receipt associations
Receipt.belongsTo(Location, { foreignKey: "destination_location_key", targetKey: "location_key", as: "destination" });
Receipt.belongsTo(User, { foreignKey: "created_by", targetKey: "user_key", as: "creator" });
Receipt.belongsTo(User, { foreignKey: "validated_by", targetKey: "user_key", as: "validator" });
Receipt.hasMany(ReceiptLine, { foreignKey: "receipt_key", sourceKey: "receipt_key", as: "lines" });
ReceiptLine.belongsTo(Receipt, { foreignKey: "receipt_key", targetKey: "receipt_key" });
ReceiptLine.belongsTo(Product, { foreignKey: "product_key", targetKey: "product_key", as: "product" });

// Delivery associations
Delivery.belongsTo(Location, { foreignKey: "source_location_key", targetKey: "location_key", as: "source" });
Delivery.belongsTo(User, { foreignKey: "created_by", targetKey: "user_key", as: "creator" });
Delivery.belongsTo(User, { foreignKey: "validated_by", targetKey: "user_key", as: "validator" });
Delivery.hasMany(DeliveryLine, { foreignKey: "delivery_key", sourceKey: "delivery_key", as: "lines" });
DeliveryLine.belongsTo(Delivery, { foreignKey: "delivery_key", targetKey: "delivery_key" });
DeliveryLine.belongsTo(Product, { foreignKey: "product_key", targetKey: "product_key", as: "product" });

// Transfer associations
Transfer.belongsTo(Location, { foreignKey: "source_location_key", targetKey: "location_key", as: "source" });
Transfer.belongsTo(Location, { foreignKey: "destination_location_key", targetKey: "location_key", as: "destination" });
Transfer.belongsTo(User, { foreignKey: "created_by", targetKey: "user_key", as: "creator" });
Transfer.belongsTo(User, { foreignKey: "validated_by", targetKey: "user_key", as: "validator" });
Transfer.hasMany(TransferLine, { foreignKey: "transfer_key", sourceKey: "transfer_key", as: "lines" });
TransferLine.belongsTo(Transfer, { foreignKey: "transfer_key", targetKey: "transfer_key" });
TransferLine.belongsTo(Product, { foreignKey: "product_key", targetKey: "product_key", as: "product" });

// Adjustment associations
Adjustment.belongsTo(Location, { foreignKey: "location_key", targetKey: "location_key", as: "location" });
Adjustment.belongsTo(User, { foreignKey: "created_by", targetKey: "user_key", as: "creator" });
Adjustment.belongsTo(User, { foreignKey: "validated_by", targetKey: "user_key", as: "validator" });
Adjustment.hasMany(AdjustmentLine, { foreignKey: "adjustment_key", sourceKey: "adjustment_key", as: "lines" });
AdjustmentLine.belongsTo(Adjustment, { foreignKey: "adjustment_key", targetKey: "adjustment_key" });
AdjustmentLine.belongsTo(Product, { foreignKey: "product_key", targetKey: "product_key", as: "product" });

// Stock Movement associations
StockMovement.belongsTo(Product, { foreignKey: "product_key", targetKey: "product_key", as: "product" });
StockMovement.belongsTo(Location, { foreignKey: "source_location_key", targetKey: "location_key", as: "source" });
StockMovement.belongsTo(Location, { foreignKey: "destination_location_key", targetKey: "location_key", as: "destination" });
StockMovement.belongsTo(User, { foreignKey: "created_by", targetKey: "user_key", as: "creator" });
StockMovement.belongsTo(User, { foreignKey: "validated_by", targetKey: "user_key", as: "validator" });

export { 
  User, 
  Role, 
  Product, 
  Category, 
  Stock, 
  PasswordResetToken, 
  Warehouse, 
  Location,
  StockMovement,
  Receipt,
  ReceiptLine,
  Delivery,
  DeliveryLine,
  Transfer,
  TransferLine,
  Adjustment,
  AdjustmentLine
};
