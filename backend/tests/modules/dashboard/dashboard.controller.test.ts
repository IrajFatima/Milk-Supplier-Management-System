import { beforeEach, describe, expect, it, vi } from "vitest";
import { validationResult } from "express-validator";

import { dashboardController } from "../../../src/modules/dashboard/dashboard.controller.js";
import { dashboardService } from "../../../src/modules/dashboard/dashboard.service.js";

vi.mock("express-validator", () => ({
    validationResult: vi.fn(),
}));

vi.mock("../../../src/modules/dashboard/dashboard.service.js", () => ({
    dashboardService: {
        getOwnerDashboard: vi.fn(),
        getFarmWorkerDashboard: vi.fn(),
        getDeliveryStaffDashboard: vi.fn(),
        getAccountantDashboard: vi.fn(),
        getSystemAdministratorDashboard: vi.fn(),
    },
}));

describe("dashboardController", () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            user: {
                employeeId: 1,
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        next = vi.fn();

        vi.mocked(validationResult).mockReturnValue({
            isEmpty: () => true,
            array: () => [],
        } as any);
    });

    describe("getOwnerDashboard", () => {
        it("returns owner dashboard", async () => {
            const dashboard = {};

            vi.mocked(dashboardService.getOwnerDashboard).mockResolvedValue(
                dashboard as any
            );

            await dashboardController.getOwnerDashboard(req, res, next);

            expect(dashboardService.getOwnerDashboard).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    dashboard,
                },
            });
        });
    });

    describe("getFarmWorkerDashboard", () => {
        it("returns farm worker dashboard", async () => {
            const dashboard = {};

            vi.mocked(
                dashboardService.getFarmWorkerDashboard
            ).mockResolvedValue(dashboard as any);

            await dashboardController.getFarmWorkerDashboard(
                req,
                res,
                next
            );

            expect(
                dashboardService.getFarmWorkerDashboard
            ).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    dashboard,
                },
            });
        });
    });

    describe("getDeliveryStaffDashboard", () => {
        it("returns delivery staff dashboard", async () => {
            const dashboard = {};

            vi.mocked(
                dashboardService.getDeliveryStaffDashboard
            ).mockResolvedValue(dashboard as any);

            await dashboardController.getDeliveryStaffDashboard(
                req,
                res,
                next
            );

            expect(
                dashboardService.getDeliveryStaffDashboard
            ).toHaveBeenCalledWith(1);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    dashboard,
                },
            });
        });

        it("passes unauthorized error to next when employeeId is missing", async () => {
            req.user = {};

            await dashboardController.getDeliveryStaffDashboard(
                req,
                res,
                next
            );

            expect(next).toHaveBeenCalled();
        });
    });

    describe("getAccountantDashboard", () => {
        it("returns accountant dashboard", async () => {
            const dashboard = {};

            vi.mocked(
                dashboardService.getAccountantDashboard
            ).mockResolvedValue(dashboard as any);

            await dashboardController.getAccountantDashboard(
                req,
                res,
                next
            );

            expect(
                dashboardService.getAccountantDashboard
            ).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    dashboard,
                },
            });
        });
    });

    describe("getSystemAdministratorDashboard", () => {
        it("returns system administrator dashboard", async () => {
            const dashboard = {};

            vi.mocked(
                dashboardService.getSystemAdministratorDashboard
            ).mockResolvedValue(dashboard as any);

            await dashboardController.getSystemAdministratorDashboard(
                req,
                res,
                next
            );

            expect(
                dashboardService.getSystemAdministratorDashboard
            ).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    dashboard,
                },
            });
        });
    });

    it("passes service errors to next", async () => {
        const error = new Error("Service failed");

        vi.mocked(
            dashboardService.getOwnerDashboard
        ).mockRejectedValue(error);

        await dashboardController.getOwnerDashboard(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});