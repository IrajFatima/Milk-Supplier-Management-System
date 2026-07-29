import {
    FiEdit,
    FiEye,
    FiRefreshCw,
    FiRepeat,
    FiXCircle,
} from "react-icons/fi";

import Table from "../../../components/Table";
import type { TableColumn } from "../../../components/Table";

import {
    ORDER_TYPES,
    ONE_TIME_ORDER_STATUS,
    SUBSCRIPTION_STATUS,
    type OrderType,
    type OrderStatus,
} from "../../../constants/order";

import type { OrderListItem } from "../../../types/order.types";

import { formatDate } from "../../../utils/FormatDate";

import OrderStatusBadge from "./OrderStatusBadge";

interface OrderTableProps {
    orderType: OrderType;
    orders: OrderListItem[];
    loading: boolean;

    canEdit: boolean;
    canCancel: boolean;

    canChangeStatus: boolean;
    canReactivate: boolean;

    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onCancel: (id: number) => void;
    onChangeStatus: (id: number, status: OrderStatus) => void;
    onReactivate: (id: number) => void;
}

export default function OrderTable({
    orderType,
    orders,
    loading,
    canEdit,
    canCancel,
    canChangeStatus,
    canReactivate,
    onView,
    onEdit,
    onCancel,
    onChangeStatus,
    onReactivate,
}: OrderTableProps) {
    const isSubscription =
        orderType === ORDER_TYPES.SUBSCRIPTION;

    const columns: TableColumn<OrderListItem>[] = [
        {
            key: "customerName",
            title: "Customer",
        },
        {
            key: "milkTypeName",
            title: "Milk Type",
        },
        {
            key: "quantity",
            title: "Quantity (L)",
            render: (row) =>
                `${row.quantity} L`,
        },
        {
            key: "deliveryDate",
            title: isSubscription
                ? "Next Delivery"
                : "Delivery Date",
            render: (row) =>
                row.deliveryDate
                    ? formatDate(
                        row.deliveryDate,
                        "dateTime"
                    )
                    : "-",
        },
        {
            key: "deliveryTimePreference",
            title: "Slot",
            render: (row) =>
                row.deliveryTimePreference ??
                "-",
        },
        {
            key: "orderStatus",
            title: "Status",
            render: (row) => (
                <OrderStatusBadge
                    status={row.orderStatus}
                />
            ),
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => {
                const isCancelled = isSubscription
                    ? row.orderStatus === SUBSCRIPTION_STATUS.CANCELLED
                    : row.orderStatus === ONE_TIME_ORDER_STATUS.CANCELLED;

                const isCompleted = isSubscription
                    ? row.orderStatus === SUBSCRIPTION_STATUS.COMPLETED
                    : row.orderStatus === ONE_TIME_ORDER_STATUS.COMPLETED;

                return (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onView(row.orderId)}
                            title="View"
                            className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                        >
                            <FiEye />
                        </button>

                        {!isCancelled && !isCompleted && (
                            <>
                                {canEdit && (
                                    <button
                                        type="button"
                                        onClick={() => onEdit(row.orderId)}
                                        title="Edit"
                                        className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                                    >
                                        <FiEdit />
                                    </button>
                                )}

                                {canChangeStatus && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onChangeStatus(row.orderId, row.orderStatus)
                                        }
                                        title="Change Status"
                                        className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                                    >
                                        <FiRepeat />
                                    </button>
                                )}

                                {canCancel && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onCancel(row.orderId)
                                        }
                                        title={
                                            isSubscription
                                                ? "Cancel Subscription"
                                                : "Cancel Order"
                                        }
                                        className="rounded p-2 text-[var(--color-danger)] transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                                    >
                                        <FiXCircle />
                                    </button>
                                )}
                            </>
                        )}

                        {isCancelled && canReactivate && (
                            <button
                                type="button"
                                onClick={() =>
                                    onReactivate(row.orderId)
                                }
                                title="Reactivate"
                                className="rounded p-2 text-green-600 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                            >
                                <FiRefreshCw />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            data={orders}
            loading={loading}
            emptyMessage={`No ${isSubscription
                ? "subscriptions"
                : "orders"
                } found.`}
        />
    );
}