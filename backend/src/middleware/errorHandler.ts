import { Request, Response, NextFunction } from "express";

// Helper to create an Error with an HTTP status code
export function createError(message: string, status: number = 500): Error & { status: number } {
  const err: any = new Error(message);
  err.status = status;
  return err;
}

// Express error-handling middleware
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err?.status || 500;
  // Log full error for server-side debugging
  console.error(err);
  res.status(status).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
}

export default errorHandler;


