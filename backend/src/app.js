import express from "express";
import cors from "cors";
import connectDB from "./db.js"; // Import DB
import authRoutes from "./routes/authRoutes.js"; // Import Routes
import sweetRoutes from "./routes/sweetRoutes.js";
const app = express();

// Connect to Database (Only if not in test mode to avoid double connection during watch mode)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Sweet Shop API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
export default app;
