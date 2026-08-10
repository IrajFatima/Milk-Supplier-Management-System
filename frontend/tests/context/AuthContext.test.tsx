import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, AuthContext } from "../../src/context/AuthContext";
import type { PublicUser } from "../../src/types/user.types";
import { useContext } from "react";

const { authServiceMock } = vi.hoisted(() => {
    const getCurrentUser = vi.fn();
    const logout = vi.fn();
    return {
        authServiceMock: {
            login: vi.fn(),
            getCurrentUser,
            logout,
            changePassword: vi.fn(),
        },
    };
});

vi.mock("../../src/services/auth.service", () => ({
    default: authServiceMock,
}));

const user: PublicUser = {
    userId: 1,
    username: "owner",
    email: "owner@msms.com",
    role: "Owner",
    employeeId: 1,
    accountStatus: "Active",
    lastLogin: null,
};

function Probe() {
    const ctx = useContext(AuthContext);
    return (
        <div>
            <span data-testid="loading">{String(ctx?.loading)}</span>
            <span data-testid="user">{ctx?.user?.username ?? "none"}</span>
            <span data-testid="token">{ctx?.token ?? "none"}</span>
            <button type="button" onClick={() => ctx?.login("jwt", user)}>
                login
            </button>
            <button type="button" onClick={() => ctx?.logout()}>
                logout
            </button>
        </div>
    );
}

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("restores a session when a token exists", async () => {
        localStorage.setItem("token", "existing-token");
        authServiceMock.getCurrentUser.mockResolvedValue({ user });

        render(
            <AuthProvider>
                <Probe />
            </AuthProvider>
        );

        await waitFor(() =>
            expect(screen.getByTestId("user")).toHaveTextContent("owner")
        );
        expect(screen.getByTestId("token")).toHaveTextContent("existing-token");
        expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    it("falls back to unauthenticated when token restore fails", async () => {
        localStorage.setItem("token", "bad-token");
        authServiceMock.getCurrentUser.mockRejectedValue(
            new Error("Unauthorized")
        );

        render(
            <AuthProvider>
                <Probe />
            </AuthProvider>
        );

        await waitFor(() =>
            expect(screen.getByTestId("loading")).toHaveTextContent("false")
        );
        expect(screen.getByTestId("user")).toHaveTextContent("none");
        expect(screen.getByTestId("token")).toHaveTextContent("none");
        expect(localStorage.getItem("token")).toBeNull();
    });

    it("logs in and stores the token", async () => {
        authServiceMock.getCurrentUser.mockResolvedValue({ user });
        const userEventSession = userEvent.setup();
        render(
            <AuthProvider>
                <Probe />
            </AuthProvider>
        );

        await waitFor(() =>
            expect(screen.getByTestId("loading")).toHaveTextContent("false")
        );

        await userEventSession.click(screen.getByText("login"));

        await waitFor(() =>
            expect(screen.getByTestId("user")).toHaveTextContent("owner")
        );
        expect(screen.getByTestId("token")).toHaveTextContent("jwt");
        expect(localStorage.getItem("token")).toBe("jwt");
    });

    it("logs out and clears the session", async () => {
        localStorage.setItem("token", "jwt");
        authServiceMock.getCurrentUser.mockResolvedValue({ user });
        authServiceMock.logout.mockResolvedValue({ success: true, message: "ok" });

        const userEventSession = userEvent.setup();

        render(
            <AuthProvider>
                <Probe />
            </AuthProvider>
        );

        await waitFor(() =>
            expect(screen.getByTestId("user")).toHaveTextContent("owner")
        );

        await userEventSession.click(screen.getByText("logout"));

        await waitFor(() =>
            expect(screen.getByTestId("user")).toHaveTextContent("none")
        );
        expect(screen.getByTestId("token")).toHaveTextContent("none");
        expect(localStorage.getItem("token")).toBeNull();
    });
});

