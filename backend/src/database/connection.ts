import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool;

export const connectDatabase = async () => {
  try {
    pool = new Pool({
      user: process.env.DB_USER || 'vishaljha',
      host: process.env.DB_HOST || 'localhost', 
      database: process.env.DB_NAME || 'ads_manager_db',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '5432'),
    });

    await pool.connect();
    console.log('✅ Database connected successfully');
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDatabase first.');
  }
  return pool;
};
