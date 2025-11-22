import express from "express";
import {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deactivateWarehouse,
  reactivateWarehouse,
} from "../controllers/warehouseController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requirePermission, requireInventoryManager } from "../middleware/authorizationMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET routes - Both roles can view warehouses
router.get("/", requirePermission("warehouses", "read"), getWarehouses);
router.get("/:id", requirePermission("warehouses", "read"), getWarehouse);

// POST, PUT, DELETE routes - Only Inventory Manager
router.post("/", requireInventoryManager(), createWarehouse);
router.put("/:id", requireInventoryManager(), updateWarehouse);
router.put("/:id/deactivate", requireInventoryManager(), deactivateWarehouse);
router.put("/:id/reactivate", requireInventoryManager(), reactivateWarehouse);

export default router;
