"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env file from the project root
dotenv.config({ path: path_1.default.resolve(__dirname, "../.env") });
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
exports.pool = new pg_1.Pool({
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
exports.pool.on("connect", () => {
    console.log("pg pool: client connected");
});
exports.pool.on("acquire", () => {
    console.log("pg pool: client acquired");
});
exports.pool.on("remove", () => {
    console.log("pg pool: client removed");
});
// Add retry logic for connection
const connectWithRetry = async (retries = 5, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await exports.pool.connect();
            console.log(`✅ Connected to PostgreSQL (${dbHost}:${dbPort})`);
            client.release();
            return;
        }
        catch (err) {
            console.error(`❌ PostgreSQL connection error (attempt ${i + 1}/${retries}):`, err);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    console.error(`Failed to connect to PostgreSQL after ${retries} attempts`);
};
// Initialize connection with retry
connectWithRetry();
exports.pool.on("error", (err) => {
    console.error("pg pool: unexpected error on idle client", err?.message || err);
});
