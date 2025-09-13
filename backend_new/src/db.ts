import { Pool } from "pg";
import * as dotenv from "dotenv";
import path from "path";

// Load .env file from the project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Ensure all credentials are strings
const dbUser = process.env.DB_USER || '';
const dbHost = process.env.DB_HOST || '';
const dbName = process.env.DB_NAME || '';
const dbPassword = process.env.DB_PASSWORD || '';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

// Log database connection info for debugging
console.log(`Connecting to database: ${dbName} on ${dbHost}:${dbPort} as ${dbUser}`);
console.log(`Password is ${dbPassword ? 'set' : 'not set'}`);

// Centralized pool configuration
export const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
  ssl: {
    rejectUnauthorized: false // Accept self-signed certificates
  },
  max: 5, // Reduce max connections to avoid overwhelming the server
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Increase timeout for remote connections
});

pool.on("connect", () => {
  console.log("pg pool: client connected");
});

pool.on("acquire", () => {
  console.log("pg pool: client acquired");
});

pool.on("remove", () => {
  console.log("pg pool: client removed");
});

// Add retry logic for connection
const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log(`✅ Connected to PostgreSQL (${dbHost}:${dbPort})`);
      client.release();
      return;
    } catch (err) {
      console.error(`❌ PostgreSQL connection error (attempt ${i+1}/${retries}):`, err);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error(`Failed to connect to PostgreSQL after ${retries} attempts`);
};

// Initialize connection with retry
connectWithRetry();

pool.on("error", (err) => {
  console.error(
    "pg pool: unexpected error on idle client",
    err?.message || err
  );
});
