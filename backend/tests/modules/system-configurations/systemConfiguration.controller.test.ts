import { beforeEach, describe, expect, it, vi } from "vitest";
import { systemConfigurationController } from "../../../src/modules/system-configurations/systemConfiguration.controller.js";
import { systemConfigurationService } from "../../../src/modules/system-configurations/systemConfiguration.service.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock(
    "../../../src/modules/system-configurations/systemConfiguration.service.js",
    () => ({
        systemConfigurationService: {
            getByConfigKey: vi.fn(),
            list: vi.fn(),
            update: vi.fn(),
        },
    })
);

describe("systemConfigurationController", () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            params: {},
            query: {},
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
    });

    it("gets a configuration by key", async () => {
        req.params.configKey = "delivery_cutoff_time";

        vi.mocked(
            systemConfigurationService.getByConfigKey
        ).mockResolvedValue({ configKey: "delivery_cutoff_time" } as any);

        await systemConfigurationController.getByConfigKey(
            req,
            res,
            next
        );

        expect(
            systemConfigurationService.getByConfigKey
        ).toHaveBeenCalledWith("delivery_cutoff_time");

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("lists system configurations", async () => {
        vi.mocked(systemConfigurationService.list).mockResolvedValue({
            data: [],
            total: 0,
            page: 1,
            limit: 20,
        } as any);

        await systemConfigurationController.list(req, res, next);

        expect(systemConfigurationService.list).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("updates a system configuration", async () => {
        req.params.configKey = "delivery_cutoff_time";
        req.body = {
            configValue: "18:00",
        };

        vi.mocked(systemConfigurationService.update).mockResolvedValue({
            configKey: "delivery_cutoff_time",
        } as any);

        await systemConfigurationController.update(req, res, next);

        expect(systemConfigurationService.update).toHaveBeenCalledWith(
            "delivery_cutoff_time",
            req.body,
            1
        );

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("passes service errors to next()", async () => {
        const error = new AppError(400, "Failed");

        req.params.configKey = "delivery_cutoff_time";

        vi.mocked(
            systemConfigurationService.getByConfigKey
        ).mockRejectedValue(error);

        await systemConfigurationController.getByConfigKey(
            req,
            res,
            next
        );

        expect(next).toHaveBeenCalledWith(error);
    });
});