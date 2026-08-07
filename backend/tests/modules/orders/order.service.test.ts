import { beforeEach, describe, expect, it, vi } from "vitest";
import { orderService } from "../../../src/modules/orders/order.service.js";
import { orderRepository } from "../../../src/modules/orders/order.repository.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock("../../../src/modules/orders/order.repository.js", () => ({
    orderRepository: {
        customerExists: vi.fn(),
        milkTypeExists: vi.fn(),
        subscriptionExists: vi.fn(),
        createSubscription: vi.fn(),
        updateOrder: vi.fn(),
        cancelOrder: vi.fn(),
        listSubscriptions: vi.fn(),
        countSubscriptions: vi.fn(),
        createOrder: vi.fn(),
        beginTransaction: vi.fn(),
        bulkCreateOrders: vi.fn(),
        commit: vi.fn(),
        rollback: vi.fn(),
        listOrders: vi.fn(),
        countOrders: vi.fn(),
        getMilkTypes: vi.fn(),
        getById: vi.fn(),
        getByIdAndType: vi.fn(),
        updateOrderStatus: vi.fn(),
        getOrderCutoffTime: vi.fn(),
    },
}));

vi.mock("../../../src/modules/deliveries/delivery.service.js", () => ({
    deliveryService: {
        create: vi.fn(),
        createMany: vi.fn(),
    },
}));

vi.mock(
    "../../../src/modules/orders/helpers/cutoff.helper.js",
    () => ({
        validateOrderCutoffTime: vi.fn(),
        validateDeliveryDate: vi.fn(),
    })
);

describe("orderService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates a subscription", async () => {
        vi.mocked(orderRepository.customerExists).mockResolvedValue(true);
        vi.mocked(orderRepository.milkTypeExists).mockResolvedValue(true);
        vi.mocked(orderRepository.subscriptionExists).mockResolvedValue(false);
        vi.mocked(orderRepository.createSubscription).mockResolvedValue({
            orderId: 1,
        } as any);

        await expect(
            orderService.createSubscription({
                customerId: 1,
                milkTypeId: 1,
                quantity: 5,
                billingModel: "Subscription",
                deliveryFrequency: "Daily",
                deliveryTimePreference: "Morning",
            } as any)
        ).resolves.toEqual({ orderId: 1 });
    });

    it("rejects invalid one-time order quantity", async () => {
        vi.mocked(orderRepository.customerExists).mockResolvedValue(true);
        vi.mocked(orderRepository.milkTypeExists).mockResolvedValue(true);

        await expect(
            orderService.createOrder({
                customerId: 1,
                milkTypeId: 1,
                quantity: 0,
                billingModel: "Per Delivery",
                deliveryDate: "2024-01-01",
                deliveryTimePreference: "Morning",
            } as any)
        ).rejects.toBeInstanceOf(AppError);
    });
});