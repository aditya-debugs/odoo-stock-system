import express from "express";
import {
  getTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  deleteTransfer,
  validateTransfer,
} from "../controllers/transferController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", getTransfers);
router.get("/:id", getTransfer);
router.post("/", createTransfer);
router.put("/:id", updateTransfer);
router.delete("/:id", deleteTransfer);
router.post("/:id/validate", validateTransfer);

export default router;
