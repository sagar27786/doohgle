import express from "express";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all analytics routes
router.use(authMiddleware);

// Analytics endpoints
router.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "Analytics endpoint - implementation needed"
  });
});

export default router;
