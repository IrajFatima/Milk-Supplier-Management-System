import type { ChangeEvent } from "react";

import Dropdown from "../../../components/Dropdown";

import { ROLES, type Role } from "../../../constants/roles";
import {
    ACCOUNT_STATUS,
    type AccountStatus,
} from "../../../constants/user";

import type {
    UserFilters as UserFiltersType,
    UserRole,
} from "../../../types/user.types";

interface UserFiltersProps {
    filters: UserFiltersType;
    currentRole?: Role;
    roles: UserRole[];
    onChange: (filters: UserFiltersType) => void;
}

export default function UserFilters({
    filters,
    onChange,
    currentRole,
    roles,
}: UserFiltersProps) {
    const availableRoles = roles.filter(
        (role) =>
            role.roleName !== ROLES.CUSTOMER &&
            role.roleName !== ROLES.OWNER &&
            (
                currentRole !== ROLES.SYSTEM_ADMINISTRATOR ||
                role.roleName !== ROLES.SYSTEM_ADMINISTRATOR
            )
    );
    const handleChange =
        (
            field: keyof Pick<UserFiltersType, "roleId" | "accountStatus">
        ) =>
            (event: ChangeEvent<HTMLSelectElement>) => {
                const value = event.target.value;

                onChange({
                    ...filters,
                    page: 1,
                    [field]:
                        value === ""
                            ? undefined
                            : field === "roleId"
                                ? Number(value)
                                : value,
                });
            };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Dropdown
                value={filters.roleId ?? ""}
                onChange={handleChange("roleId")}
            >
                <option value="">All Roles</option>

                {availableRoles.map((role) => (
                    <option
                        key={role.roleId}
                        value={role.roleId}
                    >
                        {role.roleName}
                    </option>
                ))}
            </Dropdown>

            <Dropdown
                value={filters.accountStatus ?? ""}
                onChange={handleChange("accountStatus")}
            >
                <option value="">All Statuses</option>

                {Object.values(ACCOUNT_STATUS).map(
                    (status: AccountStatus) => (
                        <option
                            key={status}
                            value={status}
                        >
                            {status}
                        </option>
                    )
                )}
            </Dropdown>
        </div>
    );
}