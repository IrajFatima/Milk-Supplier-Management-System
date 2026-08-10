import { describe, it, expect, vi, beforeEach } from "vitest";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { createAuthMock } from "../helpers/render";
import { AuthContext } from "../../src/context/AuthContext";
import RoleProtectedRoute from "../../src/routes/RoleProtectedRoute";
import { ROLES, type Role } from "../../src/constants/roles";

function renderRoleProtected(mock: ReturnType<typeof createAuthMock>, allowedRoles: Role[]) {
    render(
        <MemoryRouter initialEntries={["/admin"]}>
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
                    <Route element={<RoleProtectedRoute allowedRoles={allowedRoles} />}>
                        <Route path="/admin" element={<div>Admin Content</div>} />
                    </Route>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route path="/access-denied" element={<div>Access Denied</div>} />
                </Routes>
            </AuthContext.Provider>
        </MemoryRouter>
    );
}

describe("RoleProtectedRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the outlet when the user role is allowed", () => {
        renderRoleProtected(createAuthMock(), [ROLES.OWNER]);
        expect(screen.getByText("Admin Content")).toBeInTheDocument();
    });

    it("shows a spinner while loading", () => {
        renderRoleProtected(createAuthMock({ loading: true }), [ROLES.OWNER]);
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("redirects to /login when there is no user", () => {
        renderRoleProtected(createAuthMock({ user: null, token: null }), [ROLES.OWNER]);
        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("redirects to /access-denied when the role is not allowed", () => {
        renderRoleProtected(createAuthMock(), [ROLES.FARM_WORKER]);
        expect(screen.getByText("Access Denied")).toBeInTheDocument();
    });
});
