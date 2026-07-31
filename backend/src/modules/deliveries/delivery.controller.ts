// src/modules/deliveries/delivery.controller.ts

import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import { deliveryService } from "./delivery.service.js";

import { AppError } from "../../shared/errors/AppError.js";

import { AuthenticatedRequest } from "../../shared/types/auth.types.js";

import type {
    AssignDeliveryRequest,
    DeliveryFilters,
} from "../../shared/types/delivery.types.js";
import type { UpdateDeliveryStatusRequest } from "../../shared/types/delivery.types.js";

import type { DeliveryStatus } from "../../shared/constants/delivery.js";
import type { OrderType } from "../../shared/constants/order.js";

class DeliveryController {

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

            const deliveryId = Number(req.params.id);

            const delivery = await deliveryService.getById(deliveryId);

            res.status(200).json({
                success: true,
                data: {
                    delivery,
                },
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

            const filters: DeliveryFilters = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 20,

                search:
                    typeof req.query.search === "string"
                        ? req.query.search
                        : undefined,

                deliveryDate:
                    typeof req.query.deliveryDate === "string"
                        ? req.query.deliveryDate
                        : undefined,

                status:
                    typeof req.query.status === "string"
                        ? (req.query.status as DeliveryStatus)
                        : undefined,

                customerId:
                    typeof req.query.customerId === "string"
                        ? Number(req.query.customerId)
                        : undefined,

                milkTypeId:
                    typeof req.query.milkTypeId === "string"
                        ? Number(req.query.milkTypeId)
                        : undefined,

                deliveryStaffId:
                    typeof req.query.deliveryStaffId === "string"
                        ? Number(req.query.deliveryStaffId)
                        : undefined,

                orderType:
                    typeof req.query.orderType === "string"
                        ? (req.query.orderType as OrderType)
                        : undefined,
            };

            const deliveries = await deliveryService.list(filters);

            res.status(200).json({
                success: true,
                data: deliveries,
            });

        } catch (error) {
            next(error);
        }
    }

    async assign(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const deliveryId = Number(req.params.id);

            const delivery = await deliveryService.assign(
                deliveryId,
                req.body as AssignDeliveryRequest
            );

            res.status(200).json({
                success: true,
                message: "Delivery assigned successfully.",
                data: {
                    delivery,
                },
            });

        } catch (error) {
            next(error);
        }
    }

    async getDeliveryStaff(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const deliveryStaff =
                await deliveryService.getDeliveryStaff();

            res.status(200).json({
                success: true,
                data: {
                    deliveryStaff,
                },
            });

        } catch (error) {
            next(error);
        }
    }

    async getMyDeliveryById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                throw new AppError(422, errors.array()[0].msg);

            const delivery = await deliveryService.getAssignedDeliveryById(
                Number(req.params.id),
                req.user!.employeeId!
            );

            res.status(200).json({
                success: true,
                data: { delivery },
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyDeliveries(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                throw new AppError(422, errors.array()[0].msg);

            const filters: DeliveryFilters = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 20,
                search: typeof req.query.search === "string" ? req.query.search : undefined,
                deliveryDate: typeof req.query.deliveryDate === "string" ? req.query.deliveryDate : undefined,
                status: typeof req.query.status === "string" ? req.query.status as DeliveryStatus : undefined,
                customerId: typeof req.query.customerId === "string" ? Number(req.query.customerId) : undefined,
                milkTypeId: typeof req.query.milkTypeId === "string" ? Number(req.query.milkTypeId) : undefined,
                orderType: typeof req.query.orderType === "string" ? req.query.orderType as OrderType : undefined,
            };

            const deliveries = await deliveryService.getAssignedDeliveries(
                req.user!.employeeId!,
                filters
            );

            res.status(200).json({
                success: true,
                data: deliveries,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                throw new AppError(422, errors.array()[0].msg);

            const delivery = await deliveryService.updateStatus(
                Number(req.params.id),
                req.user!.employeeId!,
                req.body as UpdateDeliveryStatusRequest
            );

            res.status(200).json({
                success: true,
                message: "Delivery status updated successfully.",
                data: { delivery },
            });
        } catch (error) {
            next(error);
        }
    }
}

export const deliveryController = new DeliveryController();