"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = createError;
exports.errorHandler = errorHandler;
// Helper to create an Error with an HTTP status code
function createError(message, status = 500) {
    const err = new Error(message);
    err.status = status;
    return err;
}
// Express error-handling middleware
function errorHandler(err, req, res, next) {
    const status = err?.status || 500;
    // Log full error for server-side debugging
    console.error(err);
    res.status(status).json({
        success: false,
        message: err?.message || "Internal Server Error",
    });
}
exports.default = errorHandler;
