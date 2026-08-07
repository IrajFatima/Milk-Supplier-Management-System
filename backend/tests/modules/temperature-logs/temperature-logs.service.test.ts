import { beforeEach, describe, expect, it, vi } from "vitest";
import { temperatureLogsService } from "../../../src/modules/temperature-logs/temperature-logs.service.js";
import { temperatureLogsRepository } from "../../../src/modules/temperature-logs/temperature-logs.repository.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock(
    "../../../src/modules/temperature-logs/temperature-logs.repository.js",
    () => ({
        temperatureLogsRepository: {
            findStorageFacility: vi.fn(),
            create: vi.fn(),
            findById: vi.fn(),
            findAll: vi.fn(),
        },
    })
);

describe("temperatureLogsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates a manual temperature log", async () => {
        vi.mocked(
            temperatureLogsRepository.findStorageFacility
        ).mockResolvedValue({
            operationalStatus: "Active",
        } as any);

        vi.mocked(temperatureLogsRepository.create).mockResolvedValue({
            logId: 1,
        } as any);

        await expect(
            temperatureLogsService.create(
                {
                    storageFacilityId: 1,
                    recordingDateTime: "2024-01-01T00:00:00Z",
                    temperatureReading: 4,
                    remarks: null,
                },
                2
            )
        ).resolves.toEqual({
            logId: 1,
        });
    });

    it("creates an automated temperature log", async () => {
        vi.mocked(
            temperatureLogsRepository.findStorageFacility
        ).mockResolvedValue({
            operationalStatus: "Active",
        } as any);

        vi.mocked(temperatureLogsRepository.create).mockResolvedValue({
            logId: 2,
        } as any);

        await expect(
            temperatureLogsService.createAutomated({
                storageFacilityId: 1,
                recordingDateTime: "2024-01-01T00:00:00Z",
                temperatureReading: 4,
                recordingType: "Manual",
                operator: null,
                alertTriggered: false,
                remarks: null,
            })
        ).resolves.toEqual({
            logId: 2,
        });

        expect(
            temperatureLogsRepository.create
        ).toHaveBeenCalledWith(
            expect.objectContaining({
                recordingType: "Automated Sensor",
            })
        );
    });

    it("rejects inactive storage facilities", async () => {
        vi.mocked(
            temperatureLogsRepository.findStorageFacility
        ).mockResolvedValue({
            operationalStatus: "Inactive",
        } as any);

        await expect(
            temperatureLogsService.create(
                {
                    storageFacilityId: 1,
                    recordingDateTime: "2024-01-01T00:00:00Z",
                    temperatureReading: 4,
                } as any,
                2
            )
        ).rejects.toBeInstanceOf(AppError);
    });

    it("rejects invalid temperature readings", async () => {
        vi.mocked(
            temperatureLogsRepository.findStorageFacility
        ).mockResolvedValue({
            operationalStatus: "Active",
        } as any);

        await expect(
            temperatureLogsService.create(
                {
                    storageFacilityId: 1,
                    recordingDateTime: "2024-01-01T00:00:00Z",
                    temperatureReading: 10,
                } as any,
                2
            )
        ).rejects.toBeInstanceOf(AppError);
    });

    it("gets a temperature log by id", async () => {
        vi.mocked(temperatureLogsRepository.findById).mockResolvedValue({
            logId: 1,
        } as any);

        await expect(
            temperatureLogsService.getById(1)
        ).resolves.toEqual({
            logId: 1,
        });
    });

    it("throws when log does not exist", async () => {
        vi.mocked(temperatureLogsRepository.findById).mockResolvedValue(
            null
        );

        await expect(
            temperatureLogsService.getById(1)
        ).rejects.toBeInstanceOf(AppError);
    });

    it("lists temperature logs", async () => {
        vi.mocked(temperatureLogsRepository.findAll).mockResolvedValue({
            data: [],
            total: 0,
            page: 1,
            limit: 20,
        } as any);

        await expect(
            temperatureLogsService.list({} as any)
        ).resolves.toEqual({
            data: [],
            total: 0,
            page: 1,
            limit: 20,
        });
    });
});