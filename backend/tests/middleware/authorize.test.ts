import { describe, expect, it, vi } from "vitest";
import { requireRole } from "../../src/middleware/authorize.js";
import { AppError } from "../../src/shared/errors/AppError.js";
describe("requireRole", () => {
    it("rejects unauthenticated requests", () => {
        const next = vi.fn();

        requireRole(["Owner"] as any)({} as any, {} as any, next);

        expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it("rejects disallowed roles", () => {
        const next = vi.fn();

        requireRole(["Owner"] as any)({ user: { role: "Accountant" } } as any, {} as any, next);

        expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
    });
});
