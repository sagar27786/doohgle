import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import { saveOTP, verifyOTP } from "../models/otp";
import nodemailer from "nodemailer";
import {
  sendOTP as sendSMSOTP,
  formatIndianPhoneNumber,
} from "../services/otpService";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const OTP_EXPIRY_MINUTES = 10;

// Rate limiting storage (in production, use Redis)
const otpRequestCounts = new Map<
  string,
  { count: number; resetTime: number }
>();
const MAX_OTP_REQUESTS_PER_HOUR = 3;

// Configure Nodemailer (Ethereal for dev emails)
let transporterPromise: Promise<nodemailer.Transporter> | null = null;
const EMAIL_TLS_INSECURE =
  (process.env.EMAIL_TLS_INSECURE || "false").toLowerCase() === "true";

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      const testAccount = await nodemailer.createTestAccount();
      const transportOptions: any = {
        host: "smtp.ethereal.email",
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
      return nodemailer.createTransport(transportOptions);
    })();
  }
  return transporterPromise;
}

// Generate random 6-digit OTP
const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Rate limiting check for OTP requests
 */
function checkRateLimit(identifier: string): {
  allowed: boolean;
  resetTime?: number;
} {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;

  const record = otpRequestCounts.get(identifier);

  if (!record || now >= record.resetTime) {
    // Reset or create new record
    otpRequestCounts.set(identifier, { count: 1, resetTime: now + hourMs });
    return { allowed: true };
  }

  if (record.count >= MAX_OTP_REQUESTS_PER_HOUR) {
    return { allowed: false, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true };
}

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send OTP (phone -> SMS via AWS SNS, email -> Ethereal)
 */
export async function requestOTP(req: Request, res: Response) {
  const { email, phone } = req.body as { email?: string; phone?: string };

  // Input validation
  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      message: "Either email or phone is required.",
    });
  }

  if (email && !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  if (phone) {
    const formattedPhone = formatIndianPhoneNumber(phone);
    if (!formattedPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid phone number format. Please provide a valid Indian mobile number.",
      });
    }
  }

  const identifier = phone || email!;

  // Rate limiting
  const rateLimitCheck = checkRateLimit(identifier);
  if (!rateLimitCheck.allowed) {
    const resetTime = new Date(rateLimitCheck.resetTime!);
    return res.status(429).json({
      success: false,
      message: "Too many OTP requests. Please try again later.",
      retryAfter: resetTime.toISOString(),
    });
  }

  try {
    const otp = generateOTP();

    if (phone) {
      // Check if phone already registered
      const existing = await pool.query(
        "SELECT id FROM users WHERE phone = $1",
        [formatIndianPhoneNumber(phone)]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "User with this phone number already exists.",
        });
      }

      const formattedPhone = formatIndianPhoneNumber(phone)!;
      await saveOTP({ phone: formattedPhone }, otp);

      console.log(`📱 Sending OTP ${otp} to ${formattedPhone}`); // Remove in production

      const sent = await sendSMSOTP(formattedPhone, otp);

      if (!sent) {
        return res.status(500).json({
          success: false,
          message: "Failed to send SMS OTP. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "OTP sent via SMS",
        expiresIn: `${OTP_EXPIRY_MINUTES} minutes`,
      });
    }

    if (email) {
      const existing = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email.toLowerCase()]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists.",
        });
      }

      await saveOTP({ email: email.toLowerCase() }, otp);

      const transporter = await getTransporter();
      const mailOptions = {
        from: process.env.EMAIL_USER || "noreply@doohgle.com",
        to: email,
        subject: "Your OTP for Doohgle Signup",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Doohgle!</h2>
            <p>Your verification code is:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
              ${otp}
            </div>
            <p><strong>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</strong></p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Best regards,<br>Doohgle Team</p>
          </div>
        `,
        text: `Your Doohgle verification code is: ${otp}. This code will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
      };

      const info = await transporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.log("Ethereal preview URL:", previewUrl);

      return res.status(200).json({
        success: true,
        message: "OTP sent to email",
        expiresIn: `${OTP_EXPIRY_MINUTES} minutes`,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  } catch (err: any) {
    console.error("Error sending OTP:", {
      error: err.message,
      identifier,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

/**
 * Verify OTP + complete signup
 */
export async function verifySignupOTP(req: Request, res: Response) {
  const { email, phone, otp, password, confirmPassword, name } = req.body as {
    email?: string;
    phone?: string;
    otp: string;
    password: string;
    confirmPassword: string;
    name: string;
  };

  // Input validation
  if (!otp || !password || !confirmPassword || (!phone && !email)) {
    return res.status(400).json({
      success: false,
      message:
        "All fields are required: name, phone/email, OTP, password, and confirmPassword.",
    });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "OTP must be a 6-digit number.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name must be at least 2 characters long.",
    });
  }

  // Format phone number if provided
  let formattedPhone: string | null = null;
  if (phone) {
    formattedPhone = formatIndianPhoneNumber(phone);
    if (!formattedPhone) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format.",
      });
    }
  }

  const normalizedEmail = email?.toLowerCase();

  try {
    // Verify OTP
    const identifier = formattedPhone
      ? { phone: formattedPhone }
      : { email: normalizedEmail };
    const isValidOTP = await verifyOTP(identifier, otp);

    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // Double-check uniqueness
    if (formattedPhone) {
      const existing = await pool.query(
        "SELECT id FROM users WHERE phone = $1",
        [formattedPhone]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "User with this phone number already exists.",
        });
      }
    }

    if (normalizedEmail) {
      const existing = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [normalizedEmail]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists.",
        });
      }
    }

    // Hash password & create user
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds
    const result = await pool.query(
      "INSERT INTO users (name, email, phone, password_hash, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, email, phone, role, created_at",
      [
        name.trim(),
        normalizedEmail || null,
        formattedPhone || null,
        hashedPassword,
      ]
    );

    const user = result.rows[0];
    const roles: string[] = user.role ? [user.role] : [];

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        phone: user.phone,
        roles,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      { expiresIn: "7d" } // Extended to 7 days
    );

    // Clear rate limiting for this identifier
    otpRequestCounts.delete(phone || email!);

    console.log(`✅ User registered successfully: ID ${user.id}`);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles,
        createdAt: user.created_at,
      },
    });
  } catch (err: any) {
    console.error("Error during signup:", {
      error: err.message,
      identifier: phone || email,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      success: false,
      message: "Server error during signup. Please try again.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

/**
 * Login with email/phone + password
 */
export async function login(req: Request, res: Response) {
  const { email, phone, password } = req.body as {
    email?: string;
    phone?: string;
    password: string;
  };

  if ((!email && !phone) || !password) {
    return res.status(400).json({
      success: false,
      message: "Email/phone and password are required.",
    });
  }

  try {
    let user;

    if (email) {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email.toLowerCase(),
      ]);
      user = result.rows[0];
    } else if (phone) {
      const formattedPhone = formatIndianPhoneNumber(phone);
      if (!formattedPhone) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number format.",
        });
      }

      const result = await pool.query("SELECT * FROM users WHERE phone = $1", [
        formattedPhone,
      ]);
      user = result.rows[0];
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const roles: string[] = user.role ? [user.role] : [];
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        phone: user.phone,
        roles,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ User logged in successfully: ID ${user.id}`);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles,
      },
    });
  } catch (err: any) {
    console.error("Login error:", {
      error: err.message,
      identifier: email || phone,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}

/**
 * Test OTP SMS functionality (for debugging)
 */
export async function testOTP(req: Request, res: Response) {
  const { phone } = req.body as { phone?: string };

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required for testing",
    });
  }

  try {
    const otp = generateOTP();
    const formattedPhone = formatIndianPhoneNumber(phone);

    if (!formattedPhone) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    console.log(`🧪 Testing OTP send to ${formattedPhone}`);
    const sent = await sendSMSOTP(formattedPhone, otp);

    if (sent) {
      return res.json({
        success: true,
        message: "Test OTP sent successfully",
        phone: formattedPhone,
        otp: otp, // Only for testing - remove in production
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send test OTP",
      });
    }
  } catch (error: any) {
    console.error("Test OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Test OTP failed",
      error: error.message,
    });
  }
}

/**
 * Assign role to user after signup
 */
export async function setRole(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { role } = req.body as { role?: "advertiser" | "venue_owner" };

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!role || (role !== "advertiser" && role !== "venue_owner")) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'advertiser' or 'venue_owner'",
      });
    }

    const result = await pool.query(
      "UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, phone, role",
      [role, userId]
    );

    const updatedUser = result.rows[0];
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const roles: string[] = updatedUser.role ? [updatedUser.role] : [];
    const token = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        roles,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ Role set successfully for user ID ${userId}: ${role}`);

    return res.json({
      success: true,
      message: `Role set successfully to ${role}`,
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        roles,
      },
    });
  } catch (err: any) {
    console.error("Error setting role:", {
      error: err.message,
      userId: (req as any).user?.id,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      success: false,
      message: "Failed to set role",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}
