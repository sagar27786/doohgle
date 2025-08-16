import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://vishaljha:@localhost:5432/doohgle",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err);
  });
