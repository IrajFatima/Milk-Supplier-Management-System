import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
} from "vitest";

import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";

import UserForm from "../../../../src/features/users/components/UserForm";

const {
    userServiceMock,
    toastMock,
    authMock,
} = vi.hoisted(() => ({
    userServiceMock: {
        getRoles: vi.fn(),
    },

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

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

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

describe("UserForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        authMock.user.role = "Owner";

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
            {
                roleId: 4,
                roleName: "Accountant",
            },
            {
                roleId: 5,
                roleName: "System Administrator",
            },
            {
                roleId: 6,
                roleName: "Customer",
            },
        ]);
    });

    it("renders the create user form", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        render(
            <UserForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        expect(
            screen.getByText("Full Name")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Username")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Email")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Password")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Role")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Contact Number")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Hire Date")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Department")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Job Title")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create User",
            })
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(
                userServiceMock.getRoles
            ).toHaveBeenCalledTimes(1);
        });
    });

    it("shows validation errors for required fields", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        render(
            <UserForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create User",
            })
        );

        expect(
            await screen.findByText(
                "Full name is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Username is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Email is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Password is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Role is required."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Hire date is required."
            )
        ).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("loads available roles and excludes Owner and Customer", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <UserForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        await waitFor(() => {
            expect(
                userServiceMock.getRoles
            ).toHaveBeenCalledTimes(1);
        });

        const roleSelect = container.querySelector(
            'select[name="roleId"]'
        ) as HTMLSelectElement;

        expect(roleSelect).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Farm Worker",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Delivery Staff",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Accountant",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "System Administrator",
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("option", {
                name: "Owner",
            })
        ).not.toBeInTheDocument();

        expect(
            screen.queryByRole("option", {
                name: "Customer",
            })
        ).not.toBeInTheDocument();
    });

    it("submits user data in create mode", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        const { container } = render(
            <UserForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        await waitFor(() => {
            expect(
                userServiceMock.getRoles
            ).toHaveBeenCalledTimes(1);
        });

        const fullNameInput = container.querySelector(
            'input[name="fullName"]'
        ) as HTMLInputElement;

        const usernameInput = container.querySelector(
            'input[name="username"]'
        ) as HTMLInputElement;

        const emailInput = container.querySelector(
            'input[name="email"]'
        ) as HTMLInputElement;

        const passwordInput = container.querySelector(
            'input[name="password"]'
        ) as HTMLInputElement;

        const roleSelect = container.querySelector(
            'select[name="roleId"]'
        ) as HTMLSelectElement;

        const contactNumberInput = container.querySelector(
            'input[name="contactNumber"]'
        ) as HTMLInputElement;

        const hireDateInput = container.querySelector(
            'input[name="hireDate"]'
        ) as HTMLInputElement;

        const departmentInput = container.querySelector(
            'input[name="department"]'
        ) as HTMLInputElement;

        const jobTitleInput = container.querySelector(
            'input[name="jobTitle"]'
        ) as HTMLInputElement;

        expect(fullNameInput).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(roleSelect).toBeInTheDocument();
        expect(contactNumberInput).toBeInTheDocument();
        expect(hireDateInput).toBeInTheDocument();
        expect(departmentInput).toBeInTheDocument();
        expect(jobTitleInput).toBeInTheDocument();

        fireEvent.change(fullNameInput, {
            target: {
                value: "John Doe",
            },
        });

        fireEvent.change(usernameInput, {
            target: {
                value: "john.doe",
            },
        });

        fireEvent.change(emailInput, {
            target: {
                value: "john@example.com",
            },
        });

        fireEvent.change(passwordInput, {
            target: {
                value: "password123",
            },
        });

        fireEvent.change(roleSelect, {
            target: {
                value: "2",
            },
        });

        fireEvent.change(contactNumberInput, {
            target: {
                value: "03001234567",
            },
        });

        fireEvent.change(hireDateInput, {
            target: {
                value: "2026-01-15",
            },
        });

        fireEvent.change(departmentInput, {
            target: {
                value: "Farm",
            },
        });

        fireEvent.change(jobTitleInput, {
            target: {
                value: "Farm Worker",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create User",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                username: "john.doe",
                email: "john@example.com",
                password: "password123",
                roleId: 2,
                fullName: "John Doe",
                contactNumber: "03001234567",
                department: "Farm",
                jobTitle: "Farm Worker",
                hireDate: "2026-01-15",
            })
        );
    });

    it("loads existing user data in edit mode", async () => {
        const user = {
            userId: 1,
            username: "john.doe",
            email: "john@example.com",
            roleId: 2,
            fullName: "John Doe",
            contactNumber: "03001234567",
            department: "Farm",
            jobTitle: "Farm Worker",
            hireDate: "2026-01-15T00:00:00.000Z",
        } as never;

        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <UserForm
                mode="edit"
                user={user}
                onSubmit={onSubmit}
            />
        );

        expect(
            await screen.findByDisplayValue(
                "John Doe"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue("john.doe")
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue(
                "john@example.com"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue(
                "03001234567"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue("Farm")
        ).toBeInTheDocument();

        const roleSelect = container.querySelector(
            'select[name="roleId"]'
        ) as HTMLSelectElement;

        const jobTitleInput = container.querySelector(
            'input[name="jobTitle"]'
        ) as HTMLInputElement;

        const hireDateInput = container.querySelector(
            'input[name="hireDate"]'
        ) as HTMLInputElement;

        expect(roleSelect).toBeInTheDocument();
        expect(roleSelect).toHaveValue("2");

        expect(jobTitleInput).toBeInTheDocument();
        expect(jobTitleInput).toHaveValue(
            "Farm Worker"
        );

        expect(hireDateInput).toBeInTheDocument();
        expect(hireDateInput).toHaveValue(
            "2026-01-15"
        );

        expect(
            screen.getByRole("button", {
                name: "Update User",
            })
        ).toBeInTheDocument();

        const usernameInput = container.querySelector(
            'input[name="username"]'
        ) as HTMLInputElement;

        expect(usernameInput).toBeDisabled();

        expect(
            container.querySelector(
                'input[name="password"]'
            )
        ).not.toBeInTheDocument();
    });

    it("submits updated user data in edit mode", async () => {
        const user = {
            userId: 1,
            username: "john.doe",
            email: "john@example.com",
            roleId: 2,
            fullName: "John Doe",
            contactNumber: "03001234567",
            department: "Farm",
            jobTitle: "Farm Worker",
            hireDate: "2026-01-15T00:00:00.000Z",
        } as never;

        const onSubmit = vi
            .fn()
            .mockResolvedValue(undefined);

        const { container } = render(
            <UserForm
                mode="edit"
                user={user}
                onSubmit={onSubmit}
            />
        );

        await screen.findByDisplayValue(
            "John Doe"
        );

        const fullNameInput = container.querySelector(
            'input[name="fullName"]'
        ) as HTMLInputElement;

        const emailInput = container.querySelector(
            'input[name="email"]'
        ) as HTMLInputElement;

        const roleSelect = container.querySelector(
            'select[name="roleId"]'
        ) as HTMLSelectElement;

        fireEvent.change(fullNameInput, {
            target: {
                value: "Jane Doe",
            },
        });

        fireEvent.change(emailInput, {
            target: {
                value: "jane@example.com",
            },
        });

        fireEvent.change(roleSelect, {
            target: {
                value: "4",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Update User",
            })
        );

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                username: "john.doe",
                email: "jane@example.com",
                roleId: 4,
                fullName: "Jane Doe",
                contactNumber: "03001234567",
                department: "Farm",
                jobTitle: "Farm Worker",
                hireDate: "2026-01-15",
            })
        );
    });

    it("shows an error toast when form submission fails", async () => {
        const onSubmit = vi
            .fn()
            .mockRejectedValue(
                new Error("Unable to save user")
            );

        const { container } = render(
            <UserForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        await waitFor(() => {
            expect(
                userServiceMock.getRoles
            ).toHaveBeenCalledTimes(1);
        });

        fireEvent.change(
            container.querySelector(
                'input[name="fullName"]'
            ) as HTMLInputElement,
            {
                target: {
                    value: "John Doe",
                },
            }
        );

        fireEvent.change(
            container.querySelector(
                'input[name="username"]'
            ) as HTMLInputElement,
            {
                target: {
                    value: "john.doe",
                },
            }
        );

        fireEvent.change(
            container.querySelector(
                'input[name="email"]'
            ) as HTMLInputElement,
            {
                target: {
                    value: "john@example.com",
                },
            }
        );

        fireEvent.change(
            container.querySelector(
                'input[name="password"]'
            ) as HTMLInputElement,
            {
                target: {
                    value: "password123",
                },
            }
        );

        fireEvent.change(
            container.querySelector(
                'select[name="roleId"]'
            ) as HTMLSelectElement,
            {
                target: {
                    value: "2",
                },
            }
        );

        fireEvent.change(
            container.querySelector(
                'input[name="hireDate"]'
            ) as HTMLInputElement,
            {
                target: {
                    value: "2026-01-15",
                },
            }
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create User",
            })
        );

        await waitFor(() => {
            expect(
                onSubmit
            ).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });
    });

    it("excludes System Administrator when logged in as System Administrator", async () => {
        authMock.user = {
            userId: 2,
            username: "admin",
            email: "admin@msms.com",
            role: "System Administrator",
            employeeId: 2,
            accountStatus: "Active",
            lastLogin: null,
        };

        const onSubmit = vi.fn().mockResolvedValue(undefined);

        render(
            <UserForm
                mode="create"
                onSubmit={onSubmit}
            />
        );

        await waitFor(() => {
            expect(
                userServiceMock.getRoles
            ).toHaveBeenCalledTimes(1);
        });

        expect(
            screen.queryByRole("option", {
                name: "System Administrator",
            })
        ).not.toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Farm Worker",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Delivery Staff",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", {
                name: "Accountant",
            })
        ).toBeInTheDocument();
    });
});