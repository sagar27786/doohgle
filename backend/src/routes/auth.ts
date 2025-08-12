import express from 'express';
import { sendOTP, verifySignupOTP, login } from '../controllers/authController';

const router = express.Router();

// OTP-based signup flow
router.post('/send-otp', sendOTP);
router.post('/verify-signup', verifySignupOTP);

// Existing login
router.post('/login', login);

export default router;
