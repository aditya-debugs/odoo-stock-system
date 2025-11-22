import express from "express";
import {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deactivateLocation,
  reactivateLocation,
} from "../controllers/locationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requirePermission, requireInventoryManager } from "../middleware/authorizationMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET routes - Both roles can view locations
router.get("/", requirePermission("locations", "read"), getLocations);
router.get("/:id", requirePermission("locations", "read"), getLocation);

// POST, PUT, DELETE routes - Only Inventory Manager
router.post("/", requireInventoryManager(), createLocation);
router.put("/:id", requireInventoryManager(), updateLocation);
router.put("/:id/deactivate", requireInventoryManager(), deactivateLocation);
router.put("/:id/reactivate", requireInventoryManager(), reactivateLocation);

export default router;
