import express from "express";
import {
  getAdjustments,
  getAdjustment,
  createAdjustment,
  updateAdjustment,
  deleteAdjustment,
  validateAdjustment,
} from "../controllers/adjustmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", getAdjustments);
router.get("/:id", getAdjustment);
router.post("/", createAdjustment);
router.put("/:id", updateAdjustment);
router.delete("/:id", deleteAdjustment);
router.post("/:id/validate", validateAdjustment);

export default router;
