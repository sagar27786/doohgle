import express from "express";
import {
  requestOTP,
  verifySignupOTP,
  login,
  setRole,
  testOTP,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// OTP-based signup flow
router.post("/send-otp", requestOTP);
router.post("/verify-signup", verifySignupOTP);

// Test OTP functionality (for debugging)
router.post("/test-otp", testOTP);

// Existing login
router.post("/login", login);

// Set role after signup (requires auth)
router.post("/set-role", authMiddleware, setRole);

export default router;
