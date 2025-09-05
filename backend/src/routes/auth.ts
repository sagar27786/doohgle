import express from 'express';
import { sendOTP, verifySignupOTP, login, setRole } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// OTP-based signup flow
router.post('/send-otp', sendOTP);
router.post('/verify-signup', verifySignupOTP);

// Existing login
router.post('/login', login);

// Set role after signup (requires auth)
router.post('/set-role', authMiddleware, setRole);

export default router;
