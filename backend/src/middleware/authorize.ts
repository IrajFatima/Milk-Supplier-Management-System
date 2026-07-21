import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../shared/types/auth.types.js";
import { Role } from "../shared/constants/roles.js";
import { AppError } from "../shared/errors/AppError.js";

export const requireRole =
  (allowedRoles: readonly Role[]) =>
  (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          "Access Denied: You do not have permission to access this resource."
        )
      );
    }

    next();
  };