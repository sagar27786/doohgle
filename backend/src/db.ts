import { Pool } from "pg";
import * as dotenv from "dotenv";
import path from "path";

// Load .env file from the project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Centralized pool configuration
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  ssl: process.env.DB_HOST === "localhost" ? false : { rejectUnauthorized: false },
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if connection takes longer than 2 seconds
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

pool
  .connect()
  .then((client) => {
    console.log(`✅ Connected to PostgreSQL (${process.env.DB_HOST}:${process.env.DB_PORT})`);
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err);
  });

pool.on("error", (err: Error) => {
  console.error(
    "pg pool: unexpected error on idle client",
    err?.message || err
  );
});
