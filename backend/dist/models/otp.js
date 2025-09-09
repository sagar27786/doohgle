"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.saveOTP = exports.createOTPTable = void 0;
const db_1 = require("../db");
const createOTPTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS otps (
      id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(20),
      otp VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      is_used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    await db_1.pool.query(query);
};
exports.createOTPTable = createOTPTable;
const saveOTP = async (identifier, otp, expiresInMinutes = 10) => {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
    // Determine insert clause based on identifier type
    if (identifier.phone) {
        const result = await db_1.pool.query('INSERT INTO otps (phone, otp, expires_at) VALUES ($1, $2, $3) RETURNING *', [identifier.phone, otp, expiresAt]);
        return result.rows[0];
    }
    if (identifier.email) {
        const result = await db_1.pool.query('INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3) RETURNING *', [identifier.email, otp, expiresAt]);
        return result.rows[0];
    }
    throw new Error('saveOTP requires either email or phone');
};
exports.saveOTP = saveOTP;
const verifyOTP = async (identifier, otp) => {
    let result;
    if (identifier.phone) {
        result = await db_1.pool.query('SELECT * FROM otps WHERE phone = $1 AND otp = $2 AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1', [identifier.phone, otp]);
    }
    else if (identifier.email) {
        result = await db_1.pool.query('SELECT * FROM otps WHERE email = $1 AND otp = $2 AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1', [identifier.email, otp]);
    }
    else {
        throw new Error('verifyOTP requires either email or phone');
    }
    if (result.rows.length === 0) {
        return false;
    }
    // Mark OTP as used
    await db_1.pool.query('UPDATE otps SET is_used = TRUE WHERE id = $1', [result.rows[0].id]);
    return true;
};
exports.verifyOTP = verifyOTP;
