import { S3Client } from "@aws-sdk/client-s3";
import { SESClient } from "@aws-sdk/client-ses";
import { SNSClient } from "@aws-sdk/client-sns";

// AWS Configuration
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// AWS Constants
export const AWS_CONSTANTS = {
  S3_BUCKET: process.env.AWS_S3_BUCKET || "doohgle-media-bucket",
  S3_REGION: AWS_REGION,
  S3_BASE_URL: `https://${process.env.AWS_S3_BUCKET || "doohgle-media-bucket"}.s3.${AWS_REGION}.amazonaws.com`,
  CLOUDFRONT_DOMAIN: process.env.AWS_CLOUDFRONT_DOMAIN || "",
  SES_FROM_EMAIL: process.env.AWS_SES_FROM_EMAIL || "noreply@doohgle.com",
  SNS_TOPIC_ARN: process.env.AWS_SNS_TOPIC_ARN || "",
};

// S3 Client Configuration
export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

// SES Client Configuration
export const sesClient = new SESClient({
  region: AWS_REGION,
  credentials: AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

// SNS Client Configuration
export const snsClient = new SNSClient({
  region: AWS_REGION,
  credentials: AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

// Helper function to check if AWS is properly configured
export const isAWSConfigured = (): boolean => {
  return !!(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY);
};

// Export all clients and constants
export default {
  s3Client,
  sesClient,
  snsClient,
  AWS_CONSTANTS,
  isAWSConfigured,
};
