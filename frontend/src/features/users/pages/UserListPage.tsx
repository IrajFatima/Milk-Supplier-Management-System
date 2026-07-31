// src/features/users/pages/UserListPage.tsx

import { useCallback, useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Pagination from "../../../components/Pagination";

import UserFilters from "../components/UserFilters";
import UserSearchBar from "../components/UserSearchBar";
import UserTable from "../components/UserTable";
import ReactivateUserModal from "../components/ReactivateUserModal";
import DeactivateUserModal from "../components/DeactivateUserModal";

import { userService } from "../../../services/user.service";

import { useAuth } from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";

import { ROLES } from "../../../constants/roles";

import type {
    UserFilters as UserFiltersType,
    UserListItem,
    UserRole,
} from "../../../types/user.types";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

export default function UserListPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const latestRequest = useRef(0);

    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);

    const [filters, setFilters] = useState<UserFiltersType>({
        page: 1,
        limit: 10,
    });

    const [totalPages, setTotalPages] = useState(1);

    const [deactivateUserId, setDeactivateUserId] =
        useState<number | null>(null);

    const [reactivateUserId, setReactivateUserId] =
        useState<number | null>(null);
    const [roles, setRoles] = useState<UserRole[]>([]);

    const role = user?.role;

    const canCreate =
        role === ROLES.OWNER ||
        role === ROLES.SYSTEM_ADMINISTRATOR;

    const canEdit =
        role === ROLES.OWNER ||
        role === ROLES.SYSTEM_ADMINISTRATOR;

    const canDeactivate =
        role === ROLES.OWNER ||
        role === ROLES.SYSTEM_ADMINISTRATOR;

    const canReactivate =
        role === ROLES.OWNER ||
        role === ROLES.SYSTEM_ADMINISTRATOR;


    const loadUsers = useCallback(async () => {
        const requestId = ++latestRequest.current;

        try {
            setLoading(true);

            const response = await userService.getUsers({
                ...filters,
                search: debouncedSearch || undefined,
            });

            if (requestId !== latestRequest.current) {
                return;
            }

            setUsers(response.data);
            setTotalPages(response.totalPages);
        } catch (error: unknown) {
            if (requestId !== latestRequest.current) {
                return;
            }

            toast.error(
                getApiErrorMessage(error, "Failed to load users.")
            );
        } finally {
            if (requestId === latestRequest.current) {
                setLoading(false);
            }
        }
    }, [filters, debouncedSearch]);

    useEffect(() => {
        async function fetchUsers() {
            await loadUsers();
        }

        fetchUsers();
    }, [loadUsers]);

    useEffect(() => {
        async function fetchRoles() {
            try {
                const response = await userService.getRoles();
                setRoles(response);
            } catch (error: unknown) {
                toast.error(
                    getApiErrorMessage(error, "Failed to load roles.")
                );
            }
        }

        fetchRoles();
    }, []);

    const handleFilterChange = (
        updatedFilters: UserFiltersType
    ) => {
        setFilters(updatedFilters);
    };

    const handlePageChange = (page: number) => {
        setFilters((previous) => ({
            ...previous,
            page,
        }));
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1
                        className="text-2xl font-bold"
                        style={{
                            color: "var(--color-text)",
                        }}
                    >
                        User Management
                    </h1>

                    {canCreate && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/users/create")
                            }
                            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-white transition"
                            style={{
                                background:
                                    "var(--color-primary)",
                            }}
                        >
                            <FiPlus size={18} />
                            Add User
                        </button>
                    )}
                </div>

                <UserSearchBar
                    value={search}
                    onChange={(value) => {
                        setSearch(value);

                        setFilters((previous) => ({
                            ...previous,
                            page: 1,
                        }));
                    }}
                />

                <UserFilters
                    filters={filters}
                    onChange={handleFilterChange}
                    currentRole={user?.role}
                    roles={roles}
                />

                <UserTable
                    users={users.filter(item => item.userId !== user?.userId)}
                    loading={loading}
                    canEdit={canEdit}
                    canDeactivate={canDeactivate}
                    canReactivate={canReactivate}
                    currentUserId={user?.userId}
                    onView={(id) => navigate(`/users/${id}`)}
                    onEdit={(id) => navigate(`/users/${id}/edit`)}
                    onDeactivate={(id) => setDeactivateUserId(id)}
                    onReactivate={(id) => setReactivateUserId(id)}
                />

                <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <DeactivateUserModal
                isOpen={deactivateUserId !== null}
                userId={deactivateUserId}
                onClose={() =>
                    setDeactivateUserId(null)
                }
                onSuccess={loadUsers}
            />

            <ReactivateUserModal
                isOpen={reactivateUserId !== null}
                userId={reactivateUserId}
                onClose={() =>
                    setReactivateUserId(null)
                }
                onSuccess={loadUsers}
            />
        </>
    );
}