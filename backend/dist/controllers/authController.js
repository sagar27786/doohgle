"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = sendOTP;
exports.verifySignupOTP = verifySignupOTP;
exports.login = login;
exports.setRole = setRole;
const bcryptjs = __importStar(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const otp_1 = require("../models/otp");
const nodemailer_1 = __importDefault(require("nodemailer"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
// Configure Nodemailer to use Ethereal for local testing (no real emails sent).
// An Ethereal test account will be created on first use, and a preview URL will be logged.
let transporterPromise = null;
const EMAIL_TLS_INSECURE = (process.env.EMAIL_TLS_INSECURE || 'false').toLowerCase() === 'true';
async function getTransporter() {
    if (!transporterPromise) {
        transporterPromise = (async () => {
            const testAccount = await nodemailer_1.default.createTestAccount();
            const transportOptions = {
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            };
            if (EMAIL_TLS_INSECURE) {
                transportOptions.tls = { rejectUnauthorized: false };
            }
            const transporter = nodemailer_1.default.createTransport(transportOptions);
            console.log('Ethereal test account created:', testAccount.user);
            return transporter;
        })();
    }
    return transporterPromise;
}
// Generate random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
async function sendOTP(req, res) {
    const { email, phone } = req.body;
    if (!email && !phone) {
        return res.status(400).json({ message: 'Either email or phone is required.' });
    }
    try {
        // If phone provided, we use SMS OTP flow; otherwise email OTP for fallback/dev
        if (phone) {
            // Check existing by phone
            const userByPhone = await db_1.pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
            if (userByPhone.rows.length > 0) {
                return res.status(409).json({ message: 'User with this phone already exists.' });
            }
            const otp = generateOTP();
            await (0, otp_1.saveOTP)({ phone }, otp);
            // TODO: integrate with SMS provider like Twilio. For now, log for dev.
            console.log(`[DEV] SMS OTP to ${phone}: ${otp}`);
            return res.status(200).json({ message: 'OTP sent via SMS' });
        }
        if (email) {
            const userByEmail = await db_1.pool.query('SELECT id FROM users WHERE email = $1', [email]);
            if (userByEmail.rows.length > 0) {
                return res.status(409).json({ message: 'User with this email already exists.' });
            }
            const otp = generateOTP();
            await (0, otp_1.saveOTP)({ email }, otp);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your OTP for Doohgle Signup',
                text: `Your OTP for Doohgle signup is: ${otp}. It will expire in 10 minutes.`,
            };
            const transporter = await getTransporter();
            const info = await transporter.sendMail(mailOptions);
            const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
            if (previewUrl) {
                console.log('Ethereal preview URL:', previewUrl);
            }
            return res.status(200).json({ message: 'OTP sent to email' });
        }
        return res.status(400).json({ message: 'Invalid request' });
    }
    catch (err) {
        console.error('Error sending OTP:', err);
        return res.status(500).json({ message: 'Failed to send OTP', error: err });
    }
}
async function verifySignupOTP(req, res) {
    const { email, phone, otp, password, confirmPassword, name } = req.body;
    if (!otp || !password || !confirmPassword || !phone) {
        return res.status(400).json({ message: 'Phone, OTP, password, and confirmPassword are required.' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }
    try {
        // Verify OTP against phone (primary)
        const isValidOTP = await (0, otp_1.verifyOTP)({ phone }, otp);
        if (!isValidOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        // Ensure uniqueness for phone and optional email
        const existingByPhone = await db_1.pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
        if (existingByPhone.rows.length > 0) {
            return res.status(409).json({ message: 'User with this phone already exists.' });
        }
        if (email) {
            const existingByEmail = await db_1.pool.query('SELECT id FROM users WHERE email = $1', [email]);
            if (existingByEmail.rows.length > 0) {
                return res.status(409).json({ message: 'User with this email already exists.' });
            }
        }
        // Hash password and create user with name, email and phone
        const hashedPassword = await bcryptjs.hash(password, 10);
        const result = await db_1.pool.query('INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, role', [name || '', email || null, phone, hashedPassword]);
        const user = result.rows[0];
        const roles = user.role ? [user.role] : [];
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, phone: user.phone, roles }, JWT_SECRET, { expiresIn: '1d' });
        return res.status(201).json({
            token,
            user: { id: user.id, email: user.email, phone: user.phone, roles }
        });
    }
    catch (err) {
        console.error('Error during signup:', err);
        return res.status(500).json({ message: 'Server error during signup', error: err });
    }
}
async function login(req, res) {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) {
        return res.status(400).json({ message: 'Email or phone and password are required.' });
    }
    try {
        const result = email
            ? await db_1.pool.query('SELECT * FROM users WHERE email = $1', [email])
            : await db_1.pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const user = result.rows[0];
        const valid = await bcryptjs.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const roles = user.role ? [user.role] : [];
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, phone: user.phone, roles }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { id: user.id, email: user.email, phone: user.phone, roles } });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
}
// After signup: set role for the current user
async function setRole(req, res) {
    try {
        // In testing mode we bypass database operations entirely and simply assign the
        // requested role to the current (mock) user and issue a fresh JWT.
        // NOTE: The auth middleware already injects a mock user object when JWT
        // verification fails, so we fall back to id 1 if none is present.
        const userId = req.user?.id || 1;
        const { role } = req.body;
        if (!role || (role !== 'advertiser' && role !== 'venue_owner')) {
            return res.status(400).json({ message: 'Invalid or missing role' });
        }
        // Directly build roles array and sign new token without touching the DB.
        const roles = [role];
        const token = jsonwebtoken_1.default.sign({ id: userId, roles }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({
            token,
            user: {
                id: userId,
                roles,
            },
        });
    }
    catch (err) {
        console.error('Error setting role:', err);
        return res.status(500).json({ message: 'Failed to set role', error: err });
    }
}
