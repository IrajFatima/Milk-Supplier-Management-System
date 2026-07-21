import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { authService } from "./auth.service.js";
import { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import { AppError } from "../../shared/errors/AppError.js";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError(422, errors.array()[0].msg);
      }

      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.logout();

      res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, "Unauthorized.");
      }

      const user = await authService.getCurrentUser(req.user.userId);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
  async changePassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError(422, errors.array()[0].msg);
      }

      if (!req.user) {
        throw new AppError(401, "Unauthorized.");
      }

      await authService.changePassword(req.user.userId, req.body);

      res.status(200).json({
        success: true,
        message: "Password changed successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();