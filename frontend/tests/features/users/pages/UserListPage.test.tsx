import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    screen,
    waitFor,
    fireEvent,
} from "@testing-library/react";

import { renderWithProviders } from "../../../helpers/render";

import UserListPage from "../../../../src/features/users/pages/UserListPage";

const {
    navigateMock,
    authMock,
    toastMock,
    userServiceMock,
} = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    authMock: {
        user: {
            userId: 1,
            username: "owner",
            email: "owner@msms.com",
            role: "Owner",
            employeeId: 1,
            accountStatus: "Active",
            lastLogin: null,
        },
        token: "token",
        loading: false,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
    },

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

    userServiceMock: {
        getUsers: vi.fn(),
        getRoles: vi.fn(),
    },
}));

vi.mock(
    "../../../../src/services/user.service",
    () => ({
        userService: userServiceMock,
    })
);

vi.mock("../../../../src/hooks/useAuth", () => ({
    useAuth: () => authMock,
}));

vi.mock("../../../../src/hooks/useDebounce", () => ({
    default: (value: string) => value,
}));

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock(
    "../../../../src/components/Pagination",
    () => ({
        default: ({
            currentPage,
            totalPages,
            onPageChange,
        }: {
            currentPage: number;
            totalPages: number;
            onPageChange: (page: number) => void;
        }) => (
            <div>
                Page {currentPage} of {totalPages}

                <button
                    type="button"
                    onClick={() => onPageChange(2)}
                >
                    Next Page
                </button>
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/users/components/UserSearchBar",
    () => ({
        default: ({
            value,
            onChange,
        }: {
            value: string;
            onChange: (value: string) => void;
        }) => (
            <input
                aria-label="User Search"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
            />
        ),
    })
);

vi.mock(
    "../../../../src/features/users/components/UserFilters",
    () => ({
        default: ({
            filters,
            roles,
            onChange,
        }: {
            filters: {
                page: number;
                limit: number;
            };
            roles: Array<{
                roleId: number;
                roleName: string;
            }>;
            onChange: (filters: {
                page?: number;
                limit?: number;
                roleId?: number;
            }) => void;
        }) => (
            <div>
                User Filters

                <span>
                    Roles: {roles.length}
                </span>

                <button
                    type="button"
                    onClick={() =>
                        onChange({
                            ...filters,
                            roleId: 2,
                            page: 1,
                        })
                    }
                >
                    Apply Filter
                </button>
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/users/components/UserTable",
    () => ({
        default: ({
            users,
            loading,
            canEdit,
            canDeactivate,
            canReactivate,
            onView,
            onEdit,
            onDeactivate,
            onReactivate,
        }: {
            users: Array<{
                userId: number;
                username: string;
            }>;
            loading: boolean;
            canEdit: boolean;
            canDeactivate: boolean;
            canReactivate: boolean;
            currentUserId?: number;
            onView: (id: number) => void;
            onEdit: (id: number) => void;
            onDeactivate: (id: number) => void;
            onReactivate: (id: number) => void;
        }) => (
            <div>
                {loading && (
                    <div>Loading users...</div>
                )}

                {!loading &&
                    users.map((user) => (
                        <div key={user.userId}>
                            <span>
                                User {user.userId}
                            </span>

                            <span>
                                Username: {user.username}
                            </span>

                            <span>
                                {canEdit
                                    ? "Can Edit"
                                    : "Cannot Edit"}
                            </span>

                            <span>
                                {canDeactivate
                                    ? "Can Deactivate"
                                    : "Cannot Deactivate"}
                            </span>

                            <span>
                                {canReactivate
                                    ? "Can Reactivate"
                                    : "Cannot Reactivate"}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    onView(user.userId)
                                }
                            >
                                View User
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    onEdit(user.userId)
                                }
                            >
                                Edit User
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    onDeactivate(
                                        user.userId
                                    )
                                }
                            >
                                Deactivate User
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    onReactivate(
                                        user.userId
                                    )
                                }
                            >
                                Reactivate User
                            </button>
                        </div>
                    ))}
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/users/components/DeactivateUserModal",
    () => ({
        default: ({
            isOpen,
            userId,
            onClose,
            onSuccess,
        }: {
            isOpen: boolean;
            userId: number | null;
            onClose: () => void;
            onSuccess: () => void;
        }) => {
            if (!isOpen) {
                return null;
            }

            return (
                <div role="dialog">
                    <h2>
                        Deactivate User Modal
                    </h2>

                    <span>
                        User ID: {userId}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Close Deactivate Modal
                    </button>

                    <button
                        type="button"
                        onClick={onSuccess}
                    >
                        Confirm Deactivate User
                    </button>
                </div>
            );
        },
    })
);

vi.mock(
    "../../../../src/features/users/components/ReactivateUserModal",
    () => ({
        default: ({
            isOpen,
            userId,
            onClose,
            onSuccess,
        }: {
            isOpen: boolean;
            userId: number | null;
            onClose: () => void;
            onSuccess: () => void;
        }) => {
            if (!isOpen) {
                return null;
            }

            return (
                <div role="dialog">
                    <h2>
                        Reactivate User Modal
                    </h2>

                    <span>
                        User ID: {userId}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Close Reactivate Modal
                    </button>

                    <button
                        type="button"
                        onClick={onSuccess}
                    >
                        Confirm Reactivate User
                    </button>
                </div>
            );
        },
    })
);

vi.mock("react-router-dom", async () => {
    const actual =
        await vi.importActual<
            typeof import("react-router-dom")
        >("react-router-dom");

    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe("UserListPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        authMock.user.role = "Owner";

        userServiceMock.getUsers.mockResolvedValue({
            data: [
                {
                    userId: 2,
                    username: "farmworker",
                    email: "farmworker@msms.com",
                    role: "Farm Worker",
                },
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
        });

        userServiceMock.getRoles.mockResolvedValue([
            {
                roleId: 1,
                roleName: "Owner",
            },
            {
                roleId: 2,
                roleName: "Farm Worker",
            },
            {
                roleId: 3,
                roleName: "Delivery Staff",
            },
        ]);
    });

    it("renders the user management page", async () => {
        renderWithProviders(
            <UserListPage />
        );

        expect(
            screen.getByRole("heading", {
                name: "User Management",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /add user/i,
            })
        ).toBeInTheDocument();

        expect(
            await screen.findByText("User 2")
        ).toBeInTheDocument();
    });

    it("loads users with the default filters", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await waitFor(() => {
            expect(
                userServiceMock.getUsers
            ).toHaveBeenCalledWith({
                page: 1,
                limit: 10,
                search: undefined,
            });
        });
    });

    it("loads available roles for filters", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await waitFor(() => {
            expect(
                userServiceMock.getRoles
            ).toHaveBeenCalledTimes(1);
        });

        expect(
            await screen.findByText("Roles: 3")
        ).toBeInTheDocument();
    });

    it("shows an error toast when loading users fails", async () => {
        userServiceMock.getUsers.mockRejectedValue(
            new Error("Failed to load users")
        );

        renderWithProviders(
            <UserListPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("shows an error toast when loading roles fails", async () => {
        userServiceMock.getRoles.mockRejectedValue(
            new Error("Failed to load roles")
        );

        renderWithProviders(
            <UserListPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("shows edit, deactivate, and reactivate permissions for an owner", async () => {
        renderWithProviders(
            <UserListPage />
        );

        expect(
            await screen.findByText("Can Edit")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Can Deactivate")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Can Reactivate")
        ).toBeInTheDocument();
    });

    it("shows the add user button for an owner", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        expect(
            screen.getByRole("button", {
                name: /add user/i,
            })
        ).toBeInTheDocument();
    });

    it("shows the add user button for a system administrator", async () => {
        authMock.user.role =
            "System Administrator";

        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        expect(
            screen.getByRole("button", {
                name: /add user/i,
            })
        ).toBeInTheDocument();
    });

    it("does not show the add user button for roles without permission", async () => {
        authMock.user.role = "Accountant";

        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        expect(
            screen.queryByRole("button", {
                name: /add user/i,
            })
        ).not.toBeInTheDocument();
    });

    it("navigates to create user page", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        fireEvent.click(
            screen.getByRole("button", {
                name: /add user/i,
            })
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/users/create"
        );
    });

    it("navigates to the user details page", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        fireEvent.click(
            screen.getByRole("button", {
                name: "View User",
            })
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/users/2"
        );
    });

    it("navigates to the user edit page", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Edit User",
            })
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/users/2/edit"
        );
    });

    it("updates the page when pagination changes", async () => {
        userServiceMock.getUsers
            .mockResolvedValueOnce({
                data: [
                    {
                        userId: 2,
                        username: "farmworker",
                    },
                ],
                total: 20,
                page: 1,
                limit: 10,
                totalPages: 2,
            })
            .mockResolvedValueOnce({
                data: [],
                total: 20,
                page: 2,
                limit: 10,
                totalPages: 2,
            });

        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Next Page",
            })
        );

        await waitFor(() => {
            expect(
                userServiceMock.getUsers
            ).toHaveBeenLastCalledWith({
                page: 2,
                limit: 10,
                search: undefined,
            });
        });
    });

    it("updates the search and resets the page to 1", async () => {
        userServiceMock.getUsers
            .mockResolvedValueOnce({
                data: [
                    {
                        userId: 2,
                        username: "farmworker",
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            })
            .mockResolvedValueOnce({
                data: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        const searchInput =
            screen.getByRole("textbox", {
                name: "User Search",
            });

        fireEvent.change(searchInput, {
            target: {
                value: "farmworker",
            },
        });

        await waitFor(() => {
            expect(
                userServiceMock.getUsers
            ).toHaveBeenLastCalledWith({
                page: 1,
                limit: 10,
                search: "farmworker",
            });
        });
    });

    it("updates filters and reloads users", async () => {
        userServiceMock.getUsers
            .mockResolvedValueOnce({
                data: [
                    {
                        userId: 2,
                        username: "farmworker",
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
            })
            .mockResolvedValueOnce({
                data: [],
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            });

        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Apply Filter",
            })
        );

        await waitFor(() => {
            expect(
                userServiceMock.getUsers
            ).toHaveBeenLastCalledWith({
                page: 1,
                limit: 10,
                roleId: 2,
                search: undefined,
            });
        });
    });

    it("opens the deactivate user modal", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Deactivate User",
            })
        );

        expect(
            await screen.findByRole("dialog")
        ).toBeInTheDocument();

        expect(
            screen.getByText("User ID: 2")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Confirm Deactivate User",
            })
        ).toBeInTheDocument();
    });

    it("closes the deactivate user modal", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Deactivate User",
            })
        );

        expect(
            await screen.findByRole("dialog")
        ).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Close Deactivate Modal",
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByRole("dialog")
            ).not.toBeInTheDocument();
        });
    });

    it("opens the reactivate user modal", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Reactivate User",
            })
        );

        expect(
            await screen.findByRole("dialog")
        ).toBeInTheDocument();

        expect(
            screen.getByText("User ID: 2")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Confirm Reactivate User",
            })
        ).toBeInTheDocument();
    });

    it("closes the reactivate user modal", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        fireEvent.click(
            screen.getByRole("button", {
                name: "Reactivate User",
            })
        );

        expect(
            await screen.findByRole("dialog")
        ).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Close Reactivate Modal",
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByRole("dialog")
            ).not.toBeInTheDocument();
        });
    });

    it("reloads users after deactivation succeeds", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        await waitFor(() => {
            expect(
                userServiceMock.getUsers
            ).toHaveBeenCalledTimes(1);
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Deactivate User",
            })
        );

        expect(
            await screen.findByRole("dialog")
        ).toBeInTheDocument();

        const initialCallCount =
            userServiceMock.getUsers.mock.calls.length;

        fireEvent.click(
            screen.getByRole("button", {
                name: "Confirm Deactivate User",
            })
        );

        await waitFor(() => {
            expect(
                userServiceMock.getUsers.mock.calls.length
            ).toBeGreaterThan(initialCallCount);
        });
    });

    it("reloads users after reactivation succeeds", async () => {
        renderWithProviders(
            <UserListPage />
        );

        await screen.findByText("User 2");

        await waitFor(() => {
            expect(
                userServiceMock.getUsers
            ).toHaveBeenCalledTimes(1);
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Reactivate User",
            })
        );

        expect(
            await screen.findByRole("dialog")
        ).toBeInTheDocument();

        const initialCallCount =
            userServiceMock.getUsers.mock.calls.length;

        fireEvent.click(
            screen.getByRole("button", {
                name: "Confirm Reactivate User",
            })
        );

        await waitFor(() => {
            expect(
                userServiceMock.getUsers.mock.calls.length
            ).toBeGreaterThan(initialCallCount);
        });
    });
});