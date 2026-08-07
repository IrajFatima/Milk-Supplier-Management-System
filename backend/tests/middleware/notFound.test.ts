import { describe, expect, it, vi } from "vitest";
import { notFound } from "../../src/middleware/notFound.js";

describe("notFound", () => {
    it("returns 404 payload", () => {
        const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        notFound({} as any, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Route not found.", errors: [] });
    });
});
