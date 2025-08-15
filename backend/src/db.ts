import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set. Please set DATABASE_URL in your environment or .env file.');
}

// Helpful parsing to show host/port (avoid logging full connection string)
let dbHost = '';
let dbPort = '';
try {
  if (connectionString) {
    const parsed = new URL(connectionString);
    dbHost = parsed.hostname || '';
    dbPort = parsed.port || '';
  }
} catch (e) {
  // ignore parse errors
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  // smaller timeouts make network issues surface quickly in dev
  // but you can increase these values for flaky networks
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
});


pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL', dbHost ? `(${dbHost}:${dbPort})` : '');
    client.release();
  })
  .catch(err => {
    // Provide more actionable guidance for ETIMEDOUT
    if ((err as any)?.code === 'ETIMEDOUT') {
      console.error(`❌ PostgreSQL connection timed out when connecting to ${dbHost || 'your host'}:${dbPort || '5432'}`);
      console.error('  - Check that the database host is reachable from this machine');
      console.error('  - Ensure the database allows connections from your IP / VPC');
      console.error('  - Verify the port (usually 5432) is open and not blocked by a firewall');
    }
    console.error('❌ PostgreSQL connection error:', err);
  });

// Pool level event listeners to aid debugging intermittent connection closures
pool.on('connect', (client) => {
  console.log('pg pool: client connected');
});

pool.on('acquire', (client) => {
  console.log('pg pool: client acquired');
});

pool.on('remove', (client) => {
  console.log('pg pool: client removed');
});

pool.on('error', (err: Error) => {
  console.error('pg pool: unexpected error on idle client', err?.message || err);
});

