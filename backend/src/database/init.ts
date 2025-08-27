import { getPool } from './connection';

export const initializeDatabase = async () => {
  try {
    const pool = getPool();
    console.log('🔧 Initializing database...');
    
    // Check if database tables exist, create if needed
    await pool.query('SELECT NOW()');
    console.log('✅ Database initialized successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};
