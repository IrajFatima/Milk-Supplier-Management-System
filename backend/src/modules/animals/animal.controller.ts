import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import { animalService } from "./animal.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import { AnimalFilters } from "../../shared/types/animal.types.js";
import type { CreateAnimalRequest } from "../../shared/types/animal.types.js";
import type { UpdateAnimalRequest } from "../../shared/types/animal.types.js";
import type { RelocateAnimalRequest } from "../../shared/types/animal.types.js";
import type { DeactivateAnimalRequest } from "../../shared/types/animal.types.js";
import type { AnimalSpecies } from "../../shared/constants/animalSpecies.js";
import type { AnimalGender } from "../../shared/constants/animalGender.js";
import type { AnimalStatus } from "../../shared/constants/animalStatus.js";

class AnimalController {
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

            const animal = await animalService.create(
                req.body as CreateAnimalRequest
            );
            res.status(201).json({
                success: true,
                message: "Animal registered successfully.",
                data: { animal },
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

            const animalId = Number(req.params.id);

            const animal = await animalService.getById(animalId);

            res.status(200).json({
                success: true,
                data: { animal },
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

            const filters: AnimalFilters = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 20,

                search:
                    typeof req.query.search === "string"
                        ? req.query.search
                        : undefined,

                species:
                    typeof req.query.species === "string"
                        ? (req.query.species as AnimalSpecies)
                        : undefined,

                gender:
                    typeof req.query.gender === "string"
                        ? (req.query.gender as AnimalGender)
                        : undefined,

                status:
                    typeof req.query.status === "string"
                        ? (req.query.status as AnimalStatus)
                        : undefined,

                shedId:
                    typeof req.query.shedId === "string"
                        ? Number(req.query.shedId)
                        : undefined,
            };

            const animals = await animalService.list(filters);

            res.status(200).json({
                success: true,
                data: animals,
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

            const animalId = Number(req.params.id);

            const animal = await animalService.update(
                animalId,
                req.body as UpdateAnimalRequest
            );

            res.status(200).json({
                success: true,
                message: "Animal updated successfully.",
                data: { animal },
            });
        } catch (error) {
            next(error);
        }
    }

    async relocate(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const animalId = Number(req.params.id);

            const animal = await animalService.relocate(
                animalId,
                req.body as RelocateAnimalRequest
            );
            res.status(200).json({
                success: true,
                message: "Animal relocated successfully.",
                data: { animal },
            });
        } catch (error) {
            next(error);
        }
    }

    async deactivate(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const animalId = Number(req.params.id);

            await animalService.deactivate(
                animalId,
                req.body as DeactivateAnimalRequest
            );
            res.status(200).json({
                success: true,
                message: "Animal status updated successfully.",
            });
        } catch (error) {
            next(error);
        }
    }
    async getSheds(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const sheds = await animalService.getSheds();

            res.status(200).json({
                success: true,
                data: {
                    sheds,
                },
            });

        } catch (error) {
            next(error);
        }
    }
    async getParents(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const parents = await animalService.getParents();

            res.status(200).json({
                success: true,
                data: {
                    parents,
                },
            });

        } catch (error) {
            next(error);
        }
    }
}

export const animalController = new AnimalController();