import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import { temperatureLogsService } from "./temperature-logs.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import {
    CreateTemperatureLogRequest,
    TemperatureLogFilters
} from "../../shared/types/temperature.types.js";

class TemperatureLogsController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const payload = req.body as CreateTemperatureLogRequest;

            const log = await temperatureLogsService.create(payload,req.user?.userId ?? null);

            res.status(201).json({
                success: true,
                message: "Temperature log recorded successfully.",
                data: { log }
            });

        } catch (error) {
            next(error);
        }
    }

    async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const id = Number(req.params.id);

            const log = await temperatureLogsService.getById(id);

            res.status(200).json({
                success: true,
                data: { log }
            });

        } catch (error) {
            next(error);
        }
    }

    async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const filters: TemperatureLogFilters = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 20,

                search: typeof req.query.search === "string" ? req.query.search : undefined,
                storageFacilityId: typeof req.query.storageFacilityId === "string" ? Number(req.query.storageFacilityId) : undefined,
                alertTriggered: typeof req.query.alertTriggered === "string" ? (req.query.alertTriggered === "true") : undefined,
                recordingType: typeof req.query.recordingType === "string" ? req.query.recordingType : undefined
            };

            const result = await temperatureLogsService.list(filters);

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {
            next(error);
        }
    }
}

export const temperatureLogsController = new TemperatureLogsController();
