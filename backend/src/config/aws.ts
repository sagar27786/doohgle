import { S3Client } from "@aws-sdk/client-s3";
import { SESClient } from "@aws-sdk/client-ses";
import { SNSClient } from "@aws-sdk/client-sns";

const AWS_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
};

export const s3Client = new S3Client({
  region: AWS_CONFIG.region,
  credentials: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey,
  },
});

export const sesClient = new SESClient({
  region: AWS_CONFIG.region,
  credentials: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey,
  },
});

export const snsClient = new SNSClient({
  region: AWS_CONFIG.region,
  credentials: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey,
  },
});

export const AWS_CONSTANTS = {
  S3_BUCKET: process.env.S3_BUCKET_NAME!,
  REGION: AWS_CONFIG.region,
  S3_BASE_URL: `https://${process.env.S3_BUCKET_NAME}.s3.${AWS_CONFIG.region}.amazonaws.com`,
};
