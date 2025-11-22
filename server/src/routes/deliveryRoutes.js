import express from "express";
import {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  validateDelivery,
} from "../controllers/deliveryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", getDeliveries);
router.get("/:id", getDelivery);
router.post("/", createDelivery);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);
router.post("/:id/validate", validateDelivery);

export default router;
