import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Log credentials for debugging
// AWS S3 configuration - credentials loaded from environment

// Configure AWS SDK v3
const s3Config: {
  region: string;
  credentials?: { accessKeyId: string; secretAccessKey: string };
} = {
  region: process.env.AWS_REGION || "us-east-1",
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const s3 = new S3Client(s3Config);

export const S3_BUCKET_NAME =
  process.env.S3_BUCKET_NAME || "doohgle-media-uploads";
export const S3_REGION = process.env.AWS_REGION || "us-east-1";

// File type validation
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo", // .avi
  "video/webm",
];

// File size limits (in bytes)
const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB for images
  video: 100 * 1024 * 1024, // 100MB for videos
};

// Generate unique filename
const generateFileName = (originalName: string): string => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const uuid = uuidv4();
  return `${timestamp}-${uuid}${ext}`;
};

// File filter function
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`
      )
    );
  }
};

// Multer S3 configuration
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET_NAME,
    //acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname,
      });
    },
    key: (req, file, cb) => {
      const fileName = generateFileName(file.originalname);
      cb(null, fileName);
    },
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE.video,
  },
});

// Utility function to get file type from mimetype
export const getFileType = (mimetype: string): "image" | "video" => {
  return mimetype.startsWith("image/") ? "image" : "video";
};

// Utility function to validate file size based on type
export const validateFileSize = (file: Express.Multer.File): boolean => {
  const fileType = getFileType(file.mimetype);
  const maxSize = MAX_FILE_SIZE[fileType];
  return file.size <= maxSize;
};

// Function to delete file from S3
export const deleteFileFromS3 = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extract key from URL
    const urlParts = fileUrl.split("/");
    const key = urlParts.slice(-3).join("/"); // Get last 3 parts: screen-media/images|videos/filename

    await s3.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
      })
    );

    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return false;
  }
};

// Function to generate presigned URL for temporary access
export const generatePresignedUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string> => {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn }
  );
};

// Function to check if S3 bucket exists
export const ensureBucketExists = async (): Promise<void> => {
  try {
    await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME,
        MaxKeys: 1,
      })
    );
    console.log(`S3 bucket ${S3_BUCKET_NAME} exists`);
  } catch (error: any) {
    if (
      error.name === "NoSuchBucket" ||
      error.$metadata?.httpStatusCode === 404
    ) {
      throw new Error(
        `S3 bucket ${S3_BUCKET_NAME} does not exist. Please create it manually in AWS console.`
      );
    } else {
      throw error;
    }
  }
};

export { s3 };
