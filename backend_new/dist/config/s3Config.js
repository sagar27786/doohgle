"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = exports.ensureBucketExists = exports.generatePresignedUrl = exports.deleteFileFromS3 = exports.validateFileSize = exports.getFileType = exports.upload = exports.S3_REGION = exports.S3_BUCKET_NAME = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
// Ensure AWS credentials are properly loaded as strings
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
// Log credentials for debugging (only show first few characters for security)
console.log("Using AWS Access Key ID:", AWS_ACCESS_KEY_ID ? AWS_ACCESS_KEY_ID.substring(0, 5) + '...' : 'undefined');
// Configure AWS SDK v3
const s3Config = {
    region: process.env.AWS_REGION || 'us-east-1',
};
if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
    s3Config.credentials = {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    };
}
const s3 = new client_s3_1.S3Client(s3Config);
exports.s3 = s3;
exports.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'doohgle-media-uploads';
exports.S3_REGION = process.env.AWS_REGION || 'us-east-1';
// File type validation
const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo', // .avi
    'video/webm'
];
// File size limits (in bytes)
const MAX_FILE_SIZE = {
    image: 10 * 1024 * 1024, // 10MB for images
    video: 100 * 1024 * 1024 // 100MB for videos
};
// Generate unique filename
const generateFileName = (originalName) => {
    const ext = path_1.default.extname(originalName);
    const timestamp = Date.now();
    const uuid = (0, uuid_1.v4)();
    return `${timestamp}-${uuid}${ext}`;
};
// File filter function
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
    }
};
// Multer S3 configuration
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: exports.S3_BUCKET_NAME,
        //acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {
                fieldName: file.fieldname,
                originalName: file.originalname
            });
        },
        key: (req, file, cb) => {
            const fileName = generateFileName(file.originalname);
            cb(null, fileName);
        }
    }),
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE.video
    }
});
// Utility function to get file type from mimetype
const getFileType = (mimetype) => {
    return mimetype.startsWith('image/') ? 'image' : 'video';
};
exports.getFileType = getFileType;
// Utility function to validate file size based on type
const validateFileSize = (file) => {
    const fileType = (0, exports.getFileType)(file.mimetype);
    const maxSize = MAX_FILE_SIZE[fileType];
    return file.size <= maxSize;
};
exports.validateFileSize = validateFileSize;
// Function to delete file from S3
const deleteFileFromS3 = async (fileUrl) => {
    try {
        // Extract key from URL
        const urlParts = fileUrl.split('/');
        const key = urlParts.slice(-3).join('/'); // Get last 3 parts: screen-media/images|videos/filename
        await s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: exports.S3_BUCKET_NAME,
            Key: key
        }));
        return true;
    }
    catch (error) {
        console.error('Error deleting file from S3:', error);
        return false;
    }
};
exports.deleteFileFromS3 = deleteFileFromS3;
// Function to generate presigned URL for temporary access
const generatePresignedUrl = async (key, expiresIn = 3600) => {
    return await (0, s3_request_presigner_1.getSignedUrl)(s3, new client_s3_1.GetObjectCommand({
        Bucket: exports.S3_BUCKET_NAME,
        Key: key
    }), { expiresIn });
};
exports.generatePresignedUrl = generatePresignedUrl;
// Function to check if S3 bucket exists
const ensureBucketExists = async () => {
    try {
        await s3.send(new client_s3_1.ListObjectsV2Command({
            Bucket: exports.S3_BUCKET_NAME,
            MaxKeys: 1
        }));
        console.log(`S3 bucket ${exports.S3_BUCKET_NAME} exists`);
    }
    catch (error) {
        if (error.name === 'NoSuchBucket' || error.$metadata?.httpStatusCode === 404) {
            throw new Error(`S3 bucket ${exports.S3_BUCKET_NAME} does not exist. Please create it manually in AWS console.`);
        }
        else {
            throw error;
        }
    }
};
exports.ensureBucketExists = ensureBucketExists;
