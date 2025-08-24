import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

// Direct connection config without SSL
export const pool = new Pool({
  user: "vishaljha",
  host: "localhost",
  database: "doohgle",
  port: 5432,
  ssl: false,
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
    console.log("✅ Connected to PostgreSQL (localhost:5432)");
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err);
  });

// Pool level event listeners to aid debugging intermittent connection closures
pool.on("connect", (client) => {
  console.log("pg pool: client connected");
});

pool.on("acquire", (client) => {
  console.log("pg pool: client acquired");
});

pool.on("remove", (client) => {
  console.log("pg pool: client removed");
});

pool.on("error", (err: Error) => {
  console.error(
    "pg pool: unexpected error on idle client",
    err?.message || err
  );
});
