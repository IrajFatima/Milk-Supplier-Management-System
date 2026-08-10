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

import EditUserPage from "../../../../src/features/users/pages/EditUserPage";

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
        getUser: vi.fn(),
        updateUser: vi.fn(),
    },
}));

vi.mock("react-router-dom", async () => {
    const actual =
        await vi.importActual<
            typeof import("react-router-dom")
        >("react-router-dom");

    return {
        ...actual,
        useNavigate: () => navigateMock,
        useParams: () => ({
            id: "3",
        }),
    };
});

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
    "../../../../src/components/Spinner",
    () => ({
        default: () => (
            <div role="status">
                Loading...
            </div>
        ),
    })
);

vi.mock(
    "../../../../src/features/users/components/UserForm",
    () => ({
        default: ({
            user,
            onSubmit,
        }: {
            user?: {
                userId: number;
            };
            onSubmit: (
                data: unknown
            ) => Promise<void>;
        }) => (
            <div>
                {user && (
                    <div>
                        User {user.userId}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() =>
                        onSubmit({
                            username: "updateduser",
                            email: "updated@example.com",
                            roleId: 2,
                            fullName: "Updated User",
                            contactNumber: "03001234567",
                            department: "Operations",
                            jobTitle: "Manager",
                            hireDate: "2026-01-15",
                        })
                    }
                >
                    Update User
                </button>
            </div>
        ),
    })
);

describe("EditUserPage", () => {
    const user = {
        userId: 3,
        username: "testuser",
        email: "test@example.com",
        roleId: 2,
        roleName: "Farm Worker",
        fullName: "Test User",
        contactNumber: "03001234567",
        department: "Production",
        jobTitle: "Farm Worker",
        hireDate: "2026-01-15T00:00:00.000Z",
        accountStatus: "Active",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading state while user is being loaded", () => {
        userServiceMock.getUser.mockReturnValue(
            new Promise(() => {})
        );

        renderWithProviders(
            <EditUserPage />
        );

        expect(
            screen.getByRole("status")
        ).toBeInTheDocument();
    });

    it("renders the user after loading", async () => {
        userServiceMock.getUser.mockResolvedValue(
            user
        );

        renderWithProviders(
            <EditUserPage />
        );

        expect(
            await screen.findByText("User 3")
        ).toBeInTheDocument();

        expect(
            userServiceMock.getUser
        ).toHaveBeenCalledWith(3);

        expect(
            screen.getByRole("heading", {
                name: "Edit User",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Update User",
            })
        ).toBeInTheDocument();
    });

    it("shows User not found when user does not exist", async () => {
        userServiceMock.getUser.mockResolvedValue(
            null
        );

        renderWithProviders(
            <EditUserPage />
        );

        expect(
            await screen.findByText(
                "User not found."
            )
        ).toBeInTheDocument();
    });

    it("shows an error toast when loading user fails", async () => {
        userServiceMock.getUser.mockRejectedValue(
            new Error("Load failed")
        );

        renderWithProviders(
            <EditUserPage />
        );

        await waitFor(() => {
            expect(
                toastMock.error
            ).toHaveBeenCalled();
        });

        expect(
            screen.getByText("User not found.")
        ).toBeInTheDocument();
    });

    it("updates the user, shows success toast, and navigates", async () => {
        userServiceMock.getUser.mockResolvedValue(
            user
        );

        userServiceMock.updateUser.mockResolvedValue(
            undefined
        );

        renderWithProviders(
            <EditUserPage />
        );

        expect(
            await screen.findByText("User 3")
        ).toBeInTheDocument();

        screen
            .getByRole("button", {
                name: "Update User",
            })
            .click();

        await waitFor(() => {
            expect(
                userServiceMock.updateUser
            ).toHaveBeenCalledWith(3, {
                username: "updateduser",
                email: "updated@example.com",
                roleId: 2,
                fullName: "Updated User",
                contactNumber: "03001234567",
                department: "Operations",
                jobTitle: "Manager",
                hireDate: "2026-01-15",
            });
        });

        expect(
            toastMock.success
        ).toHaveBeenCalledWith(
            "User updated successfully."
        );

        expect(
            navigateMock
        ).toHaveBeenCalledWith(
            "/users/3"
        );
    });

    it("shows an error toast and does not navigate when update fails", async () => {
        userServiceMock.getUser.mockResolvedValue(
            user
        );

        userServiceMock.updateUser.mockRejectedValue(
            new Error("Update failed")
        );

        renderWithProviders(
            <EditUserPage />
        );

        expect(
            await screen.findByText("User 3")
        ).toBeInTheDocument();

        screen
            .getByRole("button", {
                name: "Update User",
            })
            .click();

        await waitFor(() => {
            expect(
                userServiceMock.updateUser
            ).toHaveBeenCalledWith(3, {
                username: "updateduser",
                email: "updated@example.com",
                roleId: 2,
                fullName: "Updated User",
                contactNumber: "03001234567",
                department: "Operations",
                jobTitle: "Manager",
                hireDate: "2026-01-15",
            });
        });

        expect(
            toastMock.error
        ).toHaveBeenCalled();

        expect(
            navigateMock
        ).not.toHaveBeenCalled();
    });
});