// src/types/delivery.types.ts

import type { DeliveryStatus } from "../constants/delivery.js";
import type { OrderType } from "../constants/order.js";

export interface Delivery {
    deliveryId: number;
    orderId: number;
    customerId: number;
    customerName: string;
    contactNumber: string | null;
    deliveryAddressLine1: string | null;
    deliveryAddressLine2: string | null;
    cityTown: string | null;
    stateProvince: string | null;
    postalCode: string | null;
    landmark: string | null;

    orderType: OrderType;
    milkTypeId: number;
    milkType: string;
    scheduledQuantity: number;

    deliveryStaffId: number | null;
    deliveryStaffName: string | null;

    deliveryDate: Date;
    deliveryTimePreference: string | null;

    deliveredQuantity: number | null;
    deliveryStatus: DeliveryStatus;
    paymentCollected: number;
    deliveryRemarks: string | null;

    createdDate: Date;
}

export interface AssignDeliveryRequest {
    deliveryStaffId: number;
}

export interface DeliveryFilters {
    page: number;
    limit: number;
    search?: string;
    deliveryDate?: string;
    status?: DeliveryStatus;
    customerId?: number;
    milkTypeId?: number;
    deliveryStaffId?: number;
    orderType?: OrderType;
}

export interface DeliveryListItem {
    deliveryId: number;
    customerName: string;
    orderType: OrderType;
    milkType: string;
    scheduledQuantity: number;
    deliveryDate: Date;
    deliveryStaffId: number | null;
    deliveryStaffName: string | null;
    deliveryStatus: DeliveryStatus;
    createdDate: Date;
}

export interface UpdateDeliveryStatusRequest {
    deliveryStatus: DeliveryStatus;
    deliveredQuantity?: number;
    remarks?: string;
}

export interface PaginatedDeliveries {
    data: DeliveryListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface DeliveryStaff {
    employeeId: number;
    fullName: string;
}