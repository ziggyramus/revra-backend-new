import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({
    status: false,
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("GLOBAL SERVER ERROR:", err);

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      status: false,
      error: "Validation failed",
      details: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      status: false,
      error: "Invalid ID format",
    });
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {
    return res.status(409).json({
      status: false,
      error: "Duplicate record already exists",
    });
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  const isProduction = process.env.NODE_ENV === "production";

  return res.status(500).json({
    status: false,
    error: isProduction ? "Internal server error" : message,
  });
};