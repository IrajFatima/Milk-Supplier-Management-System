import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../shared/types/auth.types.js";
import { verifyToken } from "../shared/utils/jwt.js";
import { AppError } from "../shared/errors/AppError.js";

export const requireAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "Your session has expired. Please log in again.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch {
    next(new AppError(401, "Your session has expired. Please log in again."));
  }
};