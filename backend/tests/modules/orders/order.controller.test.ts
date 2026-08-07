import { beforeEach, describe, expect, it, vi } from "vitest";
import { orderController } from "../../../src/modules/orders/order.controller.js";
import { orderService } from "../../../src/modules/orders/order.service.js";

vi.mock("../../../src/modules/orders/order.service.js", () => ({
    orderService: {
        createSubscription: vi.fn(),
        listSubscriptions: vi.fn(),
        getSubscriptionById: vi.fn(),
        updateSubscription: vi.fn(),
        cancelSubscription: vi.fn(),
        createOrder: vi.fn(),
        bulkCreateOrders: vi.fn(),
        listOrders: vi.fn(),
        getOrderById: vi.fn(),
        updateOrder: vi.fn(),
        cancelOrder: vi.fn(),
        changeOrderStatus: vi.fn(),
        reactivateOrder: vi.fn(),
        getMilkTypes: vi.fn(),
    },
}));

describe("orderController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns subscription response", async () => {
        const req: any = {
            body: {},
        };

        const res: any = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        vi.mocked(orderService.createSubscription).mockResolvedValue({
            orderId: 1,
        } as any);

        await orderController.createSubscription(req, res, vi.fn());

        expect(res.status).toHaveBeenCalledWith(201);
    });
});