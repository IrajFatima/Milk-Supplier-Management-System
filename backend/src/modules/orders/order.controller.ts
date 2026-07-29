import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../../shared/errors/AppError.js";
import { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import { orderService } from "./order.service.js";
import {
    CreateSubscriptionRequest,
    CreateOneTimeOrderRequest, UpdateSubscriptionRequest, UpdateOneTimeOrderRequest,
    OrderFilters
} from "../../shared/types/order.types.js";
import { OrderSortField, OrderStatus } from "../../shared/constants/order.js";

class OrderController { // =====================================================
    // Subscription // =====================================================

    async createSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const payload: CreateSubscriptionRequest = req.body;
            const order = await orderService.createSubscription(payload);

            res.status(201).json({
                success: true,
                message: "Subscription created successfully.",
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    }

    async listSubscriptions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters: OrderFilters = {
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                search: req.query.search ? String(req.query.search) : undefined,
                orderStatus: req.query.orderStatus ? (req.query.orderStatus) as OrderStatus : undefined,
                milkTypeId: req.query.milkTypeId ? Number(req.query.milkTypeId) : undefined,
                deliveryTimePreference: req.query.deliveryTimePreference ? (req.query.deliveryTimePreference as "Morning" | "Evening") : undefined,
                fromDate: req.query.fromDate ? String(req.query.fromDate) : undefined,
                toDate: req.query.toDate ? String(req.query.toDate) : undefined,
                sortBy: req.query.sortBy ? (req.query.sortBy) as OrderSortField : undefined,
                sortOrder: req.query.sortOrder ? (req.query.sortOrder as "ASC" | "DESC") : undefined
            };

            const orders = await orderService.listSubscriptions(filters);

            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            next(error);
        }
    }

    async getSubscriptionById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const order = await orderService.getSubscriptionById(id);

            res.status(200).json({
                success: true,
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const id = Number(req.params.id);
            const payload: UpdateSubscriptionRequest = req.body;
            const order = await orderService.updateSubscription(id, payload);

            res.status(200).json({
                success: true,
                message: "Subscription updated successfully.",
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            await orderService.cancelSubscription(id);

            res.status(200).json({
                success: true,
                message: "Subscription cancelled successfully."
            });
        } catch (error) {
            next(error);
        }
    }

    // =====================================================
    // One-Time Orders
    // =====================================================

    async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const payload: CreateOneTimeOrderRequest = req.body;
            const order = await orderService.createOrder(payload);

            res.status(201).json({
                success: true,
                message: "Order created successfully.",
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    }

    async bulkCreateOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const payload: CreateOneTimeOrderRequest[] = req.body;
            const orders = await orderService.bulkCreateOrders(payload);

            res.status(201).json({
                success: true,
                message: "Orders created successfully.",
                data: { orders }
            });
        } catch (error) {
            next(error);
        }
    }

    async listOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters: OrderFilters = {
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                search: req.query.search ? String(req.query.search) : undefined,
                orderStatus: req.query.orderStatus ? (req.query.orderStatus) as OrderStatus : undefined,
                milkTypeId: req.query.milkTypeId ? Number(req.query.milkTypeId) : undefined,
                deliveryTimePreference: req.query.deliveryTimePreference ? (req.query.deliveryTimePreference as "Morning" | "Evening") : undefined,
                fromDate: req.query.fromDate ? String(req.query.fromDate) : undefined,
                toDate: req.query.toDate ? String(req.query.toDate) : undefined,
                sortBy: req.query.sortBy ? (req.query.sortBy) as OrderSortField : undefined,
                sortOrder: req.query.sortOrder ? (req.query.sortOrder as "ASC" | "DESC") : undefined
            };

            const orders = await orderService.listOrders(filters);

            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            next(error);
        }
    }

    async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            const order = await orderService.getOrderById(id);

            res.status(200).json({
                success: true,
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const id = Number(req.params.id);
            const payload: UpdateOneTimeOrderRequest = req.body;
            const order = await orderService.updateOrder(id, payload);

            res.status(200).json({
                success: true,
                message: "Order updated successfully.",
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    }

    async cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(req.params.id);
            await orderService.cancelOrder(id);

            res.status(200).json({
                success: true,
                message: "Order cancelled successfully."
            });
        } catch (error) {
            next(error);
        }
    }
    async changeOrderStatus(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const orderId = Number(req.params.id);
            const { status } = req.body;

            const order = await orderService.changeOrderStatus(
                orderId,
                status as OrderStatus
            );

            res.status(200).json({
                success: true,
                message: "Order status updated successfully.",
                data: { order },
            });
        } catch (error) {
            next(error);
        }
    }
    async reactivateOrder(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const orderId = Number(req.params.id);

            const order = await orderService.reactivateOrder(orderId);

            res.status(200).json({
                success: true,
                message: "Order reactivated successfully.",
                data: { order },
            });
        } catch (error) {
            next(error);
        }
    }

    async getMilkTypes(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const milkTypes = await orderService.getMilkTypes();

            res.status(200).json({
                success: true,
                message: "Milk types fetched successfully.",
                data: {
                    milkTypes,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

export const orderController = new OrderController();
