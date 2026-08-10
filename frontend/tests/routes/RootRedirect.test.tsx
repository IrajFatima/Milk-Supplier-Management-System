import { describe, it, expect, vi, beforeEach } from "vitest";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { createAuthMock } from "../helpers/render";
import { AuthContext } from "../../src/context/AuthContext";
import RootRedirect from "../../src/routes/RootRedirect";
import type { PublicUser } from "../../src/types/user.types";

function renderRoot(mock: ReturnType<typeof createAuthMock>) {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <AuthContext.Provider
                value={{
                    user: mock.user,
                    token: mock.token,
                    loading: mock.loading,
                    isAuthenticated: mock.isAuthenticated,
                    login: mock.login,
                    logout: mock.logout,
                }}
            >
                <Routes>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route path="/owner/dashboard" element={<div>Owner Dashboard</div>} />
                    <Route path="/farm/dashboard" element={<div>Farm Dashboard</div>} />
                </Routes>
            </AuthContext.Provider>
        </MemoryRouter>
    );
}

function userWithRole(role: PublicUser["role"]): PublicUser {
    return {
        userId: 1,
        username: "user",
        email: "user@msms.com",
        role,
        employeeId: 1,
        accountStatus: "Active",
        lastLogin: null,
    };
}

describe("RootRedirect", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows a spinner while loading", () => {
        renderRoot(createAuthMock({ loading: true }));
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("redirects to /login when not authenticated", () => {
        renderRoot(createAuthMock({ user: null, token: null }));
        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("redirects an owner to the owner dashboard", () => {
        renderRoot(createAuthMock({ user: userWithRole("Owner") }));
        expect(screen.getByText("Owner Dashboard")).toBeInTheDocument();
    });

    it("redirects a farm worker to the farm dashboard", () => {
        renderRoot(createAuthMock({ user: userWithRole("Farm Worker") }));
        expect(screen.getByText("Farm Dashboard")).toBeInTheDocument();
    });
});
