import { beforeEach, describe, expect, it, vi } from "vitest";

import { authService } from "../../../src/modules/auth/auth.service.js";
import { authRepository } from "../../../src/modules/auth/auth.repository.js";
import {
    comparePassword,
    hashPassword,
} from "../../../src/shared/utils/password.js";
import { generateToken } from "../../../src/shared/utils/jwt.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock("../../../src/modules/auth/auth.repository.js", () => ({
    authRepository: {
        findByUsernameOrEmail: vi.fn(),
        updateLastLogin: vi.fn(),
        findById: vi.fn(),
        updatePassword: vi.fn(),
    },
}));

vi.mock("../../../src/shared/utils/password.js", () => ({
    comparePassword: vi.fn(),
    hashPassword: vi.fn(),
}));

vi.mock("../../../src/shared/utils/jwt.js", () => ({
    generateToken: vi.fn(),
}));

describe("authService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const user = {
        userId: 1,
        username: "owner",
        email: "owner@example.com",
        passwordHash: "hashed-password",
        accountStatus: "Active",
        employeeId: 2,
        customerId: null,
        roleId: 1,
        roleName: "Owner",
        lastLogin: null,
    };

    describe("login", () => {
        it("logs in an active user", async () => {
            vi.mocked(authRepository.findByUsernameOrEmail).mockResolvedValue(
                user as any
            );
            vi.mocked(comparePassword).mockResolvedValue(true);
            vi.mocked(generateToken).mockReturnValue("jwt-token");

            await expect(
                authService.login({
                    usernameOrEmail: "owner",
                    password: "secret",
                })
            ).resolves.toEqual({
                token: "jwt-token",
                user: {
                    userId: 1,
                    username: "owner",
                    email: "owner@example.com",
                    role: "Owner",
                    employeeId: 2,
                    accountStatus: "Active",
                    lastLogin: null,
                },
            });

            expect(authRepository.updateLastLogin).toHaveBeenCalledWith(1);
        });

        it("throws when user does not exist", async () => {
            vi.mocked(authRepository.findByUsernameOrEmail).mockResolvedValue(
                null
            );

            await expect(
                authService.login({
                    usernameOrEmail: "owner",
                    password: "secret",
                })
            ).rejects.toThrow(AppError);
        });

        it("throws when account is inactive", async () => {
            vi.mocked(authRepository.findByUsernameOrEmail).mockResolvedValue({
                ...user,
                accountStatus: "Inactive",
            } as any);

            await expect(
                authService.login({
                    usernameOrEmail: "owner",
                    password: "secret",
                })
            ).rejects.toThrow(
                "Your account is deactivated. Please contact your administrator."
            );
        });

        it("throws when password is incorrect", async () => {
            vi.mocked(authRepository.findByUsernameOrEmail).mockResolvedValue(
                user as any
            );
            vi.mocked(comparePassword).mockResolvedValue(false);

            await expect(
                authService.login({
                    usernameOrEmail: "owner",
                    password: "wrong-password",
                })
            ).rejects.toThrow(
                "Invalid username or password. Please try again."
            );
        });
    });

    describe("getCurrentUser", () => {
        it("returns the current user", async () => {
            vi.mocked(authRepository.findById).mockResolvedValue(user as any);

            await expect(authService.getCurrentUser(1)).resolves.toEqual({
                userId: 1,
                username: "owner",
                email: "owner@example.com",
                role: "Owner",
                employeeId: 2,
                accountStatus: "Active",
                lastLogin: null,
            });
        });

        it("throws when user is not found", async () => {
            vi.mocked(authRepository.findById).mockResolvedValue(null);

            await expect(authService.getCurrentUser(1)).rejects.toThrow(
                "User not found."
            );
        });
    });

    describe("logout", () => {
        it("completes without throwing", async () => {
            await expect(authService.logout()).resolves.toBeUndefined();
        });
    });

    describe("changePassword", () => {
        it("changes the password", async () => {
            vi.mocked(authRepository.findById).mockResolvedValue(user as any);

            vi.mocked(comparePassword)
                .mockResolvedValueOnce(true)
                .mockResolvedValueOnce(false);

            vi.mocked(hashPassword).mockResolvedValue("new-hash");

            await authService.changePassword(1, {
                currentPassword: "old-password",
                newPassword: "new-password",
                confirmPassword: "new-password",
            });

            expect(hashPassword).toHaveBeenCalledWith("new-password");
            expect(authRepository.updatePassword).toHaveBeenCalledWith(
                1,
                "new-hash"
            );
        });

        it("throws when user does not exist", async () => {
            vi.mocked(authRepository.findById).mockResolvedValue(null);

            await expect(
                authService.changePassword(1, {
                    currentPassword: "old-password",
                    newPassword: "new-password",
                    confirmPassword: "new-password",
                })
            ).rejects.toThrow("User not found.");
        });

        it("throws when current password is incorrect", async () => {
            vi.mocked(authRepository.findById).mockResolvedValue(user as any);
            vi.mocked(comparePassword).mockResolvedValue(false);

            await expect(
                authService.changePassword(1, {
                    currentPassword: "wrong-password",
                    newPassword: "new-password",
                    confirmPassword: "new-password",
                })
            ).rejects.toThrow("Current password is incorrect.");
        });

        it("throws when new password matches current password", async () => {
            vi.mocked(authRepository.findById).mockResolvedValue(user as any);

            vi.mocked(comparePassword)
                .mockResolvedValueOnce(true)
                .mockResolvedValueOnce(true);

            await expect(
                authService.changePassword(1, {
                    currentPassword: "old-password",
                    newPassword: "old-password",
                    confirmPassword: "old-password",
                })
            ).rejects.toThrow(
                "New password cannot be the same as the current password."
            );
        });
    });
});