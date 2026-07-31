// src/constants/delivery.ts

export const DELIVERY_STATUS = {
    SCHEDULED: "Scheduled",
    SUCCESSFULLY_DELIVERED: "Successfully Delivered",
    PARTIALLY_DELIVERED: "Partially Delivered",
    FAILED: "Failed",
} as const;

export type DeliveryStatus =
    (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];

export const DELIVERY_STATUS_OPTIONS: DeliveryStatus[] = Object.values(
    DELIVERY_STATUS
);