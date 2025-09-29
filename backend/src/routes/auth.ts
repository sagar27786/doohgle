import express from "express";
import {
  sendOTP,
  verifySignupOTP,
  login,
  setRole,
  sendMojoAuthOTP,
  verifyMojoAuthOTP,
  loginWithMojoAuthOTP,
  verifyMojoAuthLoginOTP,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// OTP-based signup flow (original)
router.post("/send-otp", sendOTP);
router.post("/verify-signup", verifySignupOTP);

// MojoAuth OTP-based flows
router.post("/mojoauth/send-otp", sendMojoAuthOTP);
router.post("/mojoauth/verify-signup", verifyMojoAuthOTP);
router.post("/mojoauth/login-otp", loginWithMojoAuthOTP);
router.post("/mojoauth/verify-login", verifyMojoAuthLoginOTP);

// Existing login
router.post("/login", login);

// Set role after signup (requires auth)
router.post("/set-role", authMiddleware, setRole);

export default router;
