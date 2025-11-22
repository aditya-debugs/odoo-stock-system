import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deactivateCategory,
  reactivateCategory,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireInventoryManager } from "../middleware/authorizationMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET routes - accessible to all authenticated users
router.get("/", getCategories);
router.get("/:id", getCategory);

// POST/PUT/PATCH routes - only Inventory Manager
router.post("/", requireInventoryManager(), createCategory);
router.put("/:id", requireInventoryManager(), updateCategory);
router.patch("/:id/deactivate", requireInventoryManager(), deactivateCategory);
router.patch("/:id/reactivate", requireInventoryManager(), reactivateCategory);

export default router;
