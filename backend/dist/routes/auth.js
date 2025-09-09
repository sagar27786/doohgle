"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// OTP-based signup flow
router.post('/send-otp', authController_1.sendOTP);
router.post('/verify-signup', authController_1.verifySignupOTP);
// Existing login
router.post('/login', authController_1.login);
// Set role after signup (requires auth)
router.post('/set-role', auth_1.authMiddleware, authController_1.setRole);
exports.default = router;
