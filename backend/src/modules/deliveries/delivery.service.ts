import { deliveryRepository } from "./delivery.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { CreateDeliveryRequest } from "../../shared/types/delivery.types.js";
import {
    Delivery,
    DeliveryFilters,
    PaginatedDeliveries,
    DeliveryStaff,
    AssignDeliveryRequest,
    SubscriptionDeliveryCandidate,
    UpdateDeliveryStatusRequest,
} from "../../shared/types/delivery.types.js";
import { orderRepository } from "../orders/order.repository.js";
import {
    ONE_TIME_ORDER_STATUS,
    SUBSCRIPTION_STATUS,
    ORDER_TYPES,
} from "../../shared/constants/order.js";

import { DELIVERY_STATUS } from "../../shared/constants/delivery.js";

export class DeliveryService {

    async getById(deliveryId: number): Promise<Delivery> {

        const delivery = await deliveryRepository.findById(deliveryId);

        if (!delivery) {
            throw new AppError(404, "Delivery not found.");
        }

        return delivery;
    }

    async getAssignedDeliveryById(
        deliveryId: number,
        employeeId: number
    ): Promise<Delivery> {
        const delivery = await deliveryRepository.findById(deliveryId);

        if (!delivery)
            throw new AppError(404, "Delivery not found.");

        if (Number(delivery.deliveryStaffId) !== Number(employeeId))
            throw new AppError(403, "You are not authorized to access this delivery.");

        return delivery;
    }

    async getAssignedDeliveries(
        employeeId: number,
        filters: DeliveryFilters
    ): Promise<PaginatedDeliveries> {

        return await deliveryRepository.getAssignedDeliveries(
            employeeId,
            filters
        );
    }

    async create(
        payload: CreateDeliveryRequest
    ): Promise<number> {

        return await deliveryRepository.create(payload);
    }

    async createMany(
        payload: CreateDeliveryRequest[]
    ): Promise<number> {

        if (payload.length === 0) {
            return 0;
        }

        return await deliveryRepository.createMany(payload);
    }

    async generateDeliveriesForDate(
        deliveryDate: string
    ): Promise<number> {

        const subscriptions =
            await deliveryRepository.getSubscriptionsForDelivery(
                deliveryDate
            );

        if (subscriptions.length === 0) {
            return 0;
        }

        const deliveries: CreateDeliveryRequest[] =
            subscriptions.map(
                (
                    subscription: SubscriptionDeliveryCandidate
                ) => ({
                    orderId: subscription.orderId,
                    customerId: subscription.customerId,
                    deliveryDate: new Date(deliveryDate),
                    scheduledQuantity:
                        subscription.quantity,
                })
            );

        return await this.createMany(deliveries);
    }

    async list(
        filters: DeliveryFilters
    ): Promise<PaginatedDeliveries> {

        return await deliveryRepository.list(filters);
    }

    async getDeliveryStaff(): Promise<DeliveryStaff[]> {

        return await deliveryRepository.getDeliveryStaff();
    }

    async assign(
        deliveryId: number,
        payload: AssignDeliveryRequest
    ): Promise<Delivery> {

        const delivery = await deliveryRepository.findById(deliveryId);

        if (!delivery) {
            throw new AppError(404, "Delivery not found.");
        }

        const employee =
            await deliveryRepository.findAssignableStaffById(
                payload.deliveryStaffId
            );

        if (!employee) {
            throw new AppError(
                404,
                "Delivery staff not found."
            );
        }

        if (
            delivery.deliveryStatus !==
            DELIVERY_STATUS.SCHEDULED
        ) {
            throw new AppError(
                400,
                "Only scheduled deliveries can be assigned or reassigned."
            );
        }

        if (new Date(delivery.deliveryDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
            throw new AppError(
                400,
                "Past deliveries cannot be assigned."
            );
        }

        if (
            Number(delivery.deliveryStaffId) ===
            Number(payload.deliveryStaffId)
        ) {
            throw new AppError(
                400,
                "Delivery is already assigned to this delivery staff."
            );
        }

        return await deliveryRepository.assign(
            deliveryId,
            payload
        );
    }

    async updateStatus(
        deliveryId: number,
        employeeId: number,
        payload: UpdateDeliveryStatusRequest
    ): Promise<Delivery> {
        const delivery = await deliveryRepository.findById(deliveryId);

        if (!delivery) throw new AppError(404, "Delivery not found.");
        if (Number(delivery.deliveryStaffId) !== Number(employeeId))
            throw new AppError(403, "You are not authorized to update this delivery.");
        if (delivery.deliveryStatus !== DELIVERY_STATUS.SCHEDULED)
            throw new AppError(400, "Only scheduled deliveries can be updated.");

        switch (payload.deliveryStatus) {
            case DELIVERY_STATUS.SUCCESSFULLY_DELIVERED:
                payload.deliveredQuantity = delivery.scheduledQuantity;
                break;

            case DELIVERY_STATUS.PARTIALLY_DELIVERED:
                if (payload.deliveredQuantity == null)
                    throw new AppError(400, "Delivered quantity is required for partially delivered orders.");
                if (
                    payload.deliveredQuantity < 0 ||
                    payload.deliveredQuantity > delivery.scheduledQuantity
                ) {
                    throw new AppError(400, "Delivered quantity must be between 0 and the scheduled quantity.");
                }
                break;

            case DELIVERY_STATUS.FAILED:
                payload.deliveredQuantity = 0;
                break;

            default:
                throw new AppError(400, "Invalid delivery status.");
        }

        const updatedDelivery = await deliveryRepository.updateStatus(
            deliveryId,
            payload
        );

        const order = await orderRepository.getById(updatedDelivery.orderId);

        if (!order)
            throw new AppError(404, "Associated order not found.");

        if (order.orderType === ORDER_TYPES.ONE_TIME) {
            let orderStatus: string;

            switch (payload.deliveryStatus) {
                case DELIVERY_STATUS.SUCCESSFULLY_DELIVERED:
                case DELIVERY_STATUS.PARTIALLY_DELIVERED:
                    orderStatus = ONE_TIME_ORDER_STATUS.COMPLETED;
                    break;

                case DELIVERY_STATUS.FAILED:
                    orderStatus = ONE_TIME_ORDER_STATUS.CANCELLED;
                    break;

                default:
                    throw new AppError(400, "Invalid delivery status.");
            }

            await orderRepository.updateOrderStatus(
                updatedDelivery.orderId,
                orderStatus
            );
        }
        return updatedDelivery;
    }
}

export const deliveryService = new DeliveryService();