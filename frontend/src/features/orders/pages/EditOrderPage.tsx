// src/features/orders/pages/EditOrderPage.tsx

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import OrderForm from "../components/OrderForm";

import Spinner from "../../../components/Spinner";

import { orderService } from "../../../services/order.service";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import type {
    OrderEntity,
    UpdateOneTimeOrderRequest,
    UpdateSubscriptionRequest,
} from "../../../types/order.types";
import { ORDER_TYPES } from "../../../constants/order";

export default function EditOrderPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams();

    const [order, setOrder] =
        useState<OrderEntity | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrder() {
            if (!id) return;

            try {
                if (state.orderType === ORDER_TYPES.SUBSCRIPTION) {
                    const order = await orderService.getSubscription(Number(id));
                    setOrder(order)
                } else {
                    const order = await orderService.getOrder(Number(id));
                    setOrder(order)
                }

            } catch (error: unknown) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load order."
                    )
                );
            } finally {
                setLoading(false);
            }
        }

        loadOrder();
    }, [id, state.orderType]);

    async function handleUpdateOrder(
        data: UpdateOneTimeOrderRequest
    ) {
        if (!id) return;

        try {
            await orderService.updateOrder(
                Number(id),
                data
            );

            toast.success(
                "Order updated successfully."
            );

            navigate(`/orders/${id}`);
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to update order."
                )
            );

            throw new Error(
                "Order update failed.",
                {
                    cause: error,
                }
            );
        }
    }

    async function handleUpdateSubscription(
        data: UpdateSubscriptionRequest
    ) {
        if (!id) return;

        try {
            await orderService.updateSubscription(
                Number(id),
                data
            );

            toast.success(
                "Subscription updated successfully."
            );

            navigate(`/orders/${id}`);
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to update subscription."
                )
            );

            throw new Error(
                "Subscription update failed.",
                {
                    cause: error,
                }
            );
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center text-[var(--color-text-secondary)]">
                Order not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1
                className="text-2xl font-bold"
                style={{
                    color: "var(--color-text)",
                }}
            >
                Edit Order
            </h1>

            <div
                className="
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    p-6
                "
            >
                <OrderForm
                    mode="edit"
                    order={order}
                    onUpdateOrder={
                        handleUpdateOrder
                    }
                    onUpdateSubscription={
                        handleUpdateSubscription
                    }
                />
            </div>
        </div>
    );
}