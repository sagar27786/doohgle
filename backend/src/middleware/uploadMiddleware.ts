import { upload } from '../config/s3Config';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for uploading a single file
 */
export const uploadSingleFile = upload.single('file');

/**
 * Middleware for uploading multiple files with different field names
 */
export const uploadMultipleFiles = upload;

/**
 * Error handling middleware for multer uploads
 */
export const handleUploadError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    console.error('Upload middleware error:', error);
    
    // Handle specific multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 100MB allowed.'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded.'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
    
    // Generic upload error
    return res.status(500).json({
      success: false,
      message: 'File upload failed.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
  
  next();
};