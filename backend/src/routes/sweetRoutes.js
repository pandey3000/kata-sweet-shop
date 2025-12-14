import express from "express";
import {
  createSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet, // Import
  restockSweet, // Import
} from "../controllers/sweetController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchSweets);
router.get("/", protect, getSweets);
router.post("/", protect, createSweet);

router.put("/:id", protect, updateSweet);
router.delete("/:id", protect, admin, deleteSweet);

// Inventory Routes
router.post("/:id/purchase", protect, purchaseSweet);
router.post("/:id/restock", protect, admin, restockSweet);

export default router;
