import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pool } from "../db";
import { s3Client, AWS_CONSTANTS } from "../config/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const router = Router();

// Configure multer for memory storage (for S3 upload)
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

// Upload images to S3
async function uploadImageToS3(
  file: Express.Multer.File,
  screenId: string
): Promise<string> {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const key = `screens/screen-${screenId}-${uniqueSuffix}${path.extname(
    file.originalname
  )}`;

  const uploadParams = {
    Bucket: AWS_CONSTANTS.S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read" as const,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    return `https://${AWS_CONSTANTS.S3_BUCKET}.s3.${AWS_CONSTANTS.REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
}

// Upload images for a screen
router.post(
  "/upload-images/:screenId?",
  upload.array("images", 10),
  async (req: Request, res: Response) => {
    try {
      const { screenId } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No files uploaded",
        });
      }

      console.log(
        `📤 Uploading ${files.length} images to S3 for screen ${
          screenId || "temp"
        }...`
      );

      // Upload all images to S3
      const uploadPromises = files.map((file) =>
        uploadImageToS3(file, screenId || "temp")
      );
      const imageUrls = await Promise.all(uploadPromises);

      console.log(`✅ Successfully uploaded ${imageUrls.length} images to S3`);

      // If screenId is provided, update the database
      if (screenId && screenId !== "temp") {
        const client = await pool.connect();
        try {
          // Get existing images
          const existingResult = await client.query(
            "SELECT image_urls FROM screens WHERE id = $1",
            [screenId]
          );

          let existingUrls: string[] = [];
          if (
            existingResult.rows.length > 0 &&
            existingResult.rows[0].image_urls
          ) {
            try {
              existingUrls =
                JSON.parse(existingResult.rows[0].image_urls) || [];
            } catch (e) {
              existingUrls = [];
            }
          }

          // Combine with new URLs (S3 URLs)
          const allUrls = [...existingUrls, ...imageUrls];

          // Update screen with new image URLs
          await client.query(
            "UPDATE screens SET image_urls = $1, updated_at = NOW() WHERE id = $2",
            [JSON.stringify(allUrls), screenId]
          );

          console.log(
            `📝 Updated database: Screen ${screenId} now has ${allUrls.length} images`
          );

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
        } catch (dbError) {
          console.error("Database error:", dbError);
          res.status(500).json({
            success: false,
            error: "Failed to update database after S3 upload",
          });
        } finally {
          client.release();
        }
      } else {
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
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown upload error",
      });
    }
  }
);

// Serve uploaded files from local storage (fallback for old images)
router.get("/uploads/screens/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), "uploads", "screens", filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

export default router;
