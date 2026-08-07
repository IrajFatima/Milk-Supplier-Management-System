import { beforeEach, describe, expect, it, vi } from "vitest";

import { userController } from "../../../src/modules/users/user.controller.js";
import { userService } from "../../../src/modules/users/user.service.js";

vi.mock("../../../src/modules/users/user.service.js", () => ({
    userService: {
        create: vi.fn(),
        getById: vi.fn(),
        list: vi.fn(),
        update: vi.fn(),
        activate: vi.fn(),
        deactivate: vi.fn(),
        getRoles: vi.fn(),
    },
}));

describe("userController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates a user and returns 201", async () => {
        const req: any = {
            body: {},
            user: { role: "Owner" },
        };

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const next = vi.fn();

        vi.mocked(userService.create).mockResolvedValue({
            userId: 1,
        } as any);

        await userController.create(req, res, next);

        expect(userService.create).toHaveBeenCalledWith(
            req.user,
            req.body
        );

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "User created successfully.",
            data: {
                user: { userId: 1 },
            },
        });

        expect(next).not.toHaveBeenCalled();
    });
});