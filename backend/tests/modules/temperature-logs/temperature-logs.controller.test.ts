import { describe, expect, it, vi } from "vitest";
import { temperatureLogsController } from "../../../src/modules/temperature-logs/temperature-logs.controller.js";
import { temperatureLogsService } from "../../../src/modules/temperature-logs/temperature-logs.service.js";

vi.mock("../../../src/modules/temperature-logs/temperature-logs.service.js", () => ({ temperatureLogsService: { create: vi.fn(), getById: vi.fn(), list: vi.fn() } }));

describe("temperatureLogsController", () => {
    it("returns created log", async () => {
        const req: any = { body: {}, user: { userId: 1 } };
        const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        vi.mocked(temperatureLogsService.create).mockResolvedValue({ logId: 1 } as any);

        await temperatureLogsController.create(req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(201);
    });
});
