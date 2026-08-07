import { beforeEach, describe, expect, it, vi } from "vitest";

import { deliveryService } from "../../../src/modules/deliveries/delivery.service.js";
import { deliveryRepository } from "../../../src/modules/deliveries/delivery.repository.js";
import { orderRepository } from "../../../src/modules/orders/order.repository.js";
import {
    DELIVERY_STATUS,
} from "../../../src/shared/constants/delivery.js";
import {
    ORDER_TYPES,
    ONE_TIME_ORDER_STATUS,
} from "../../../src/shared/constants/order.js";

vi.mock("../../../src/modules/deliveries/delivery.repository.js", () => ({
    deliveryRepository: {
        findById: vi.fn(),
        getAssignedDeliveries: vi.fn(),
        create: vi.fn(),
        createMany: vi.fn(),
        getSubscriptionsForDelivery: vi.fn(),
        list: vi.fn(),
        getDeliveryStaff: vi.fn(),
        findAssignableStaffById: vi.fn(),
        assign: vi.fn(),
        updateStatus: vi.fn(),
        markExpiredDeliveriesAsFailed: vi.fn(),
    },
}));

vi.mock("../../../src/modules/orders/order.repository.js", () => ({
    orderRepository: {
        getById: vi.fn(),
        updateOrderStatus: vi.fn(),
    },
}));

describe("deliveryService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const delivery = {
        deliveryId: 1,
        orderId: 1,
        deliveryStaffId: 2,
        deliveryStatus: DELIVERY_STATUS.SCHEDULED,
        deliveryDate: futureDate,
        scheduledQuantity: 10,
    };

    describe("getById", () => {
        it("returns a delivery", async () => {
            vi.mocked(deliveryRepository.findById).mockResolvedValue(
                delivery as any
            );

            await expect(deliveryService.getById(1)).resolves.toEqual(
                delivery
            );
        });

        it("throws when delivery does not exist", async () => {
            vi.mocked(deliveryRepository.findById).mockResolvedValue(null);

            await expect(deliveryService.getById(1)).rejects.toThrow(
                "Delivery not found."
            );
        });
    });

    describe("getAssignedDeliveryById", () => {
        it("returns assigned delivery", async () => {
            vi.mocked(deliveryRepository.findById).mockResolvedValue(
                delivery as any
            );

            await expect(
                deliveryService.getAssignedDeliveryById(1, 2)
            ).resolves.toEqual(delivery);
        });

        it("rejects unauthorized assigned delivery access", async () => {
            vi.mocked(deliveryRepository.findById).mockResolvedValue(
                delivery as any
            );

            await expect(
                deliveryService.getAssignedDeliveryById(1, 3)
            ).rejects.toThrow(
                "You are not authorized to access this delivery."
            );
        });
    });

    describe("getAssignedDeliveries", () => {
        it("returns assigned deliveries", async () => {
            vi.mocked(
                deliveryRepository.getAssignedDeliveries
            ).mockResolvedValue({
                data: [],
                total: 0,
            } as any);

            await expect(
                deliveryService.getAssignedDeliveries(2, {} as any)
            ).resolves.toEqual({
                data: [],
                total: 0,
            });
        });
    });

    describe("create", () => {
        it("creates a delivery", async () => {
            vi.mocked(deliveryRepository.create).mockResolvedValue(1);

            await expect(
                deliveryService.create({} as any)
            ).resolves.toBe(1);
        });
    });

    describe("createMany", () => {
        it("creates multiple deliveries", async () => {
            vi.mocked(deliveryRepository.createMany).mockResolvedValue(2);

            await expect(
                deliveryService.createMany([{} as any, {} as any])
            ).resolves.toBe(2);
        });

        it("returns zero for empty payload", async () => {
            await expect(
                deliveryService.createMany([])
            ).resolves.toBe(0);
        });
    });

    describe("generateDeliveriesForDate", () => {
        it("creates deliveries for subscriptions", async () => {
            vi.mocked(
                deliveryRepository.getSubscriptionsForDelivery
            ).mockResolvedValue([
                {
                    orderId: 1,
                    customerId: 1,
                    quantity: 5,
                },
            ] as any);

            vi.mocked(deliveryRepository.createMany).mockResolvedValue(1);

            await expect(
                deliveryService.generateDeliveriesForDate("2026-08-08")
            ).resolves.toBe(1);
        });

        it("returns zero when there are no subscriptions", async () => {
            vi.mocked(
                deliveryRepository.getSubscriptionsForDelivery
            ).mockResolvedValue([]);

            await expect(
                deliveryService.generateDeliveriesForDate("2026-08-08")
            ).resolves.toBe(0);
        });
    });

    describe("list", () => {
        it("returns deliveries", async () => {
            vi.mocked(deliveryRepository.list).mockResolvedValue({
                data: [],
            } as any);

            await expect(
                deliveryService.list({} as any)
            ).resolves.toEqual({
                data: [],
            });
        });
    });

    describe("getDeliveryStaff", () => {
        it("returns delivery staff", async () => {
            vi.mocked(deliveryRepository.getDeliveryStaff).mockResolvedValue(
                []
            );

            await expect(
                deliveryService.getDeliveryStaff()
            ).resolves.toEqual([]);
        });
    });

    describe("assign", () => {
        it("assigns a delivery", async () => {
            vi.mocked(deliveryRepository.findById).mockResolvedValue(
                delivery as any
            );

            vi.mocked(
                deliveryRepository.findAssignableStaffById
            ).mockResolvedValue({
                employeeId: 5,
            } as any);

            vi.mocked(deliveryRepository.assign).mockResolvedValue(
                delivery as any
            );

            await expect(
                deliveryService.assign(1, {
                    deliveryStaffId: 5,
                })
            ).resolves.toEqual(delivery);
        });

        it("throws when delivery is already assigned to the same employee", async () => {
            vi.mocked(deliveryRepository.findById).mockResolvedValue(
                delivery as any
            );

            vi.mocked(
                deliveryRepository.findAssignableStaffById
            ).mockResolvedValue({
                employeeId: 2,
            } as any);

            await expect(
                deliveryService.assign(1, {
                    deliveryStaffId: 2,
                })
            ).rejects.toThrow(
                "Delivery is already assigned to this delivery staff."
            );
        });
    });

    describe("updateStatus", () => {
        it("marks delivery as successfully delivered", async () => {
            vi.mocked(deliveryRepository.findById).mockResolvedValue(
                delivery as any
            );

            vi.mocked(deliveryRepository.updateStatus).mockResolvedValue({
                ...delivery,
                deliveryStatus: DELIVERY_STATUS.SUCCESSFULLY_DELIVERED,
            } as any);

            vi.mocked(orderRepository.getById).mockResolvedValue({
                orderType: ORDER_TYPES.ONE_TIME,
            } as any);

            await deliveryService.updateStatus(1, 2, {
                deliveryStatus: DELIVERY_STATUS.SUCCESSFULLY_DELIVERED,
            });

            expect(
                orderRepository.updateOrderStatus
            ).toHaveBeenCalledWith(
                1,
                ONE_TIME_ORDER_STATUS.COMPLETED
            );
        });

        it("rejects unauthorized status update", async () => {
            vi.mocked(deliveryRepository.findById).mockResolvedValue(
                delivery as any
            );

            await expect(
                deliveryService.updateStatus(1, 5, {
                    deliveryStatus:
                        DELIVERY_STATUS.SUCCESSFULLY_DELIVERED,
                })
            ).rejects.toThrow(
                "You are not authorized to update this delivery."
            );
        });
    });

    describe("markExpiredDeliveriesAsFailed", () => {
        it("marks expired deliveries as failed", async () => {
            vi.mocked(
                deliveryRepository.markExpiredDeliveriesAsFailed
            ).mockResolvedValue(4);

            await expect(
                deliveryService.markExpiredDeliveriesAsFailed()
            ).resolves.toBe(4);
        });
    });
});