// src/features/orders/pages/CreateOrderPage.tsx

import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import OrderForm from "../../../../src/features/orders/components/OrderForm";

import { orderService } from "../../../../src/services/order.service";

import {
    ORDER_TYPES,
    type OrderType,
} from "../../../../src/constants/order";

import type {
    CreateOneTimeOrderRequest,
    CreateSubscriptionRequest,
} from "../../../../src/types/order.types";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage.test";

export default function CreateOrderPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialOrderType: OrderType =
        location.state?.orderType ??
        ORDER_TYPES.SUBSCRIPTION;

    async function handleCreateSubscription(
        data: CreateSubscriptionRequest
    ) {
        try {
            await orderService.createSubscription(data);

            toast.success(
                "Subscription created successfully."
            );

            navigate("/orders");
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to create subscription."
                )
            );

            throw error;
        }
    }

    async function handleCreateOrder(
        data: CreateOneTimeOrderRequest
    ) {
        try {
            await orderService.createOrder(data);

            toast.success(
                "Order created successfully."
            );

            navigate("/orders");
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to create order."
                )
            );

            throw error;
        }
    }

    return (
        <div className="space-y-6">
            <h1
                className="text-2xl font-bold"
                style={{
                    color: "var(--color-text)",
                }}
            >
                Create Order
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
                    mode="create"
                    initialOrderType={initialOrderType}
                    onCreateSubscription={
                        handleCreateSubscription
                    }
                    onCreateOrder={handleCreateOrder}
                />
            </div>
        </div>
    );
}