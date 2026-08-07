import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";

vi.mock("../../src/config/env.js", () => ({
    env: { jwtSecret: "secret", jwtExpiresIn: "7d" },
}));

vi.mock("jsonwebtoken", () => ({
    default: {
        sign: vi.fn(),
        verify: vi.fn(),
    },
}));

import { generateToken, verifyToken } from "../../../src/shared/utils/jwt.js";

describe("jwt utils", () => {
    it("signs tokens", () => {
        vi.mocked(jwt.sign).mockReturnValue("token" as never);

        expect(generateToken({ userId: 1, username: "u", role: "Owner", employeeId: null })).toBe("token");
    });

    it("verifies tokens", () => {
        vi.mocked(jwt.verify).mockReturnValue({ userId: 1, username: "u", role: "Owner", employeeId: null } as never);

        expect(verifyToken("token")).toEqual({ userId: 1, username: "u", role: "Owner", employeeId: null });
    });
});
