"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = void 0;
/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    // Log request
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
        const resetColor = '\x1b[0m';
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${statusColor}${res.statusCode}${resetColor} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
/**
 * Error logging middleware
 */
const errorLogger = (error, req, res, next) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    next(error);
};
exports.errorLogger = errorLogger;
