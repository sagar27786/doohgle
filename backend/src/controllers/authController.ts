import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { User } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function signup(req: Request, res: Response) {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }
  try {
    console.log("User does not exist one");
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    console.log("User does not exist");
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    const user: User = result.rows[0];
    const roles: string[] = [];
    const token = jwt.sign({ id: user.id, email: user.email, roles }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, roles } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
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
