import { beforeEach, describe, expect, it, vi } from "vitest";
import { validationResult } from "express-validator";

import { authController } from "../../../src/modules/auth/auth.controller.js";
import { authService } from "../../../src/modules/auth/auth.service.js";

vi.mock("express-validator", () => ({
    validationResult: vi.fn(),
}));

vi.mock("../../../src/modules/auth/auth.service.js", () => ({
    authService: {
        login: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn(),
        changePassword: vi.fn(),
    },
}));

describe("authController", () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            body: {},
            user: {
                userId: 1,
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        next = vi.fn();

        vi.mocked(validationResult).mockReturnValue({
            isEmpty: () => true,
            array: () => [],
        } as any);
    });

    describe("login", () => {
        it("returns login response", async () => {
            const loginResult = {
                token: "token",
                user: {
                    userId: 1,
                },
            };

            req.body = {
                usernameOrEmail: "owner",
                password: "secret",
            };

            vi.mocked(authService.login).mockResolvedValue(
                loginResult as any
            );

            await authController.login(req, res, next);

            expect(authService.login).toHaveBeenCalledWith(req.body);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Login successful.",
                data: loginResult,
            });
        });

        it("passes service errors to next", async () => {
            const error = new Error("Login failed");

            vi.mocked(authService.login).mockRejectedValue(error);

            await authController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("logout", () => {
        it("returns successful logout response", async () => {
            await authController.logout(req, res, next);

            expect(authService.logout).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Logged out successfully.",
            });
        });
    });

    describe("getCurrentUser", () => {
        it("returns current user", async () => {
            const user = {
                userId: 1,
                username: "owner",
            };

            vi.mocked(authService.getCurrentUser).mockResolvedValue(
                user as any
            );

            await authController.getCurrentUser(req, res, next);

            expect(authService.getCurrentUser).toHaveBeenCalledWith(1);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    user,
                },
            });
        });

        it("passes unauthorized error to next when user is missing", async () => {
            req.user = undefined;

            await authController.getCurrentUser(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe("changePassword", () => {
        it("changes password successfully", async () => {
            req.body = {
                currentPassword: "old-password",
                newPassword: "new-password",
                confirmPassword: "new-password",
            };

            await authController.changePassword(req, res, next);

            expect(authService.changePassword).toHaveBeenCalledWith(
                1,
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Password changed successfully.",
            });
        });

        it("passes unauthorized error to next when user is missing", async () => {
            req.user = undefined;

            await authController.changePassword(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it("passes service errors to next", async () => {
            const error = new Error("Password change failed");

            vi.mocked(authService.changePassword).mockRejectedValue(error);

            await authController.changePassword(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});