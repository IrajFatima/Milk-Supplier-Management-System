import { AppError } from "../../../shared/errors/AppError.js";

export const validateOrderCutoffTime = (cutoffTime: string): void => {
    if (!cutoffTime) {
        throw new AppError(
            500,
            "Order cutoff time is not configured."
        );
    }

    const [cutoffHour, cutoffMinute] = cutoffTime
        .split(":")
        .map(Number);

    if (
        Number.isNaN(cutoffHour) ||
        Number.isNaN(cutoffMinute)
    ) {
        throw new AppError(
            500,
            "Invalid order cutoff time configuration."
        );
    }

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    const cutoffMinutes =
        cutoffHour * 60 + cutoffMinute;

    if (currentMinutes >= cutoffMinutes) {
        throw new AppError(
            409,
            "Order cannot be modified after the daily cutoff time."
        );
    }
};

/**
 * Validate a one-time order delivery date.
 *
 * BR-OM-204:
 * - Must not be today after cut-off.
 * - Must not be in the past.
 */
export const validateDeliveryDate = (
    deliveryDateStr: string,
    cutoffTime?: string | null
): void => {
    const deliveryDate = new Date(deliveryDateStr);
    const now = new Date();

    // Strip time components for date-only comparison
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const deliveryDateStart = new Date(deliveryDate.getFullYear(), deliveryDate.getMonth(), deliveryDate.getDate());

    // Must not be in the past (before today)
    if (deliveryDateStart < todayStart) {
        throw new AppError(
            400,
            "Delivery date must not be in the past."
        );
    }

    // If delivery is today, check cut-off has not passed
    if (deliveryDateStart.getTime() === todayStart.getTime() && cutoffTime) {
        const [cutoffHour, cutoffMinute] = cutoffTime.split(":").map(Number);

        if (!Number.isNaN(cutoffHour) && !Number.isNaN(cutoffMinute)) {
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const cutoffMinutes = cutoffHour * 60 + cutoffMinute;

            if (currentMinutes >= cutoffMinutes) {
                throw new AppError(
                    409,
                    "Cannot create an order for today after the daily cutoff time."
                );
            }
        }
    }
};
