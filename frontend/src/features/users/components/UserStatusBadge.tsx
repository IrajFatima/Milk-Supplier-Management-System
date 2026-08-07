// src/features/users/components/UserStatusBadge.tsx

import type {
    AccountStatus,
    EmploymentStatus,
} from "../../../constants/user";

interface UserStatusBadgeProps {
    status: AccountStatus | EmploymentStatus;
}

const statusStyles: Record<
    AccountStatus | EmploymentStatus,
    {
        label: string;
        background: string;
        color: string;
    }
> = {
    Active: {
        label: "Active",
        background: "var(--color-success)",
        color: "#ffffff",
    },
    Inactive: {
        label: "Inactive",
        background: "var(--color-danger)",
        color: "#ffffff",
    },
    
};

export default function UserStatusBadge({
    status,
}: UserStatusBadgeProps) {
    const style = statusStyles[status];

    return (
        <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
                backgroundColor: style?.background || "var(--color-text-secondary)",
                color: style.color,
            }}
        >
            {style.label}
        </span>
    );
}