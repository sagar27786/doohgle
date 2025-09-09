"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = exports.snsClient = exports.sesClient = exports.AWS_CONSTANTS = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const client_sns_1 = require("@aws-sdk/client-sns");
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure AWS region
const REGION = process.env.AWS_REGION || "us-east-1";
// AWS Constants
exports.AWS_CONSTANTS = {
    REGION: REGION,
    S3_BUCKET: process.env.S3_BUCKET_NAME || 'doohgle'
};
// Create SES client
exports.sesClient = new client_ses_1.SESClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
// Create SNS client
exports.snsClient = new client_sns_1.SNSClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
// Create S3 client
exports.s3Client = new client_s3_1.S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
