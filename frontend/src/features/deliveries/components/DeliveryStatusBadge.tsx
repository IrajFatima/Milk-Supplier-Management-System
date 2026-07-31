// src/features/deliveries/components/DeliveryStatusBadge.tsx

import { DELIVERY_STATUS, type DeliveryStatus } from "../../../constants/delivery";

interface DeliveryStatusBadgeProps {
    status: DeliveryStatus;
}

const statusStyles: Record<
    DeliveryStatus,
    {
        label: string;
        background: string;
        color: string;
    }
> = {
    [DELIVERY_STATUS.SCHEDULED]: {
        label: DELIVERY_STATUS.SCHEDULED,
        background: "var(--color-warning)",
        color: "#ffffff",
    },
    [DELIVERY_STATUS.SUCCESSFULLY_DELIVERED]: {
        label: DELIVERY_STATUS.SUCCESSFULLY_DELIVERED,
        background: "var(--color-success)",
        color: "#ffffff",
    },
    [DELIVERY_STATUS.PARTIALLY_DELIVERED]: {
        label: DELIVERY_STATUS.PARTIALLY_DELIVERED,
        background: "var(--color-primary)",
        color: "#ffffff",
    },
    [DELIVERY_STATUS.FAILED]: {
        label: DELIVERY_STATUS.FAILED,
        background: "var(--color-danger)",
        color: "#ffffff",
    },
};

export default function DeliveryStatusBadge({
    status,
}: DeliveryStatusBadgeProps) {
    const style = statusStyles[status];

    return (
        <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
                backgroundColor: style.background,
                color: style.color,
            }}
        >
            {style.label}
        </span>
    );
}