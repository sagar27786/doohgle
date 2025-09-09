import { SESClient } from "@aws-sdk/client-ses";
import { SNSClient } from "@aws-sdk/client-sns";
import { S3Client } from "@aws-sdk/client-s3";
export declare const AWS_CONSTANTS: {
    REGION: string;
    S3_BUCKET: string;
};
export declare const sesClient: SESClient;
export declare const snsClient: SNSClient;
export declare const s3Client: S3Client;
