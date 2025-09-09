import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { User } from '../models/user';
import { saveOTP, verifyOTP } from '../models/otp';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Configure Nodemailer to use Ethereal for local testing (no real emails sent).
// An Ethereal test account will be created on first use, and a preview URL will be logged.
let transporterPromise: Promise<nodemailer.Transporter> | null = null;
const EMAIL_TLS_INSECURE = (process.env.EMAIL_TLS_INSECURE || 'false').toLowerCase() === 'true';

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      const testAccount = await nodemailer.createTestAccount();
      const transportOptions: any = {
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
      const transporter = nodemailer.createTransport(transportOptions);
      console.log('Ethereal test account created:', testAccount.user);
      return transporter;
    })();
  }
  return transporterPromise;
}

// Generate random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function sendOTP(req: Request, res: Response) {
  const { email, phone } = req.body as { email?: string; phone?: string };

  if (!email && !phone) {
    return res.status(400).json({ message: 'Either email or phone is required.' });
  }

  try {
    // If phone provided, we use SMS OTP flow; otherwise email OTP for fallback/dev
    if (phone) {
      // Check existing by phone
      const userByPhone = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
      if (userByPhone.rows.length > 0) {
        return res.status(409).json({ message: 'User with this phone already exists.' });
      }

      const otp = generateOTP();
      await saveOTP({ phone }, otp);
      // TODO: integrate with SMS provider like Twilio. For now, log for dev.
      console.log(`[DEV] SMS OTP to ${phone}: ${otp}`);
      return res.status(200).json({ message: 'OTP sent via SMS' });
    }

    if (email) {
      const userByEmail = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userByEmail.rows.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists.' });
      }

      const otp = generateOTP();
      await saveOTP({ email }, otp);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Doohgle Signup',
        text: `Your OTP for Doohgle signup is: ${otp}. It will expire in 10 minutes.`,
      };
      const transporter = await getTransporter();
      const info = await transporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('Ethereal preview URL:', previewUrl);
      }
      return res.status(200).json({ message: 'OTP sent to email' });
    }

    return res.status(400).json({ message: 'Invalid request' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ message: 'Failed to send OTP', error: err });
  }
}

export async function verifySignupOTP(req: Request, res: Response) {
  const { email, phone, otp, password, confirmPassword, name } = req.body as {
    email?: string; phone?: string; otp: string; password: string; confirmPassword: string; name: string;
  };

  if (!otp || !password || !confirmPassword || !phone) {
    return res.status(400).json({ message: 'Phone, OTP, password, and confirmPassword are required.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Verify OTP against phone (primary)
    const isValidOTP = await verifyOTP({ phone }, otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Ensure uniqueness for phone and optional email
    const existingByPhone = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existingByPhone.rows.length > 0) {
      return res.status(409).json({ message: 'User with this phone already exists.' });
    }
    if (email) {
      const existingByEmail = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingByEmail.rows.length > 0) {
        return res.status(409).json({ message: 'User with this email already exists.' });
      }
    }

    // Hash password and create user with name, email and phone
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, role',
      [name || '', email || null, phone, hashedPassword]
    );

    const user: any = result.rows[0];
    const roles: string[] = user.role ? [user.role] : [];
    const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone, roles }, JWT_SECRET, { expiresIn: '1d' });
    console.log("the token generated is : " ,token);

    return res.status(201).json({ 
      token, 
      user: { id: user.id, email: user.email, phone: user.phone, roles }
    });
  } catch (err) {
    console.error('Error during signup:', err);
    return res.status(500).json({ message: 'Server error during signup', error: err });
  }
}

export async function login(req: Request, res: Response) {
  const { email, phone, password } = req.body as { email?: string; phone?: string; password: string };
  if ((!email && !phone) || !password) {
    return res.status(400).json({ message: 'Email or phone and password are required.' });
  }
  try {
    const result = email
      ? await pool.query('SELECT * FROM users WHERE email = $1', [email])
      : await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const user: any = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const roles: string[] = user.role ? [user.role] : [];
    const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone, roles }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, user: { id: user.id, email: user.email, phone: user.phone, roles } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
}

// After signup: set role for the current user
export async function setRole(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { role } = req.body as { role?: 'advertiser' | 'venue_owner' };
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!role || (role !== 'advertiser' && role !== 'venue_owner')) {
      return res.status(400).json({ message: 'Invalid or missing role' });
    }
    
    // First verify the user exists
    const userCheck = await pool.query('SELECT id, email, phone FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update the user's role
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, phone, role', 
      [role, userId]
    );
    
    const updatedUser = result.rows[0];
    if (!updatedUser) {
      return res.status(500).json({ message: 'Failed to update user role' });
    }
    
    const roles: string[] = updatedUser.role ? [updatedUser.role] : [];
    const token = jwt.sign(
      { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        phone: updatedUser.phone, 
        roles 
      }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    return res.json({ 
      token, 
      user: { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        phone: updatedUser.phone, 
        roles 
      } 
    });
  } catch (err) {
    console.error('Error setting role:', err);
    return res.status(500).json({ message: 'Failed to set role', error: err });
  }
}