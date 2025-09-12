import { Pool } from "pg";
import * as dotenv from "dotenv";
import path from "path";

// Load .env file from the root directory (where .env actually is)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Centralized pool configuration
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 60000, // Close idle clients after 60 seconds
  connectionTimeoutMillis: 10000, // Return an error if connection takes longer than 10 seconds
  statement_timeout: 30000, // 30 second statement timeout
  query_timeout: 30000, // 30 second query timeout
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
    const dbUrl = process.env.DATABASE_URL;
    const host = dbUrl ? new URL(dbUrl).host : "unknown";
    console.log(`✅ Connected to PostgreSQL (${host})`);
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
