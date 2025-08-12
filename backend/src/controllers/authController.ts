import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
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
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Check if user already exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Generate and save OTP
    const otp = generateOTP();
    await saveOTP(email, otp);

    // Send OTP via email
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
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP shiv', error: err });
  }
}

export async function verifySignupOTP(req: Request, res: Response) {
  const { email, otp, password, confirmPassword } = req.body;
  
  if (!email || !otp || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Verify OTP
    const isValidOTP = await verifyOTP(email, otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    
    const user: User = result.rows[0];
    const roles: string[] = [];
    const token = jwt.sign({ id: user.id, email: user.email, roles }, JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        roles 
      } 
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Server error during signup', error: err });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const user: User = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Fetch roles from user_roles table (may be empty)
    const rolesRes = await pool.query('SELECT role FROM user_roles WHERE user_id = $1', [user.id]);
    const roles: string[] = rolesRes.rows.map((r: { role: string }) => r.role);
    const token = jwt.sign({ id: user.id, email: user.email, roles }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, roles } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}
