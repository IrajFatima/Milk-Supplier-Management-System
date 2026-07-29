// src/features/orders/pages/OrderDetailsPage.tsx

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

import OrderDetails from "../components/OrderDetails";

import Spinner from "../../../components/Spinner";

import { orderService } from "../../../services/order.service";

import { useAuth } from "../../../hooks/useAuth";

import { ROLES } from "../../../constants/roles";
import { ORDER_TYPES } from "../../../constants/order";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import type { OrderItem } from "../../../types/order.types";

export default function OrderDetailsPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const view =
        location.state?.orderType ?? ORDER_TYPES.SUBSCRIPTION;

    const { id } = useParams();

    const { user } = useAuth();

    const [order, setOrder] =
        useState<OrderItem | null>(null);

    const [loading, setLoading] =
        useState(true);

    const canEdit =
        (user?.role === ROLES.OWNER ||
            user?.role === ROLES.ACCOUNTANT) &&
        order?.orderStatus !== "Cancelled" &&
        order?.orderStatus !== "Completed";

    useEffect(() => {
        async function loadOrder() {
            if (!id) return;

            try {
                const response =
                    view === ORDER_TYPES.SUBSCRIPTION
                        ? await orderService.getSubscription(Number(id))
                        : await orderService.getOrder(Number(id));

                setOrder(response);
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load order details."
                    )
                );
            } finally {
                setLoading(false);
            }
        }

        loadOrder();
    }, [id, view]);

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
            <div className="flex items-center justify-between">
                <h1
                    className="text-2xl font-bold"
                    style={{ color: "var(--color-text)" }}
                >
                    {view === ORDER_TYPES.SUBSCRIPTION
                        ? "Subscription Details"
                        : "One-Time Order Details"}
                </h1>

                {canEdit && (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/orders/${id}/edit`,
                                {
                                    state: {
                                        orderType:
                                            view,
                                    },
                                }
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-md
                            bg-[var(--color-primary)]
                            px-4
                            py-2
                            text-white
                            transition
                            hover:bg-[var(--color-primary-hover)]
                        "
                    >
                        <FiEdit size={18} />
                        Edit
                    </button>
                )}
            </div>

            <OrderDetails order={order} />
        </div>
    );
}