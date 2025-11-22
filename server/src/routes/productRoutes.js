import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deactivateProduct,
  reactivateProduct,
  getStockByLocation,
  updateStock,
  getLowStockProducts,
} from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireInventoryManager } from "../middleware/authorizationMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET routes - accessible to all authenticated users
router.get("/", getProducts);
router.get("/low-stock", getLowStockProducts);
router.get("/:id", getProduct);
router.get("/:id/stock", getStockByLocation);

// POST/PUT/PATCH routes - only Inventory Manager
router.post("/", requireInventoryManager(), createProduct);
router.put("/:id", requireInventoryManager(), updateProduct);
router.patch("/:id/deactivate", requireInventoryManager(), deactivateProduct);
router.patch("/:id/reactivate", requireInventoryManager(), reactivateProduct);
router.patch("/:id/stock", requireInventoryManager(), updateStock);

export default router;
