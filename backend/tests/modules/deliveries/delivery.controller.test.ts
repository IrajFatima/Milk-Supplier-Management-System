import { beforeEach, describe, expect, it, vi } from "vitest";
import { validationResult } from "express-validator";

import { deliveryController } from "../../../src/modules/deliveries/delivery.controller.js";
import { deliveryService } from "../../../src/modules/deliveries/delivery.service.js";

vi.mock("express-validator", () => ({
    validationResult: vi.fn(),
}));

vi.mock("../../../src/modules/deliveries/delivery.service.js", () => ({
    deliveryService: {
        getById: vi.fn(),
        list: vi.fn(),
        assign: vi.fn(),
        getDeliveryStaff: vi.fn(),
        getAssignedDeliveryById: vi.fn(),
        getAssignedDeliveries: vi.fn(),
        updateStatus: vi.fn(),
    },
}));

describe("deliveryController", () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            params: { id: "1" },
            query: {},
            body: {},
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

    describe("getById", () => {
        it("returns a delivery", async () => {
            const delivery = { deliveryId: 1 };

            vi.mocked(deliveryService.getById).mockResolvedValue(
                delivery as any
            );

            await deliveryController.getById(req, res, next);

            expect(deliveryService.getById).toHaveBeenCalledWith(1);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { delivery },
            });
        });
    });

    describe("list", () => {
        it("returns deliveries", async () => {
            const deliveries = {
                data: [],
                total: 0,
            };

            vi.mocked(deliveryService.list).mockResolvedValue(
                deliveries as any
            );

            await deliveryController.list(req, res, next);

            expect(deliveryService.list).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deliveries,
            });
        });
    });

    describe("assign", () => {
        it("assigns a delivery", async () => {
            const delivery = { deliveryId: 1 };

            req.body = {
                deliveryStaffId: 2,
            };

            vi.mocked(deliveryService.assign).mockResolvedValue(
                delivery as any
            );

            await deliveryController.assign(req, res, next);

            expect(deliveryService.assign).toHaveBeenCalledWith(
                1,
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Delivery assigned successfully.",
                data: { delivery },
            });
        });
    });

    describe("getDeliveryStaff", () => {
        it("returns delivery staff", async () => {
            const deliveryStaff: { employeeId: number; fullName: string }[] = [];

            vi.mocked(
                deliveryService.getDeliveryStaff
            ).mockResolvedValue(deliveryStaff);

            await deliveryController.getDeliveryStaff(
                req,
                res,
                next
            );

            expect(
                deliveryService.getDeliveryStaff
            ).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { deliveryStaff },
            });
        });
    });

    describe("getMyDeliveryById", () => {
        it("returns assigned delivery", async () => {
            const delivery = { deliveryId: 1 };

            vi.mocked(
                deliveryService.getAssignedDeliveryById
            ).mockResolvedValue(delivery as any);

            await deliveryController.getMyDeliveryById(
                req,
                res,
                next
            );

            expect(
                deliveryService.getAssignedDeliveryById
            ).toHaveBeenCalledWith(1, 1);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { delivery },
            });
        });
    });

    describe("getMyDeliveries", () => {
        it("returns assigned deliveries", async () => {
            const deliveries = {
                data: [],
                total: 0,
            };

            vi.mocked(
                deliveryService.getAssignedDeliveries
            ).mockResolvedValue(deliveries as any);

            await deliveryController.getMyDeliveries(
                req,
                res,
                next
            );

            expect(
                deliveryService.getAssignedDeliveries
            ).toHaveBeenCalledWith(1, expect.any(Object));

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deliveries,
            });
        });
    });

    describe("updateStatus", () => {
        it("updates delivery status", async () => {
            const delivery = { deliveryId: 1 };

            req.body = {
                deliveryStatus: "Successfully Delivered",
            };

            vi.mocked(
                deliveryService.updateStatus
            ).mockResolvedValue(delivery as any);

            await deliveryController.updateStatus(
                req,
                res,
                next
            );

            expect(deliveryService.updateStatus).toHaveBeenCalledWith(
                1,
                1,
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Delivery status updated successfully.",
                data: { delivery },
            });
        });
    });

    it("passes service errors to next", async () => {
        const error = new Error("Service failed");

        vi.mocked(deliveryService.getById).mockRejectedValue(error);

        await deliveryController.getById(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});