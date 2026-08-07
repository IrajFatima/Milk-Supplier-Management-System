import { beforeEach, describe, expect, it, vi } from "vitest";

import { dashboardService } from "../../../src/modules/dashboard/dashboard.service.js";
import { dashboardRepository } from "../../../src/modules/dashboard/dashboard.repository.js";

vi.mock("../../../src/modules/dashboard/dashboard.repository.js", () => ({
    dashboardRepository: {
        getOwnerSummary: vi.fn(),
        getRecentProduction: vi.fn(),
        getTodaysDeliveries: vi.fn(),
        getRecentCustomers: vi.fn(),

        getFarmWorkerSummary: vi.fn(),
        getLatestTemperature: vi.fn(),

        getDeliveryStaffSummary: vi.fn(),
        getTodaysAssignedDeliveries: vi.fn(),

        getAccountantSummary: vi.fn(),

        getSystemAdministratorSummary: vi.fn(),
        getRecentUsers: vi.fn(),
    },
}));

describe("dashboardService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("builds owner dashboard", async () => {
        vi.mocked(dashboardRepository.getOwnerSummary).mockResolvedValue({} as any);
        vi.mocked(dashboardRepository.getRecentProduction).mockResolvedValue([] as any);
        vi.mocked(dashboardRepository.getTodaysDeliveries).mockResolvedValue([] as any);
        vi.mocked(dashboardRepository.getRecentCustomers).mockResolvedValue([] as any);

        await expect(dashboardService.getOwnerDashboard()).resolves.toEqual({
            summary: {},
            recentProduction: [],
            todaysDeliveries: [],
            recentCustomers: [],
        });
    });

    it("builds farm worker dashboard", async () => {
        vi.mocked(dashboardRepository.getFarmWorkerSummary).mockResolvedValue({} as any);
        vi.mocked(dashboardRepository.getLatestTemperature).mockResolvedValue({} as any);
        vi.mocked(dashboardRepository.getRecentProduction).mockResolvedValue([] as any);

        await expect(dashboardService.getFarmWorkerDashboard()).resolves.toEqual({
            summary: {},
            latestTemperature: {},
            recentProduction: [],
        });
    });

    it("builds delivery staff dashboard", async () => {
        vi.mocked(dashboardRepository.getDeliveryStaffSummary).mockResolvedValue({} as any);
        vi.mocked(dashboardRepository.getTodaysAssignedDeliveries).mockResolvedValue([] as any);

        await expect(dashboardService.getDeliveryStaffDashboard(1)).resolves.toEqual({
            summary: {},
            todaysDeliveries: [],
        });

        expect(dashboardRepository.getDeliveryStaffSummary).toHaveBeenCalledWith(1);
        expect(dashboardRepository.getTodaysAssignedDeliveries).toHaveBeenCalledWith(1);
    });

    it("builds accountant dashboard", async () => {
        vi.mocked(dashboardRepository.getAccountantSummary).mockResolvedValue({} as any);
        vi.mocked(dashboardRepository.getRecentCustomers).mockResolvedValue([] as any);
        vi.mocked(dashboardRepository.getRecentProduction).mockResolvedValue([] as any);

        await expect(dashboardService.getAccountantDashboard()).resolves.toEqual({
            summary: {},
            recentCustomers: [],
            recentProduction: [],
        });
    });

    it("builds system administrator dashboard", async () => {
        vi.mocked(dashboardRepository.getSystemAdministratorSummary).mockResolvedValue({} as any);
        vi.mocked(dashboardRepository.getRecentUsers).mockResolvedValue([] as any);

        await expect(
            dashboardService.getSystemAdministratorDashboard()
        ).resolves.toEqual({
            summary: {},
            recentUsers: [],
        });
    });
});