"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.uploadScreenMedia = exports.uploadSingleMedia = void 0;
const s3Config_1 = require("../config/s3Config");
// Helper function to delete from S3
const deleteFromS3 = async (keyOrUrl) => {
    try {
        const success = await (0, s3Config_1.deleteFileFromS3)(keyOrUrl);
        if (!success) {
            throw new Error('Failed to delete file from S3');
        }
    }
    catch (error) {
        console.error('Error deleting file from S3:', error);
        throw error;
    }
};
/**
 * Upload single media file (image or video) to S3
 */
const uploadSingleMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        console.log('File upload request received:', {
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
        });
        const file = req.file;
        // Validate file type
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi'];
        const allAllowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
        if (!allAllowedTypes.includes(file.mimetype)) {
            // Delete uploaded file if validation fails
            try {
                await deleteFromS3(file.key);
            }
            catch (deleteError) {
                console.error('Error deleting invalid file:', deleteError);
            }
            return res.status(400).json({
                success: false,
                message: 'Invalid file type. Only JPG, PNG, MP4, MOV, and AVI files are allowed.'
            });
        }
        // Validate file size (10MB for images, 100MB for videos)
        const maxImageSize = 10 * 1024 * 1024; // 10MB
        const maxVideoSize = 100 * 1024 * 1024; // 100MB
        const isImage = allowedImageTypes.includes(file.mimetype);
        const isVideo = allowedVideoTypes.includes(file.mimetype);
        if (isImage && file.size > maxImageSize) {
            try {
                await deleteFromS3(file.key);
            }
            catch (deleteError) {
                console.error('Error deleting oversized file:', deleteError);
            }
            return res.status(400).json({
                success: false,
                message: 'Image file size must be less than 10MB'
            });
        }
        if (isVideo && file.size > maxVideoSize) {
            try {
                await deleteFromS3(file.key);
            }
            catch (deleteError) {
                console.error('Error deleting oversized file:', deleteError);
            }
            return res.status(400).json({
                success: false,
                message: 'Video file size must be less than 100MB'
            });
        }
        res.json({
            success: true,
            message: 'File uploaded successfully',
            url: file.location,
            key: file.key,
            size: file.size,
            mimetype: file.mimetype,
            originalname: file.originalname,
            type: isImage ? 'image' : 'video'
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during file upload',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.uploadSingleMedia = uploadSingleMedia;
/**
 * Upload multiple media files for screen registration
 */
const uploadScreenMedia = async (req, res) => {
    try {
        const files = req.files;
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }
        const uploadedFiles = {};
        const errors = [];
        // Process each field (day_photo, night_photo, video)
        for (const [fieldname, fileArray] of Object.entries(files)) {
            if (fileArray && fileArray.length > 0) {
                const file = fileArray[0]; // Take first file for each field
                try {
                    // Validate based on field type
                    if (fieldname.includes('photo')) {
                        // Image validation
                        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                        if (!allowedImageTypes.includes(file.mimetype)) {
                            try {
                                await deleteFromS3(file.key);
                            }
                            catch (deleteError) {
                                console.error('Error deleting invalid image:', deleteError);
                            }
                            errors.push(`${fieldname}: Invalid image type. Only JPG, PNG, and WebP allowed.`);
                            continue;
                        }
                        const maxImageSize = 10 * 1024 * 1024; // 10MB
                        if (file.size > maxImageSize) {
                            try {
                                await deleteFromS3(file.key);
                            }
                            catch (deleteError) {
                                console.error('Error deleting oversized image:', deleteError);
                            }
                            errors.push(`${fieldname}: Image size must be less than 10MB.`);
                            continue;
                        }
                    }
                    else if (fieldname === 'video') {
                        // Video validation
                        const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
                        if (!allowedVideoTypes.includes(file.mimetype)) {
                            try {
                                await deleteFromS3(file.key);
                            }
                            catch (deleteError) {
                                console.error('Error deleting invalid video:', deleteError);
                            }
                            errors.push(`${fieldname}: Invalid video type. Only MP4, MOV, AVI, and WebM allowed.`);
                            continue;
                        }
                        const maxVideoSize = 100 * 1024 * 1024; // 100MB
                        if (file.size > maxVideoSize) {
                            try {
                                await deleteFromS3(file.key);
                            }
                            catch (deleteError) {
                                console.error('Error deleting oversized video:', deleteError);
                            }
                            errors.push(`${fieldname}: Video size must be less than 100MB.`);
                            continue;
                        }
                    }
                    uploadedFiles[fieldname] = file.location;
                }
                catch (error) {
                    console.error(`Error processing ${fieldname}:`, error);
                    errors.push(`${fieldname}: Processing error occurred.`);
                }
            }
        }
        if (errors.length > 0 && Object.keys(uploadedFiles).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'All file uploads failed',
                errors
            });
        }
        res.json({
            success: true,
            message: 'Files uploaded successfully',
            urls: uploadedFiles,
            errors: errors.length > 0 ? errors : undefined
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during file upload',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.uploadScreenMedia = uploadScreenMedia;
/**
 * Delete media file from S3
 */
const deleteMedia = async (req, res) => {
    try {
        const { key, url } = req.body;
        const keyOrUrl = key || url;
        if (!keyOrUrl || typeof keyOrUrl !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Valid file key or URL is required'
            });
        }
        await deleteFromS3(keyOrUrl);
        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting file from S3',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.deleteMedia = deleteMedia;
