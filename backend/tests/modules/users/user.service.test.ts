import { beforeEach, describe, expect, it, vi } from "vitest";

import { userService } from "../../../src/modules/users/user.service.js";
import { userRepository } from "../../../src/modules/users/user.repository.js";
import { hashPassword } from "../../../src/shared/utils/password.js";
import { AppError } from "../../../src/shared/errors/AppError.js";
import { ROLES } from "../../../src/shared/constants/roles.js";

vi.mock("../../../src/modules/users/user.repository.js", () => ({
    userRepository: {
        getRoleById: vi.fn(),
        findByUsername: vi.fn(),
        findByEmail: vi.fn(),
        create: vi.fn(),
        findById: vi.fn(),
        list: vi.fn(),
        update: vi.fn(),
        activate: vi.fn(),
        deactivate: vi.fn(),
        getRoles: vi.fn(),
    },
}));

vi.mock("../../../src/shared/utils/password.js", () => ({
    hashPassword: vi.fn(),
}));

describe("userService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates a user with a hashed password", async () => {
        vi.mocked(userRepository.getRoleById).mockResolvedValue(
            ROLES.ACCOUNTANT as any
        );
        vi.mocked(userRepository.findByUsername).mockResolvedValue(null);
        vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(hashPassword).mockResolvedValue("hashed-password");
        vi.mocked(userRepository.create).mockResolvedValue({
            userId: 1,
        } as any);

        await expect(
            userService.create(
                {
                    role: ROLES.OWNER,
                } as any,
                {
                    username: "john",
                    email: "john@test.com",
                    password: "secret",
                    roleId: 1,
                    fullName: "John Doe",
                    hireDate: "2024-01-01",
                }
            )
        ).resolves.toEqual({
            userId: 1,
        });

        expect(hashPassword).toHaveBeenCalledWith("secret");
    });

    it("rejects users without permission to create accounts", async () => {
        vi.mocked(userRepository.getRoleById).mockResolvedValue(
            ROLES.ACCOUNTANT as any
        );

        await expect(
            userService.create(
                {
                    role: ROLES.ACCOUNTANT,
                } as any,
                {
                    username: "john",
                    email: "john@test.com",
                    password: "secret",
                    roleId: 1,
                    fullName: "John Doe",
                    hireDate: "2024-01-01",
                }
            )
        ).rejects.toBeInstanceOf(AppError);
    });

    it("throws when username already exists", async () => {
        vi.mocked(userRepository.getRoleById).mockResolvedValue(
            ROLES.ACCOUNTANT as any
        );
        vi.mocked(userRepository.findByUsername).mockResolvedValue({} as any);

        await expect(
            userService.create(
                {
                    role: ROLES.OWNER,
                } as any,
                {
                    username: "john",
                    email: "john@test.com",
                    password: "secret",
                    roleId: 1,
                    fullName: "John Doe",
                    hireDate: "2024-01-01",
                }
            )
        ).rejects.toBeInstanceOf(AppError);
    });

    it("activates an inactive user", async () => {
        vi.mocked(userRepository.findById).mockResolvedValue({
            accountStatus: "Inactive",
        } as any);

        await userService.activate(1);

        expect(userRepository.activate).toHaveBeenCalledWith(1);
    });

    it("returns available roles", async () => {
        vi.mocked(userRepository.getRoles).mockResolvedValue([
            {
                roleId: 1,
                roleName: ROLES.ACCOUNTANT,
            },
        ] as any);

        await expect(userService.getRoles()).resolves.toEqual([
            {
                roleId: 1,
                roleName: ROLES.ACCOUNTANT,
            },
        ]);
    });
});