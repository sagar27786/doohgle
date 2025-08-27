import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, AWS_CONSTANTS } from "../config/aws";
import multer from "multer";
import { Request } from "express";

class S3Service {
  private bucket = AWS_CONSTANTS.S3_BUCKET;

  // Configure multer for memory storage
  public upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      // Allow only image files
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"));
      }
    },
  });

  // Upload file to S3
  async uploadFile(
    file: Express.Multer.File,
    folder: string = "screens"
  ): Promise<string> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // Make images publicly accessible
    });

    try {
      await s3Client.send(command);
      return `${AWS_CONSTANTS.S3_BASE_URL}/${key}`;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error("Failed to upload image to S3");
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = "screens"
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  // Get signed URL for private files
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
  }

  // Delete file from S3
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await s3Client.send(command);
    } catch (error) {
      console.error("Error deleting from S3:", error);
      throw new Error("Failed to delete file from S3");
    }
  }

  // Extract S3 key from URL
  extractKeyFromUrl(url: string): string | null {
    const baseUrl = AWS_CONSTANTS.S3_BASE_URL;
    if (url.startsWith(baseUrl)) {
      return url.replace(baseUrl + "/", "");
    }
    return null;
  }

  // Generate public URL
  getPublicUrl(key: string): string {
    return `${AWS_CONSTANTS.S3_BASE_URL}/${key}`;
  }
}

export const s3Service = new S3Service();
