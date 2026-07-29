import {
    ONE_TIME_ORDER_STATUS,
    SUBSCRIPTION_STATUS,
    type OneTimeOrderStatus,
    type SubscriptionStatus,
} from "../../../constants/order";

type OrderStatus = OneTimeOrderStatus | SubscriptionStatus;

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
    [SUBSCRIPTION_STATUS.PENDING]:
        "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20",

    [SUBSCRIPTION_STATUS.ACTIVE]:
        "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20",

    [SUBSCRIPTION_STATUS.ON_HOLD]:
        "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20",

    [SUBSCRIPTION_STATUS.CANCELLED]:
        "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/20",

    [ONE_TIME_ORDER_STATUS.SCHEDULED]:
        "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20",

    [ONE_TIME_ORDER_STATUS.LOCKED]:
        "bg-[var(--color-text-muted)]/10 text-[var(--color-text-secondary)] border border-[var(--color-border)]",

    [ONE_TIME_ORDER_STATUS.COMPLETED]:
        "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20",
};

export default function OrderStatusBadge({
    status,
}: OrderStatusBadgeProps) {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES[SUBSCRIPTION_STATUS.PENDING];

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
        >
            {status}
        </span>
    );
}