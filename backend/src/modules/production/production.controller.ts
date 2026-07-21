import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import { productionService } from "./production.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import {
    CreateProductionRequest,
    UpdateProductionRequest,
    ProductionFilters
} from "../../shared/types/production.types.js";

class ProductionController {

    async create(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const payload = {
                ...req.body,
                recordedBy: req.user?.employeeId
            } as CreateProductionRequest;

            const production = await productionService.create(payload);

            res.status(201).json({
                success: true,
                message: "Production record created successfully.",
                data: { production }
            });

        } catch (error) {
            next(error);
        }
    }

    async getById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const productionId = Number(req.params.id);

            const production = await productionService.getById(productionId);

            res.status(200).json({
                success: true,
                data: { production }
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

            const filters: ProductionFilters = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 20,

                search:
                    typeof req.query.search === "string"
                        ? req.query.search
                        : undefined,

                animalId:
                    typeof req.query.animalId === "string"
                        ? Number(req.query.animalId)
                        : undefined,

                productionDate:
                    typeof req.query.productionDate === "string"
                        ? req.query.productionDate
                        : undefined,

                productionShift:
                    typeof req.query.productionShift === "string"
                        ? req.query.productionShift
                        : undefined,

                qualityStatus:
                    typeof req.query.qualityStatus === "string"
                        ? req.query.qualityStatus
                        : undefined,

                status:
                    typeof req.query.status === "string"
                        ? req.query.status
                        : undefined
            };

            const production = await productionService.list(filters);

            res.status(200).json({
                success: true,
                data: production
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

            const productionId = Number(req.params.id);

            const production = await productionService.update(
                productionId,
                req.body as UpdateProductionRequest
            );

            res.status(200).json({
                success: true,
                message: "Production record updated successfully.",
                data: { production }
            });

        } catch (error) {
            next(error);
        }
    }

    async void(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const productionId = Number(req.params.id);

            await productionService.void(productionId);

            res.status(200).json({
                success: true,
                message: "Production record voided successfully."
            });

        } catch (error) {
            next(error);
        }
    }

    async getAnimals(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const animals = await productionService.getAnimals();

            res.status(200).json({
                success: true,
                data: { animals }
            });

        } catch (error) {
            next(error);
        }
    }

    async getStorageFacilities(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const storageFacilities = await productionService.getStorageFacilities();

            res.status(200).json({
                success: true,
                data: { storageFacilities }
            });

        } catch (error) {
            next(error);
        }
    }
}

export const productionController = new ProductionController();