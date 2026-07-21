import { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError.js";
import jwt from "jsonwebtoken";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  }

  if (err instanceof jwt.TokenExpiredError) {
    res.status(401).json({
      success: false,
      message: "Your session has expired. Please log in again.",
    });

    return;
  }

  if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });

    return;
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};