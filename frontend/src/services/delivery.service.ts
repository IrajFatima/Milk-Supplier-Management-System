// src/services/delivery.service.ts

import api from "./api";

import type {
    AssignDeliveryRequest,
    Delivery,
    DeliveryFilters,
    DeliveryStaff,
    PaginatedDeliveries,
    UpdateDeliveryStatusRequest,
} from "../types/delivery.types";

export const deliveryService = {
    async getDeliveries(
        filters: DeliveryFilters
    ): Promise<PaginatedDeliveries> {
        const response = await api.get("/deliveries", {
            params: filters,
        });

        return response.data.data;
    },

    async getMyDeliveries(
        filters: DeliveryFilters
    ): Promise<PaginatedDeliveries> {
        const response = await api.get("/deliveries/my", {
            params: filters,
        });

        return response.data.data;
    },

    async getDeliveryById(
        deliveryId: number
    ): Promise<Delivery> {
        const response = await api.get(
            `/deliveries/${deliveryId}`
        );

        return response.data.data.delivery;
    },

    async getMyDeliveryById(
        deliveryId: number
    ): Promise<Delivery> {
        const response = await api.get(
            `/deliveries/my/${deliveryId}`
        );

        return response.data.data.delivery;
    },

    async assignDelivery(
        deliveryId: number,
        data: AssignDeliveryRequest
    ): Promise<void> {
        await api.patch(
            `/deliveries/${deliveryId}/assign`,
            data
        );
    },

    async updateDeliveryStatus(
        deliveryId: number,
        data: UpdateDeliveryStatusRequest
    ): Promise<void> {
        await api.patch(
            `/deliveries/${deliveryId}/status`,
            data
        );
    },

    async getDeliveryStaff(): Promise<DeliveryStaff[]> {
        const response = await api.get(
            "/deliveries/staff"
        );

        return response.data.data.deliveryStaff;
    },
};