"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.uploadMultipleFiles = exports.uploadSingleFile = void 0;
const s3Config_1 = require("../config/s3Config");
/**
 * Middleware for uploading a single file
 */
exports.uploadSingleFile = s3Config_1.upload.single('file');
/**
 * Middleware for uploading multiple files with different field names
 */
exports.uploadMultipleFiles = s3Config_1.upload;
/**
 * Error handling middleware for multer uploads
 */
const handleUploadError = (error, req, res, next) => {
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
exports.handleUploadError = handleUploadError;
