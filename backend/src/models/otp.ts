import { pool } from '../db';

export interface OTP {
  id?: number;
  email: string;
  otp: string;
  expires_at: Date;
  is_used: boolean;
  created_at?: Date;
}

export const createOTPTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS otps (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      is_used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

export const saveOTP = async (email: string, otp: string, expiresInMinutes = 10): Promise<OTP> => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
  
  const result = await pool.query(
    'INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [email, otp, expiresAt]
  );
  
  return result.rows[0];
};

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const result = await pool.query(
    'SELECT * FROM otps WHERE email = $1 AND otp = $2 AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
    [email, otp]
  );

  if (result.rows.length === 0) {
    return false;
  }

  // Mark OTP as used
  await pool.query('UPDATE otps SET is_used = TRUE WHERE id = $1', [result.rows[0].id]);
  return true;
};
