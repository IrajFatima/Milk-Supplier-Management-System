import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../../shared/errors/AppError.js";
import { systemConfigurationService } from "./systemConfiguration.service.js";
import { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import type {
    SystemConfigurationFilters,
    UpdateSystemConfigurationRequest,
} from "../../shared/types/systemConfiguration.types.js";

class SystemConfigurationController {
    
    async getByConfigKey(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const configKey = req.params.configKey;

            if (typeof configKey !== "string") {
                throw new AppError(422, "Invalid config key.");
            }

            const systemConfiguration =
                await systemConfigurationService.getByConfigKey(
                    configKey,
                );

            res.status(200).json({
                success: true,
                data: { systemConfiguration },
            });
        } catch (error) {
            next(error);
        }
    }

    async list(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const filters: SystemConfigurationFilters = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 20,
                search:
                    typeof req.query.search === "string"
                        ? req.query.search
                        : undefined,
            };

            const systemConfigurations =
                await systemConfigurationService.list(
                    filters,
                );

            res.status(200).json({
                success: true,
                data: systemConfigurations,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(401, "Unauthorized.");
            }

            const configKey = req.params.configKey;

            if (typeof configKey !== "string") {
                throw new AppError(422, "Invalid config key.");
            }

            const systemConfiguration =
                await systemConfigurationService.update(
                    configKey,
                    req.body as UpdateSystemConfigurationRequest,
                    userId,
                );

            res.status(200).json({
                success: true,
                message: "System configuration updated successfully.",
                data: { systemConfiguration },
            });
        } catch (error) {
            next(error);
        }
    }

}

export const systemConfigurationController = new SystemConfigurationController();
