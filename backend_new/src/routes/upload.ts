import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { uploadSingleFile, uploadMultipleFiles, handleUploadError } from '../middleware/uploadMiddleware';
import { uploadSingleMedia, uploadScreenMedia, deleteMedia } from '../controllers/uploadController';

const router = express.Router();

/**
 * @route POST /api/upload/single
 * @desc Upload a single media file (image or video)
 * @access Private
 */
router.post('/single', 
  authMiddleware,
  uploadSingleFile,
  handleUploadError,
  uploadSingleMedia
);

/**
 * @route POST /api/upload/screen-media
 * @desc Upload multiple media files for screen registration (day_photo, night_photo, video)
 * @access Private
 */
router.post('/screen-media',
  authMiddleware,
  uploadMultipleFiles.fields([
    { name: 'day_photo', maxCount: 1 },
    { name: 'night_photo', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  handleUploadError,
  uploadScreenMedia
);

/**
 * @route DELETE /api/upload/delete
 * @desc Delete a media file from S3
 * @access Private
 */
router.delete('/delete',
  authMiddleware,
  deleteMedia
);

export default router;