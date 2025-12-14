import express from "express";
import { registerUser, authUser } from "../controllers/authController.js"; // Import authUser

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser); // Add this line

export default router;
