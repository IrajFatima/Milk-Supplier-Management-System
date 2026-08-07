import { beforeEach, describe, expect, it, vi } from "vitest";
import { temperatureSimulatorJob } from "../../../src/modules/temperature-logs/temperature-simulator.job.js";
import { temperatureLogsService } from "../../../src/modules/temperature-logs/temperature-logs.service.js";
import { productionRepository } from "../../../src/modules/production/production.repository.js";

vi.mock(
    "../../../src/modules/temperature-logs/temperature-logs.service.js",
    () => ({
        temperatureLogsService: {
            createAutomated: vi.fn(),
        },
    })
);

vi.mock(
    "../../../src/modules/production/production.repository.js",
    () => ({
        productionRepository: {
            getStorageFacilities: vi.fn(),
        },
    })
);

describe("temperatureSimulatorJob", () => {
    beforeEach(() => {
        temperatureSimulatorJob.stop();

        vi.clearAllMocks();

        vi.spyOn(console, "log").mockImplementation(() => { });
        vi.spyOn(console, "error").mockImplementation(() => { });

        vi.spyOn(globalThis, "setInterval").mockImplementation(
            (() => {
                return 1 as any;
            }) as any
        );

        vi.spyOn(globalThis, "clearInterval").mockImplementation(
            () => undefined as any
        );
    });

    it("starts and stops when no facilities exist", () => {
        vi.mocked(
            productionRepository.getStorageFacilities
        ).mockResolvedValue([]);

        temperatureSimulatorJob.start();
        temperatureSimulatorJob.stop();

        expect(
            productionRepository.getStorageFacilities
        ).toHaveBeenCalled();
    });

    it("creates automated logs for every facility", async () => {
        vi.mocked(
            productionRepository.getStorageFacilities
        ).mockResolvedValue([
            {
                facilityId: 1,
                facilityName: "Tank A",
            },
            {
                facilityId: 2,
                facilityName: "Tank B",
            },
        ] as any);

        vi.mocked(
            temperatureLogsService.createAutomated
        ).mockResolvedValue({
            logId: 1,
        } as any);

        temperatureSimulatorJob.start();

        await Promise.resolve();
        await Promise.resolve();

        expect(
            temperatureLogsService.createAutomated
        ).toHaveBeenCalledTimes(2);
    });

    it("continues processing when one facility fails", async () => {
        vi.mocked(
            productionRepository.getStorageFacilities
        ).mockResolvedValue([
            {
                facilityId: 1,
                facilityName: "Tank A",
            },
            {
                facilityId: 2,
                facilityName: "Tank B",
            },
        ] as any);

        vi.mocked(
            temperatureLogsService.createAutomated
        )
            .mockRejectedValueOnce(new Error("Failed"))
            .mockResolvedValueOnce({ logId: 2 } as any);

        temperatureSimulatorJob.start();

        await Promise.resolve();
        await Promise.resolve();

        expect(
            temperatureLogsService.createAutomated
        ).toHaveBeenCalledTimes(2);
    });
});