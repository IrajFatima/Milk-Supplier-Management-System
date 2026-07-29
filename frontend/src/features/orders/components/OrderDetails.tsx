// src/features/orders/components/OrderDetails.tsx

import OrderStatusBadge from "./OrderStatusBadge";
import type { OrderItem } from "../../../types/order.types";
import {
    BILLING_MODELS,
    ORDER_TYPES,
} from "../../../constants/order";

interface OrderDetailsProps {
    order: OrderItem;
}

export default function OrderDetails({
    order,
}: OrderDetailsProps) {
    return (
        <div
            className="
            grid
            gap-6
            rounded-xl
            border
            border-[var(--color-border)]
            bg-[var(--color-surface)]
            p-6
            md:grid-cols-2
        "
        >
            <DetailItem
                label="Order ID"
                value={String(order.orderId)}
            />

            <DetailItem
                label="Customer"
                value={order.customerName}
            />

            <DetailItem
                label="Order Type"
                value={order.orderType}
            />

            <DetailItem
                label="Billing Model"
                value={order.billingModel}
            />

            <DetailItem
                label="Milk Type"
                value={order.milkTypeName}
            />

            <DetailItem
                label="Quantity"
                value={`${order.quantity} L`}
            />

            {order.orderType === ORDER_TYPES.SUBSCRIPTION && (
                <>
                    <DetailItem
                        label="Delivery Frequency"
                        value={order.deliveryFrequency ?? "-"}
                    />

                    <DetailItem
                        label={
                            order.deliveryFrequency === "Daily"
                                ? "Delivery Start Date"
                                : "First Delivery Date"
                        }
                        value={
                            order.deliveryDate
                                ? new Date(
                                    order.deliveryDate
                                ).toLocaleDateString()
                                : "-"
                        }
                    />
                </>
            )}

            {order.billingModel === BILLING_MODELS.FLAT_RATE && (
                <>
                    <DetailItem
                        label="Billing Cycle"
                        value={order.billingCycle ?? "-"}
                    />

                    <DetailItem
                        label="Monthly Flat Rate"
                        value={
                            order.monthlyFlatRate !== null
                                ? `${order.monthlyFlatRate}`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Pro-Ration Applied"
                        value={
                            order.proRationApplied
                                ? "Yes"
                                : "No"
                        }
                    />
                </>
            )}

            {order.orderType !== ORDER_TYPES.SUBSCRIPTION && (
                <DetailItem
                    label="Delivery Date"
                    value={
                        order.deliveryDate
                            ? new Date(
                                order.deliveryDate
                            ).toLocaleDateString()
                            : "-"
                    }
                />
            )}

            <DetailItem
                label="Delivery Slot"
                value={
                    order.deliveryTimePreference ??
                    "-"
                }
            />

            <div>
                <p className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    Order Status
                </p>

                <OrderStatusBadge
                    status={order.orderStatus}
                />
            </div>

            <DetailItem
                label="Created Date"
                value={new Date(
                    order.createdDate
                ).toLocaleDateString()}
            />
        </div>
    );
}

interface DetailItemProps {
    label: string;
    value: string;
}

function DetailItem({
    label,
    value,
}: DetailItemProps) {
    return (
        <div>
            <p className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]">
                {label}
            </p>

            <p className="text-[var(--color-text)]">
                {value}
            </p>
        </div>
    );
}