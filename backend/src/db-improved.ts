import { Pool } from "pg";
import * as dotenv from "dotenv";
import path from "path";

// Load .env file from the root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Centralized pool configuration with fallback options
const dbConfig = process.env.DATABASE_URL
  ? {
      // Use DATABASE_URL if available
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    }
  : {
      // Fallback to individual environment variables
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      ssl:
        process.env.DB_HOST === "localhost"
          ? false
          : { rejectUnauthorized: false },
    };

export const pool = new Pool({
  ...dbConfig,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 60000, // Close idle clients after 60 seconds
  connectionTimeoutMillis: 5000, // Reduced timeout for faster failure detection
  statement_timeout: 30000, // 30 second statement timeout
  query_timeout: 30000, // 30 second query timeout
});

let isConnected = false;

pool.on("connect", () => {
  console.log("🔗 pg pool: client connected");
  isConnected = true;
});

pool.on("acquire", () => {
  console.log("📋 pg pool: client acquired");
});

pool.on("remove", () => {
  console.log("🗑️  pg pool: client removed");
});

// Test database connection with better error handling
pool
  .connect()
  .then((client) => {
    console.log(`✅ Connected to PostgreSQL database successfully`);
    console.log(
      `🔗 Using ${
        process.env.DATABASE_URL ? "DATABASE_URL" : "individual DB credentials"
      }`
    );
    console.log(`🌍 Host: ${process.env.DB_HOST || "from DATABASE_URL"}`);
    isConnected = true;
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
    console.log("🔧 Connection details:");
    console.log(`   - Host: ${process.env.DB_HOST}`);
    console.log(`   - Port: ${process.env.DB_PORT}`);
    console.log(`   - Database: ${process.env.DB_NAME}`);
    console.log(`   - User: ${process.env.DB_USER}`);
    console.log(
      `   - Using SSL: ${!process.env.DATABASE_URL?.includes("localhost")}`
    );
    console.log("");
    console.log("🚀 API server will continue running in demo mode");
    console.log("💡 Database-dependent features will return mock data");
    console.log("");
    console.log("🔧 To fix the database connection:");
    console.log(
      "   1. Check if your Render database is active (may be suspended)"
    );
    console.log("   2. Verify your DATABASE_URL credentials");
    console.log("   3. Or set up a local PostgreSQL database");
    isConnected = false;
  });

pool.on("error", (err: Error) => {
  console.error(
    "⚠️  pg pool: unexpected error on idle client",
    err?.message || err
  );
  isConnected = false;
});

// Export connection status checker
export const isDatabaseConnected = () => isConnected;

// Export a safe query function that handles disconnection gracefully
export const safeQuery = async (text: string, params?: any[]) => {
  if (!isConnected) {
    throw new Error("Database not connected - running in demo mode");
  }
  return pool.query(text, params);
};
