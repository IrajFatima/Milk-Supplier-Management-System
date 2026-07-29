// src/features/orders/pages/OrderListPage.tsx

import { useCallback, useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Pagination from "../../../components/Pagination";

import OrderFilters from "../components/OrderFilters";
import OrderSearchBar from "../components/OrderSearchBar";
import OrderTable from "../components/OrderTable";
import CancelOrderModal from "../components/CancelOrderModal";
import ChangeOrderStatusModal from "../components/ChangeOrderStatusModal";
import ReactivateOrderModal from "../components/ReactivateOrderModal";
import { orderService } from "../../../services/order.service";

import { useAuth } from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";

import {
    DEFAULT_LIMIT,
    DEFAULT_PAGE,
} from "../../../constants/order";
import { ROLES } from "../../../constants/roles";
import type { OrderStatus, OrderType } from "../../../constants/order";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { ORDER_TYPES } from "../../../constants/order";

import type {
    OrderFilters as OrderFiltersType,
    OrderListItem,
} from "../../../types/order.types";

export default function OrderListPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const latestRequest = useRef(0);

    const [view, setView] =
        useState<OrderType>(ORDER_TYPES.ONE_TIME);

    const [orders, setOrders] = useState<
        OrderListItem[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] = useState("");

    const debouncedSearch =
        useDebounce(search);

    const [filters, setFilters] =
        useState<OrderFiltersType>({
            page: DEFAULT_PAGE,
            limit: DEFAULT_LIMIT,
        });

    const [totalPages, setTotalPages] =
        useState(1);

    const [cancelOrderId, setCancelOrderId] =
        useState<number | null>(null);
    const [changeStatusOrderId, setChangeStatusOrderId] =
        useState<number | null>(null);

    const [reactivateOrderId, setReactivateOrderId] =
        useState<number | null>(null);

    const [selectedStatus, setSelectedStatus] =
        useState<OrderStatus | null>(null);

    const role = user?.role;

    const canCreate =
        role === ROLES.OWNER ||
        role === ROLES.ACCOUNTANT;

    const canEdit =
        role === ROLES.OWNER ||
        role === ROLES.ACCOUNTANT;

    const canCancel =
        role === ROLES.OWNER;
    const canChangeStatus =
        role === ROLES.OWNER ||
        role === ROLES.ACCOUNTANT;

    const canReactivate =
        role === ROLES.OWNER;

    const loadOrders = useCallback(async () => {
        const requestId =
            ++latestRequest.current;

        try {
            setLoading(true);

            const response =
                view === ORDER_TYPES.ONE_TIME
                    ? await orderService.getOrders({
                        ...filters,
                        search:
                            debouncedSearch ||
                            undefined,
                    })
                    : await orderService.getSubscriptions(
                        {
                            ...filters,
                            search:
                                debouncedSearch ||
                                undefined,
                        }
                    );

            if (
                requestId !==
                latestRequest.current
            ) {
                return;
            }

            setOrders(response.data);

            setTotalPages(
                Math.max(
                    1,
                    Math.ceil(
                        response.total /
                        response.limit
                    )
                )
            );
        } catch (error: unknown) {
            if (
                requestId !==
                latestRequest.current
            ) {
                return;
            }

            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to load orders."
                )
            );
        } finally {
            if (
                requestId ===
                latestRequest.current
            ) {
                setLoading(false);
            }
        }
    }, [
        view,
        filters,
        debouncedSearch,
    ]);

    useEffect(() => {
        const load = async () => {
            await loadOrders();
        }
        load();
    }, [loadOrders]);

    const handleFilterChange = (
        updatedFilters: OrderFiltersType
    ) => {
        setFilters(updatedFilters);
    };

    const handlePageChange = (
        page: number
    ) => {
        setFilters((previous) => ({
            ...previous,
            page,
        }));
    };

    const handleViewChange = (
        newView: OrderType
    ) => {
        setView(newView);

        setFilters({
            page: DEFAULT_PAGE,
            limit: DEFAULT_LIMIT,
        });

        setSearch("");
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3">
                        <h1
                            className="text-2xl font-bold"
                            style={{
                                color:
                                    "var(--color-text)",
                            }}
                        >
                            Orders
                        </h1>

                        <div className="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden">
                            <button
                                type="button"
                                onClick={() =>
                                    handleViewChange(
                                        ORDER_TYPES.ONE_TIME
                                    )
                                }
                                className={`px-4 py-2 text-sm font-medium transition ${view ===
                                    ORDER_TYPES.ONE_TIME
                                    ? "bg-[var(--color-primary)] text-white"
                                    : "bg-[var(--color-surface)] text-[var(--color-text)]"
                                    }`}
                            >
                                One-Time Orders
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleViewChange(
                                        ORDER_TYPES.SUBSCRIPTION
                                    )
                                }
                                className={`px-4 py-2 text-sm font-medium transition ${view ===
                                    ORDER_TYPES.SUBSCRIPTION
                                    ? "bg-[var(--color-primary)] text-white"
                                    : "bg-[var(--color-surface)] text-[var(--color-text)]"
                                    }`}
                            >
                                Subscriptions
                            </button>
                        </div>
                    </div>

                    {canCreate && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/orders/create",
                                    {
                                        state: {
                                            orderType:
                                                view,
                                        },
                                    }
                                )
                            }
                            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-white transition"
                            style={{
                                background:
                                    "var(--color-primary)",
                            }}
                        >
                            <FiPlus
                                size={18}
                            />
                            {view ===
                                ORDER_TYPES.ONE_TIME
                                ? "Add Order"
                                : "Add Subscription"}
                        </button>
                    )}
                </div>

                <OrderSearchBar
                    value={search}
                    onChange={(
                        value
                    ) => {
                        setSearch(value);

                        setFilters(
                            (
                                previous
                            ) => ({
                                ...previous,
                                page: DEFAULT_PAGE,
                            })
                        );
                    }}
                />

                <OrderFilters
                    orderType={view}
                    filters={filters}
                    onChange={
                        handleFilterChange
                    }
                />

                <OrderTable
                    orderType={view}
                    orders={orders}
                    loading={loading}
                    canEdit={canEdit}
                    canCancel={canCancel}
                    canChangeStatus={canChangeStatus}
                    canReactivate={canReactivate}
                    onView={(id) =>
                        navigate(
                            `/orders/${id}`,
                            {
                                state: {
                                    orderType:
                                        view,
                                },
                            }
                        )
                    }
                    onEdit={(id) =>
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
                    onCancel={(id) =>
                        setCancelOrderId(
                            id
                        )
                    }
                    onChangeStatus={(id, status) => {
                        setChangeStatusOrderId(id);
                        setSelectedStatus(status);
                    }}
                    onReactivate={(id) => {
                        setReactivateOrderId(id);
                    }}
                />

                <Pagination
                    currentPage={
                        filters.page ??
                        DEFAULT_PAGE
                    }
                    totalPages={
                        totalPages
                    }
                    onPageChange={
                        handlePageChange
                    }
                />
            </div>

            <CancelOrderModal
                isOpen={
                    cancelOrderId !==
                    null
                }
                orderId={
                    cancelOrderId
                }
                orderType={view as OrderType}
                onClose={() =>
                    setCancelOrderId(
                        null
                    )
                }
                onSuccess={
                    loadOrders
                }
            />
            <ChangeOrderStatusModal
                isOpen={changeStatusOrderId !== null}
                orderId={changeStatusOrderId}
                currentStatus={selectedStatus}
                orderType={view}
                onClose={() => {
                    setChangeStatusOrderId(null);
                    setSelectedStatus(null);
                }}
                onSuccess={loadOrders}
            />

            <ReactivateOrderModal
                isOpen={reactivateOrderId !== null}
                orderId={reactivateOrderId}
                orderType={view}
                onClose={() => {
                    setReactivateOrderId(null);
                }}
                onSuccess={loadOrders}
            />
        </>
    );
}