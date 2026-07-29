// src/features/orders/components/OrderForm.tsx

import { useState } from "react";

import SubscriptionForm from "./SubscriptionForm";
import OneTimeOrderForm from "./OneTimeOrderForm";

import {
    ORDER_TYPES,
    type OrderType,
} from "../../../constants/order";

import type {
    CreateOneTimeOrderRequest,
    CreateSubscriptionRequest,
    OrderEntity,
    UpdateOneTimeOrderRequest,
    UpdateSubscriptionRequest,
} from "../../../types/order.types";

type CreateProps = {
    mode: "create";
    order?: never;
    initialOrderType?: OrderType;
    onCreateSubscription: (
        data: CreateSubscriptionRequest
    ) => Promise<void>;
    onCreateOrder: (
        data: CreateOneTimeOrderRequest
    ) => Promise<void>;
};

type EditProps = {
    mode: "edit";
    order: OrderEntity;
    onUpdateSubscription: (
        data: UpdateSubscriptionRequest
    ) => Promise<void>;
    onUpdateOrder: (
        data: UpdateOneTimeOrderRequest
    ) => Promise<void>;
};

type Props = CreateProps | EditProps;

export default function OrderForm(props: Props) {
    const [orderType, setOrderType] =
        useState<OrderType>(
            props.mode === "edit"
                ? props.order.orderType
                : props.initialOrderType ??
                ORDER_TYPES.SUBSCRIPTION
        );

    return (
        <div className="space-y-6">

            {props.mode === "create" && (
                <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden w-fit">

                    <button
                        type="button"
                        onClick={() =>
                            setOrderType(
                                ORDER_TYPES.SUBSCRIPTION
                            )
                        }
                        className={`px-5 py-2 transition ${orderType ===
                                ORDER_TYPES.SUBSCRIPTION
                                ? "bg-[var(--color-primary)] text-white"
                                : "bg-transparent text-[var(--color-text)]"
                            }`}
                    >
                        Subscription
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setOrderType(
                                ORDER_TYPES.ONE_TIME
                            )
                        }
                        className={`px-5 py-2 transition ${orderType ===
                                ORDER_TYPES.ONE_TIME
                                ? "bg-[var(--color-primary)] text-white"
                                : "bg-transparent text-[var(--color-text)]"
                            }`}
                    >
                        One-Time Order
                    </button>

                </div>
            )}

            {orderType === ORDER_TYPES.SUBSCRIPTION ? (
                props.mode === "create" ? (
                    <SubscriptionForm
                        mode="create"
                        onSubmit={
                            props.onCreateSubscription
                        }
                    />
                ) : (
                    <SubscriptionForm
                        mode="edit"
                        order={props.order}
                        onSubmit={
                            props.onUpdateSubscription
                        }
                    />
                )
            ) : props.mode === "create" ? (
                <OneTimeOrderForm
                    mode="create"
                    onSubmit={props.onCreateOrder}
                />
            ) : (
                <OneTimeOrderForm
                    mode="edit"
                    order={props.order}
                    onSubmit={props.onUpdateOrder}
                />
            )}
        </div>
    );
}