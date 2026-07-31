// src/features/users/components/UserTable.tsx

import { FiEdit, FiEye, FiRefreshCw, FiTrash2 } from "react-icons/fi";

import Table from "../../../components/Table";
import type { TableColumn } from "../../../components/Table";

import type { UserListItem } from "../../../types/user.types";
import UserStatusBadge from "./UserStatusBadge";
import { ACCOUNT_STATUS } from "../../../constants/user";

interface UserTableProps {
    users: UserListItem[];
    loading: boolean;
    canEdit: boolean;
    canDeactivate: boolean;
    canReactivate: boolean;
    currentUserId?: number;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDeactivate: (id: number) => void;
    onReactivate: (id: number) => void;
}
export default function UserTable({
    users,
    loading,
    canEdit,
    canDeactivate,
    canReactivate,
    currentUserId,
    onView,
    onEdit,
    onDeactivate,
    onReactivate,
}: UserTableProps) {

    const columns: TableColumn<UserListItem>[] = [
        { key: "fullName", title: "Full Name" },
        { key: "username", title: "Username" },
        { key: "email", title: "Email" },
        { key: "roleName", title: "Role" },
        {
            key: "department",
            title: "Department",
            render: (row) => row.department ?? "-",
        },
        {
            key: "jobTitle",
            title: "Job Title",
            render: (row) => row.jobTitle ?? "-",
        },
        {
            key: "accountStatus",
            title: "Account Status",
            render: (row) => <UserStatusBadge status={row.accountStatus} />,
        },
        {
            key: "actions",
            title: "Actions",
            render: (row) => {

                const isOwnAccount = row.userId === currentUserId;
                const canDeactivateUser =
                    canDeactivate &&
                    row.userId !== currentUserId &&
                    row.accountStatus === ACCOUNT_STATUS.ACTIVE;


                const canReactivateUser =
                    canReactivate &&
                    row.userId !== currentUserId &&
                    row.accountStatus === ACCOUNT_STATUS.INACTIVE;

                return (
                    <div className="flex items-center gap-2">

                        <button
                            type="button"
                            onClick={() => onView(row.userId)}
                            title="View"
                            className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                        >
                            <FiEye />
                        </button>


                        {canEdit && !isOwnAccount && (
                            <button
                                type="button"
                                onClick={() => onEdit(row.userId)}
                                title="Edit"
                                className="rounded p-2 transition hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                            >
                                <FiEdit />
                            </button>
                        )}


                        {!isOwnAccount && (
                            row.accountStatus === ACCOUNT_STATUS.ACTIVE ? (

                                canDeactivateUser && (
                                    <button
                                        type="button"
                                        onClick={() => onDeactivate(row.userId)}
                                        title="Deactivate"
                                        className="
                                rounded
                                p-2
                                text-[var(--color-danger)]
                                transition
                                hover:bg-[var(--color-sidebar-hover)]
                                hover:text-white
                            "
                                    >
                                        <FiTrash2 />
                                    </button>
                                )

                            ) : (

                                canReactivateUser && (
                                    <button
                                        type="button"
                                        onClick={() => onReactivate(row.userId)}
                                        title="Activate"
                                        className="
                                rounded
                                p-2
                                text-[var(--color-success)]
                                transition
                                hover:bg-[var(--color-sidebar-hover)]
                                hover:text-white
                            "
                                    >
                                        <FiRefreshCw />
                                    </button>
                                )

                            )
                        )}

                    </div>
                );
            }
        },
    ];

    return (
        <Table
            columns={columns}
            data={users}
            loading={loading}
            emptyMessage="No users found."
        />
    );
}