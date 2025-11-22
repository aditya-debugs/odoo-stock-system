import express from "express";
import {
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceipt,
  deleteReceipt,
  validateReceipt,
} from "../controllers/receiptController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", getReceipts);
router.get("/:id", getReceipt);
router.post("/", createReceipt);
router.put("/:id", updateReceipt);
router.delete("/:id", deleteReceipt);
router.post("/:id/validate", validateReceipt);

export default router;
