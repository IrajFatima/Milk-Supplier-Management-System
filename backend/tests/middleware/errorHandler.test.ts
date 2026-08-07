import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import { errorHandler } from "../../src/middleware/errorHandler.js";
import { AppError } from "../../src/shared/errors/AppError.js";

describe("errorHandler", () => {
    it("formats app errors", () => {
        const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        errorHandler(new AppError(418, "teapot"), {} as any, res, {} as any);

        expect(res.status).toHaveBeenCalledWith(418);
        expect(res.json).toHaveBeenCalledWith({ status: "error", message: "teapot", errors: [] });
    });

    it("formats jwt errors", () => {
        const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };

        errorHandler(new jwt.JsonWebTokenError("bad"), {} as any, res, {} as any);

        expect(res.status).toHaveBeenCalledWith(401);
    });
});
