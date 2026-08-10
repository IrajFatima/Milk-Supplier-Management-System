import { describe, it, expect, vi, beforeEach } from "vitest";
import authService from "../../src/services/auth.service";

const apiMock = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
}));

vi.mock("../../src/services/api", () => ({
    default: apiMock,
}));

const user = {
    userId: 1,
    username: "owner",
    email: "owner@msms.com",
    role: "Owner",
    employeeId: 1,
    accountStatus: "Active",
    lastLogin: null,
};

describe("authService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("logs in with credentials and returns token + user", async () => {
        apiMock.post.mockResolvedValue({
            data: {
                success: true,
                message: "ok",
                data: { token: "jwt", user },
            },
        });

        const result = await authService.login({
            usernameOrEmail: "owner",
            password: "secret",
        });

        expect(apiMock.post).toHaveBeenCalledWith("/auth/login", {
            usernameOrEmail: "owner",
            password: "secret",
        });
        expect(result).toEqual({ token: "jwt", user });
    });

    it("fetches the current user", async () => {
        apiMock.get.mockResolvedValue({
            data: { success: true, message: "ok", data: { user } },
        });

        const result = await authService.getCurrentUser();

        expect(apiMock.get).toHaveBeenCalledWith("/auth/me");
        expect(result).toEqual({ user });
    });

    it("logs out", async () => {
        apiMock.post.mockResolvedValue({
            data: { success: true, message: "Logged out" },
        });

        const result = await authService.logout();

        expect(apiMock.post).toHaveBeenCalledWith("/auth/logout");
        expect(result).toEqual({ success: true, message: "Logged out" });
    });

    it("changes the password", async () => {
        const payload = {
            currentPassword: "old",
            newPassword: "new",
            confirmPassword: "new",
        };
        apiMock.patch.mockResolvedValue({
            data: { success: true, message: "changed" },
        });

        const result = await authService.changePassword(payload);

        expect(apiMock.patch).toHaveBeenCalledWith(
            "/auth/change-password",
            payload
        );
        expect(result).toEqual({ success: true, message: "changed" });
    });
});
