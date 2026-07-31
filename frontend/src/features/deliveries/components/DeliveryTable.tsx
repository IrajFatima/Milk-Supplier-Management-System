// src/features/deliveries/components/DeliveryTable.tsx

import { FiEdit, FiEye, FiCheckCircle } from "react-icons/fi";

import Table from "../../../components/Table";
import type { TableColumn } from "../../../components/Table";

import type { DeliveryListItem } from "../../../types/delivery.types";

import DeliveryStatusBadge from "./DeliveryStatusBadge";

interface DeliveryTableProps {
    deliveries: DeliveryListItem[];
    loading: boolean;
    canAssign: boolean;
    canUpdate: boolean;
    onView: (deliveryId: number) => void;
    onAssign: (deliveryId: number) => void;
    onUpdate: (
        delivery: DeliveryListItem
    ) => void;
}

export default function DeliveryTable({
    deliveries,
    loading,
    canAssign,
    canUpdate,
    onView,
    onAssign,
    onUpdate,
}: DeliveryTableProps) {
    const columns: TableColumn<DeliveryListItem>[] = [
        {
            key: "deliveryId",
            title: "Delivery ID",
        },
        {
            key: "customerName",
            title: "Customer",
        },
        {
            key: "orderType",
            title: "Order Type",
        },
        {
            key: "milkType",
            title: "Milk Type",
        },
        {
            key: "scheduledQuantity",
            title: "Scheduled Qty",
            render: (row) => row.scheduledQuantity + " L",
        },
        {
            key: "deliveryDate",
            title: "Delivery Date",
            render: (row) =>
                new Date(row.deliveryDate).toLocaleDateString(),
        },
        {
            key: "deliveryStaffName",
            title: "Assigned Staff",
            render: (row) => row.deliveryStaffName ?? "-",
        },
        {
            key: "deliveryStatus",
            title: "Status",
            render: (row) => (
                <DeliveryStatusBadge status={row.deliveryStatus} />
            ),
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onView(row.deliveryId)}
                        title="View"
                        className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                    >
                        <FiEye />
                    </button>

                    {canAssign && !row.deliveryStaffId && (
                        <button
                            type="button"
                            onClick={() => onAssign(row.deliveryId)}
                            title="Assign Delivery Staff"
                            className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                        >
                            <FiEdit />
                        </button>
                    )}

                    {canUpdate &&
                        row.deliveryStatus === "Scheduled" && (
                            <button
                                type="button"
                                onClick={() => onUpdate(row)}
                                title="Update Delivery Status"
                                className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                            >
                                <FiCheckCircle />
                            </button>
                        )}
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={deliveries}
            loading={loading}
            emptyMessage="No deliveries found."
        />
    );
}