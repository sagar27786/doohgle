"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const uploadController_1 = require("../controllers/uploadController");
const router = express_1.default.Router();
/**
 * @route POST /api/upload/single
 * @desc Upload a single media file (image or video)
 * @access Private
 */
router.post('/single', auth_1.authMiddleware, uploadMiddleware_1.uploadSingleFile, uploadMiddleware_1.handleUploadError, uploadController_1.uploadSingleMedia);
/**
 * @route POST /api/upload/screen-media
 * @desc Upload multiple media files for screen registration (day_photo, night_photo, video)
 * @access Private
 */
router.post('/screen-media', auth_1.authMiddleware, uploadMiddleware_1.uploadMultipleFiles.fields([
    { name: 'day_photo', maxCount: 1 },
    { name: 'night_photo', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), uploadMiddleware_1.handleUploadError, uploadController_1.uploadScreenMedia);
/**
 * @route DELETE /api/upload/delete
 * @desc Delete a media file from S3
 * @access Private
 */
router.delete('/delete', auth_1.authMiddleware, uploadController_1.deleteMedia);
exports.default = router;
