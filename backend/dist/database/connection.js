"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.connectDatabase = exports.pool = void 0;
const pg_1 = require("pg");
// Remove import since pool is declared in this file
// Database connection pool
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER || 'shiv',
    host: process.env.DB_HOST || 'localhost',
    database: 'dooh_platform',
    password: process.env.DB_PASSWORD || 'hcqsQTFBAbnMRuPEupbthV5TyG9OUoMB',
    port: parseInt(process.env.DB_PORT || '5432'),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false // Required for connecting to some hosted PostgreSQL services
    } : false
});
// Connect to database
const connectDatabase = async () => {
    try {
        const client = await exports.pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
// Close database connection
const closeDatabase = async () => {
    try {
        await exports.pool.end();
        console.log('✅ Database connection closed');
    }
    catch (error) {
        console.error('❌ Error closing database connection:', error);
    }
};
exports.closeDatabase = closeDatabase;
