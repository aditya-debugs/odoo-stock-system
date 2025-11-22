import express from "express";
import {
  getStockMovements,
  getStockMovementsByProduct,
  getStockMovementsByLocation,
} from "../controllers/stockMovementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", getStockMovements);
router.get("/product/:productKey", getStockMovementsByProduct);
router.get("/location/:locationKey", getStockMovementsByLocation);

export default router;
