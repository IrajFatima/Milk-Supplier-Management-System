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
} from "@testing-library/react";

import { renderWithProviders } from "../../../helpers/render";

import CreateUserPage from "../../../../src/features/users/pages/CreateUserPage";

const {
    navigateMock,
    toastMock,
    userServiceMock,
} = vi.hoisted(() => ({
    navigateMock: vi.fn(),

    toastMock: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },

    userServiceMock: {
        createUser: vi.fn(),
    },
}));

vi.mock(
    "react-router-dom",
    async () => {
        const actual =
            await vi.importActual<
                typeof import("react-router-dom")
            >("react-router-dom");

        return {
            ...actual,
            useNavigate: () => navigateMock,
        };
    }
);

vi.mock(
    "../../../../src/services/user.service",
    () => ({
        userService: userServiceMock,
    })
);

vi.mock("react-toastify", () => ({
    toast: toastMock,
}));

vi.mock(
    "../../../../src/features/users/components/UserForm",
    () => ({
        default: ({
            onSubmit,
        }: {
            onSubmit: (
                data: unknown
            ) => Promise<void>;
        }) => (
            <button
                type="button"
                onClick={() =>
                    onSubmit({
                        username: "farmworker",
                        email: "farmworker@msms.com",
                        password: "password123",
                        roleId: 2,
                        fullName: "Farm Worker",
                        contactNumber: "03001234567",
                        department: "Production",
                        jobTitle: "Farm Worker",
                        hireDate: "2026-08-10",
                    })
                }
            >
                Create User
            </button>
        ),
    })
);

describe("CreateUserPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the Add User page", () => {
        renderWithProviders(
            <CreateUserPage />
        );

        expect(
            screen.getByRole("heading", {
                name: "Add User",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create User",
            })
        ).toBeInTheDocument();
    });

    it("creates a user, shows success toast, and navigates", async () => {
        userServiceMock.createUser.mockResolvedValue(
            {
                userId: 2,
            }
        );

        renderWithProviders(
            <CreateUserPage />
        );

        screen
            .getByRole("button", {
                name: "Create User",
            })
            .click();

        await waitFor(() => {
            expect(
                userServiceMock.createUser
            ).toHaveBeenCalledWith({
                username: "farmworker",
                email: "farmworker@msms.com",
                password: "password123",
                roleId: 2,
                fullName: "Farm Worker",
                contactNumber: "03001234567",
                department: "Production",
                jobTitle: "Farm Worker",
                hireDate: "2026-08-10",
            });
        });

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "User created successfully."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/users"
        );
    });

    it("shows an error toast when user creation fails", async () => {
        userServiceMock.createUser.mockRejectedValue(
            new Error("Creation failed")
        );

        renderWithProviders(
            <CreateUserPage />
        );

        screen
            .getByRole("button", {
                name: "Create User",
            })
            .click();

        await waitFor(() => {
            expect(
                userServiceMock.createUser
            ).toHaveBeenCalledWith({
                username: "farmworker",
                email: "farmworker@msms.com",
                password: "password123",
                roleId: 2,
                fullName: "Farm Worker",
                contactNumber: "03001234567",
                department: "Production",
                jobTitle: "Farm Worker",
                hireDate: "2026-08-10",
            });
        });

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });

        expect(
            navigateMock
        ).not.toHaveBeenCalled();
    });
});