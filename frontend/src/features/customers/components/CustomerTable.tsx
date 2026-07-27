import { FiEdit, FiEye, FiRepeat } from "react-icons/fi";

import Table from "../../../components/Table";
import type { TableColumn } from "../../../components/Table";

import type { CustomerListItem } from "../../../types/customer.types";
import CustomerStatusBadge from "./CustomerStatusBadge";

interface CustomerTableProps {
    customers: CustomerListItem[];
    loading: boolean;
    canEdit: boolean;
    canChangeStatus: boolean;

    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onChangeStatus: (id: number) => void;
}

export default function CustomerTable({
    customers,
    loading,
    canEdit,
    canChangeStatus,
    onView,
    onEdit,
    onChangeStatus,
}: CustomerTableProps) {
    const columns: TableColumn<CustomerListItem>[] = [
        {
            key: "customer_name",
            title: "Customer",
        },
        {
            key: "customer_type",
            title: "Type",
        },
        {
            key: "contact_number",
            title: "Contact",
            render: (row) => row.contact_number ?? "-",
        },
        {
            key: "email_address",
            title: "Email",
            render: (row) => row.email_address ?? "-",
        },
        {
            key: "payment_model",
            title: "Payment",
            render: (row) => row.payment_model ?? "-",
        },
        {
            key: "account_status",
            title: "Status",
            render: (row) => (
                <CustomerStatusBadge status={row.account_status} />
            ),
        },
        {
            key: "registration_date",
            title: "Registered",
            render: (row) =>
                new Date(row.registration_date).toLocaleDateString(),
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onView(row.customer_id)}
                        title="View"
                        className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                    >
                        <FiEye />
                    </button>

                    {canEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(row.customer_id)}
                            title="Edit"
                            className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                        >
                            <FiEdit />
                        </button>
                    )}

                    {canChangeStatus && (
                        <button
                            type="button"
                            onClick={() => onChangeStatus(row.customer_id)}
                            title="Change Status"
                            className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                        >
                            <FiRepeat />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={customers}
            loading={loading}
            emptyMessage="No customers found."
        />
    );
}