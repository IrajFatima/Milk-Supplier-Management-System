// src/features/users/components/UserDetails.tsx

import UserStatusBadge from "./UserStatusBadge";

import type { UserDetails as UserDetailsType } from "../../../types/user.types";

interface UserDetailsProps {
    user: UserDetailsType;
}

export default function UserDetails({
    user,
}: UserDetailsProps) {
    return (
        <div
            className="
                grid
                gap-6
                rounded-xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                p-6
                md:grid-cols-2
            "
        >
            <DetailItem
                label="Full Name"
                value={user.fullName}
            />

            <DetailItem
                label="Username"
                value={user.username}
            />

            <DetailItem
                label="Email"
                value={user.email}
            />

            <DetailItem
                label="Contact Number"
                value={user.contactNumber ?? "-"}
            />

            <DetailItem
                label="Role"
                value={user.roleName}
            />

            <DetailItem
                label="Department"
                value={user.department ?? "-"}
            />

            <DetailItem
                label="Job Title"
                value={user.jobTitle ?? "-"}
            />

            <DetailItem
                label="Hire Date"
                value={
                    user.hireDate
                        ? new Date(user.hireDate).toLocaleDateString()
                        : "-"
                }
            />

            <DetailItem
                label="Employment Status"
                value={user.employmentStatus}
            />

            <div>
                <p className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    Account Status
                </p>

                <UserStatusBadge
                    status={user.accountStatus}
                />
            </div>

            <DetailItem
                label="Last Login"
                value={
                    user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : "-"
                }
            />

            <DetailItem
                label="Employee ID"
                value={String(user.employeeId)}
            />
        </div>
    );
}

interface DetailItemProps {
    label: string;
    value: string;
}

function DetailItem({
    label,
    value,
}: DetailItemProps) {
    return (
        <div>
            <p className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]">
                {label}
            </p>

            <p className="text-[var(--color-text)]">
                {value}
            </p>
        </div>
    );
}