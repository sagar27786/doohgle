import { pool } from '../db';

export interface OTP {
  id?: number;
  email?: string;
  phone?: string;
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

export const saveOTP = async (
  identifier: { email?: string; phone?: string },
  otp: string,
  expiresInMinutes = 10
): Promise<OTP> => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
  
  // Determine insert clause based on identifier type
  if (identifier.phone) {
    const result = await pool.query(
      'INSERT INTO otps (phone, otp, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [identifier.phone, otp, expiresAt]
    );
    return result.rows[0];
  }
  if (identifier.email) {
    const result = await pool.query(
      'INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [identifier.email, otp, expiresAt]
    );
    return result.rows[0];
  }
  throw new Error('saveOTP requires either email or phone');
};

export const verifyOTP = async (
  identifier: { email?: string; phone?: string },
  otp: string
): Promise<boolean> => {
  let result;
  if (identifier.phone) {
    result = await pool.query(
      'SELECT * FROM otps WHERE phone = $1 AND otp = $2 AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [identifier.phone, otp]
    );
  } else if (identifier.email) {
    result = await pool.query(
      'SELECT * FROM otps WHERE email = $1 AND otp = $2 AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [identifier.email, otp]
    );
  } else {
    throw new Error('verifyOTP requires either email or phone');
  }

  if (result.rows.length === 0) {
    return false;
  }

  // Mark OTP as used
  await pool.query('UPDATE otps SET is_used = TRUE WHERE id = $1', [result.rows[0].id]);
  return true;
};
