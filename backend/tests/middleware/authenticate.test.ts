import { describe, expect, it, vi, beforeEach } from "vitest";
import { requireAuth } from "../../src/middleware/authenticate.js";
import { AppError } from "../../src/shared/errors/AppError.js";
import { verifyToken } from "../../src/shared/utils/jwt.js";

vi.mock("../../src/shared/utils/jwt.js", () => ({
    verifyToken: vi.fn(),
}));

describe("requireAuth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("attaches the decoded user", () => {
        const req: any = { headers: { authorization: "Bearer token" } };
        const next = vi.fn();
        vi.mocked(verifyToken).mockReturnValue({ userId: 1, username: "owner", role: "Owner", employeeId: 2 });

        requireAuth(req, {} as any, next);

        expect(req.user).toEqual({ userId: 1, username: "owner", role: "Owner", employeeId: 2 });
        expect(next).toHaveBeenCalledWith();
    });

    it("rejects missing bearer token", () => {
        const req: any = { headers: {} };
        const next = vi.fn();

        requireAuth(req, {} as any, next);

        expect(next).toHaveBeenCalledWith(expect.any(AppError));
        expect((next.mock.calls[0][0] as AppError).statusCode).toBe(401);
    });
});
