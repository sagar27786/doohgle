"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("../db");
const client_s3_1 = require("@aws-sdk/client-s3");
// AWS Constants
const AWS_CONSTANTS = {
    S3_BUCKET: process.env.S3_BUCKET_NAME || "",
    REGION: process.env.AWS_REGION || "ap-southeast-1"
};
// Ensure AWS credentials are strings
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
// Initialize S3 Client
const s3Client = new client_s3_1.S3Client({
    region: AWS_CONSTANTS.REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});
const client_s3_2 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const router = (0, express_1.Router)();
// Configure multer for memory storage (for S3 upload)
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: fileFilter,
});
// Upload images to S3
async function uploadImageToS3(file, screenId) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const key = `screens/screen-${screenId}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`;
    const uploadParams = {
        Bucket: AWS_CONSTANTS.S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        await s3Client.send(new client_s3_2.PutObjectCommand(uploadParams));
        // Generate a signed URL that's valid for 7 days
        const getObjectParams = {
            Bucket: AWS_CONSTANTS.S3_BUCKET,
            Key: key,
        };
        const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, new client_s3_2.GetObjectCommand(getObjectParams), {
            expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
        });
        return signedUrl;
    }
    catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Failed to upload image to S3");
    }
}
// Upload images for a screen
router.post("/upload-images/:screenId?", upload.array("images", 10), async (req, res) => {
    try {
        const { screenId } = req.params;
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                error: "No files uploaded",
            });
        }
        console.log(`📤 Uploading ${files.length} images to S3 for screen ${screenId || "temp"}...`);
        // Upload all images to S3
        const uploadPromises = files.map((file) => uploadImageToS3(file, screenId || "temp"));
        const imageUrls = await Promise.all(uploadPromises);
        console.log(`✅ Successfully uploaded ${imageUrls.length} images to S3`);
        // If screenId is provided, update the database
        if (screenId && screenId !== "temp") {
            const client = await db_1.pool.connect();
            try {
                // Get existing images
                const existingResult = await client.query("SELECT image_urls FROM screens WHERE id = $1", [screenId]);
                let existingUrls = [];
                if (existingResult.rows.length > 0 &&
                    existingResult.rows[0].image_urls) {
                    try {
                        existingUrls =
                            JSON.parse(existingResult.rows[0].image_urls) || [];
                    }
                    catch (e) {
                        existingUrls = [];
                    }
                }
                // Combine with new URLs (S3 URLs)
                const allUrls = [...existingUrls, ...imageUrls];
                // Update screen with new image URLs
                await client.query("UPDATE screens SET image_urls = $1, updated_at = NOW() WHERE id = $2", [JSON.stringify(allUrls), screenId]);
                console.log(`📝 Updated database: Screen ${screenId} now has ${allUrls.length} images`);
                res.json({
                    success: true,
                    data: {
                        imageUrls: allUrls,
                        count: allUrls.length,
                        files: files.map((file, index) => ({
                            originalName: file.originalname,
                            filename: `screen-${screenId}-${Date.now()}`,
                            size: file.size,
                            url: imageUrls[index],
                        })),
                    },
                    message: `Successfully uploaded ${files.length} images to AWS S3`,
                });
            }
            catch (dbError) {
                console.error("Database error:", dbError);
                res.status(500).json({
                    success: false,
                    error: "Failed to update database after S3 upload",
                });
            }
            finally {
                client.release();
            }
        }
        else {
            // Temporary upload (no database update)
            res.json({
                success: true,
                data: {
                    imageUrls,
                    count: imageUrls.length,
                    files: files.map((file, index) => ({
                        originalName: file.originalname,
                        filename: `temp-${Date.now()}`,
                        size: file.size,
                        url: imageUrls[index],
                    })),
                },
                message: `Successfully uploaded ${files.length} temporary images to AWS S3`,
            });
        }
    }
    catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown upload error",
        });
    }
});
// Serve uploaded files from local storage (fallback for old images)
router.get("/uploads/screens/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path_1.default.join(process.cwd(), "uploads", "screens", filename);
    if (fs_1.default.existsSync(filePath)) {
        res.sendFile(filePath);
    }
    else {
        res.status(404).json({ error: "File not found" });
    }
});
exports.default = router;
