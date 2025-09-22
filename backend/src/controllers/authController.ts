import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { User } from '../models/user';
import { saveOTP, verifyOTP } from '../models/otp';
import nodemailer from 'nodemailer';
import { mojoAuthBackendService } from '../services/mojoAuthService';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Configure Nodemailer for production email sending
let transporterPromise: Promise<nodemailer.Transporter> | null = null;
const EMAIL_TLS_INSECURE = (process.env.EMAIL_TLS_INSECURE || 'false').toLowerCase() === 'true';

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      // Use environment variables for SMTP configuration
      const transportOptions: any = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
      
      if (EMAIL_TLS_INSECURE) {
        transportOptions.tls = { rejectUnauthorized: false };
      }
      
      if (!transportOptions.auth.user || !transportOptions.auth.pass) {
        throw new Error('SMTP_USER and SMTP_PASS environment variables are required');
      }
      
      const transporter = nodemailer.createTransport(transportOptions);
      console.log('SMTP transporter configured for:', transportOptions.auth.user);
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
      console.log('OTP email sent successfully to:', email);
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
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Check for admin credentials first
  if (email === 'admin@doohgle.com' && password === 'Admin@2025') {
    const adminToken = jwt.sign(
      { 
        id: 999, 
        email: 'admin@doohgle.com', 
        username: 'admin',
        roles: ['admin'] 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Admin login successful',
      token: adminToken,
      user: {
        id: 999,
        email: 'admin@doohgle.com',
        username: 'admin',
        roles: ['admin']
      }
    });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    
    // Check if password exists (some users might not have set password yet)
    if (!user.password_hash) {
      return res.status(401).json({ message: 'Please complete your signup process first.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        roles: user.roles || [] 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
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

// MojoAuth endpoints

/**
 * Send OTP using MojoAuth for email verification
 */
export async function sendMojoAuthOTP(req: Request, res: Response) {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Check if user already exists
    const userByEmail = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userByEmail.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Send OTP using MojoAuth
    const result = await mojoAuthBackendService.sendEmailOTP(email);
    
    return res.status(200).json({
      message: result.message,
      state_id: result.state_id,
    });
  } catch (err: any) {
    console.error('Error sending MojoAuth OTP:', err);
    return res.status(500).json({ 
      message: err.message || 'Failed to send OTP',
      error: err.message
    });
  }
}

/**
 * Verify OTP and complete signup using MojoAuth
 */
export async function verifyMojoAuthOTP(req: Request, res: Response) {
  const { state_id, otp, password, confirmPassword, name } = req.body as {
    state_id: string;
    otp: string;
    password: string;
    confirmPassword: string;
    name?: string;
  };

  if (!state_id || !otp || !password || !confirmPassword) {
    return res.status(400).json({ message: 'State ID, OTP, password, and confirmPassword are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Verify OTP with MojoAuth
    const mojoAuthUser = await mojoAuthBackendService.verifyEmailOTP(state_id, otp);
    
    if (!mojoAuthUser.user_profile?.email) {
      return res.status(400).json({ message: 'Email not found in MojoAuth response.' });
    }

    const email = mojoAuthUser.user_profile.email;

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name || mojoAuthUser.user_profile.name || '', email, hashedPassword]
    );

    const user: any = result.rows[0];
    const roles: string[] = user.role ? [user.role] : [];
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        roles,
        mojoauth_token: mojoAuthUser.oauth.access_token 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name,
        email: user.email, 
        roles 
      },
      mojoauth: {
        access_token: mojoAuthUser.oauth.access_token,
        refresh_token: mojoAuthUser.oauth.refresh_token,
        expires_in: mojoAuthUser.oauth.expires_in
      }
    });
  } catch (err: any) {
    console.error('Error verifying MojoAuth OTP:', err);
    return res.status(500).json({ 
      message: err.message || 'Failed to verify OTP',
      error: err.message
    });
  }
}

/**
 * Login using MojoAuth email OTP
 */
export async function loginWithMojoAuthOTP(req: Request, res: Response) {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Check if user exists
    const userResult = await pool.query('SELECT id, name, email, role FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'User not found. Please sign up first.' });
    }

    // Send OTP using MojoAuth for existing user login
    const result = await mojoAuthBackendService.sendEmailOTP(email);
    
    return res.status(200).json({
      message: result.message,
      state_id: result.state_id,
    });
  } catch (err: any) {
    console.error('Error sending MojoAuth login OTP:', err);
    return res.status(500).json({ 
      message: err.message || 'Failed to send login OTP',
      error: err.message
    });
  }
}

/**
 * Verify login OTP using MojoAuth
 */
export async function verifyMojoAuthLoginOTP(req: Request, res: Response) {
  const { state_id, otp } = req.body as {
    state_id: string;
    otp: string;
  };

  if (!state_id || !otp) {
    return res.status(400).json({ message: 'State ID and OTP are required.' });
  }

  try {
    // Verify OTP with MojoAuth
    const mojoAuthUser = await mojoAuthBackendService.verifyEmailOTP(state_id, otp);
    
    if (!mojoAuthUser.user_profile?.email) {
      return res.status(400).json({ message: 'Email not found in MojoAuth response.' });
    }

    const email = mojoAuthUser.user_profile.email;

    // Get user from database
    const userResult = await pool.query('SELECT id, name, email, role FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const user: any = userResult.rows[0];
    const roles: string[] = user.role ? [user.role] : [];
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        roles,
        mojoauth_token: mojoAuthUser.oauth.access_token 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name,
        email: user.email, 
        roles 
      },
      mojoauth: {
        access_token: mojoAuthUser.oauth.access_token,
        refresh_token: mojoAuthUser.oauth.refresh_token,
        expires_in: mojoAuthUser.oauth.expires_in
      }
    });
  } catch (err: any) {
    console.error('Error verifying MojoAuth login OTP:', err);
    return res.status(500).json({ 
      message: err.message || 'Failed to verify login OTP',
      error: err.message
    });
  }
}
