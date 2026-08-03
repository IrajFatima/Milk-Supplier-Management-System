import { FiEdit, FiEye } from "react-icons/fi";
import Table from "../../../components/Table";
import type { TableColumn } from "../../../components/Table";
import type { SystemConfigurationListItem } from "../../../types/systemConfiguration.types";

interface SystemConfigurationTableProps {
    systemConfigurations: SystemConfigurationListItem[];
    loading: boolean;
    canEdit: boolean;
    onView: (configKey: string) => void;
    onEdit: (configKey: string) => void;
}

export default function SystemConfigurationTable({
    systemConfigurations,
    loading,
    canEdit,
    onView,
    onEdit,
}: SystemConfigurationTableProps) {
    const columns: TableColumn<SystemConfigurationListItem>[] = [
        {
            key: "configKey",
            title: "Config Key",
        },
        {
            key: "configValue",
            title: "Config Value",
        },
        {
            key: "dataType",
            title: "Data Type",
        },
        {
            key: "category",
            title: "Category",
            render: (row) => row.category ?? "-",
        },
        {
            key: "isEncrypted",
            title: "Encrypted",
            render: (row) => (row.isEncrypted ? "Yes" : "No"),
        },
        {
            key: "updatedAt",
            title: "Updated At",
            render: (row) =>
                row.updatedAt
                    ? new Date(row.updatedAt).toLocaleString()
                    : "-",
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onView(row.configKey)}
                        title="View"
                        className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                    >
                        <FiEye />
                    </button>

                    {canEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(row.configKey)}
                            title="Edit"
                            className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                        >
                            <FiEdit />
                        </button>
                    )}

                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={systemConfigurations}
            loading={loading}
            emptyMessage="No system configurations found."
        />
    );
}
