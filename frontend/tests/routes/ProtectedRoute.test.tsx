import { describe, it, expect, vi, beforeEach } from "vitest";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { createAuthMock } from "../helpers/render";
import { AuthContext } from "../../src/context/AuthContext";
import ProtectedRoute from "../../src/routes/ProtectedRoute";

function renderProtected(mock: ReturnType<typeof createAuthMock>) {
    render(
        <MemoryRouter initialEntries={["/dashboard"]}>
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
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<div>Protected Content</div>} />
                    </Route>
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </AuthContext.Provider>
        </MemoryRouter>
    );
}

describe("ProtectedRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the outlet when authenticated", () => {
        renderProtected(createAuthMock());
        expect(screen.getByText("Protected Content")).toBeTruthy();
    });

    it("shows a spinner while loading", () => {
        renderProtected(createAuthMock({ loading: true }));
        expect(screen.getByRole("status")).toBeTruthy();
    });

    it("redirects to /login when not authenticated", () => {
        renderProtected(createAuthMock({ user: null, token: null }));
        expect(screen.getByText("Login Page")).toBeTruthy();
    });
});
