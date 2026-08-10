import { describe, it, expect, vi, beforeEach } from "vitest";
import { orderService } from "../../src/services/order.service";

const apiMock = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
}));

vi.mock("../../src/services/api", () => ({
    default: apiMock,
}));

describe("orderService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("gets subscriptions with filters", async () => {
        const paginated = { data: [], total: 0, page: 1, limit: 10 };
        apiMock.get.mockResolvedValue({ data: { data: paginated } });

        const result = await orderService.getSubscriptions({ page: 1 });
        expect(apiMock.get).toHaveBeenCalledWith("/orders/subscriptions", {
            params: { page: 1 },
        });
        expect(result).toEqual(paginated);
    });

    it("gets a subscription by id", async () => {
        const order = { orderId: 9 };
        apiMock.get.mockResolvedValue({ data: { data: { order } } });

        const result = await orderService.getSubscription(9);
        expect(apiMock.get).toHaveBeenCalledWith("/orders/subscriptions/9");
        expect(result).toEqual(order);
    });

    it("creates a subscription", async () => {
        const payload = { customerId: 1, quantity: 10 };
        apiMock.post.mockResolvedValue({
            data: { data: { order: { orderId: 9 } } },
        });

        const result = await orderService.createSubscription(payload as never);
        expect(apiMock.post).toHaveBeenCalledWith(
            "/orders/subscriptions",
            payload
        );
        expect(result).toEqual({ orderId: 9 });
    });

    it("updates a subscription", async () => {
        apiMock.put.mockResolvedValue({
            data: { data: { order: { orderId: 9 } } },
        });

        const result = await orderService.updateSubscription(9, {
            quantity: 20,
        });
        expect(apiMock.put).toHaveBeenCalledWith(
            "/orders/subscriptions/9",
            { quantity: 20 }
        );
        expect(result).toEqual({ orderId: 9 });
    });

    it("cancels a subscription", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });
        await orderService.cancelSubscription(9);
        expect(apiMock.patch).toHaveBeenCalledWith(
            "/orders/subscriptions/9/cancel"
        );
    });

    it("changes a subscription status", async () => {
        apiMock.patch.mockResolvedValue({
            data: { data: { order: { orderId: 9 } } },
        });

        const result = await orderService.changeSubscriptionStatus(9, "Active");
        expect(apiMock.patch).toHaveBeenCalledWith(
            "/orders/subscriptions/9/status",
            { status: "Active" }
        );
        expect(result).toEqual({ orderId: 9 });
    });

    it("reactivates a subscription", async () => {
        apiMock.patch.mockResolvedValue({
            data: { data: { order: { orderId: 9 } } },
        });

        const result = await orderService.reactivateSubscription(9);
        expect(apiMock.patch).toHaveBeenCalledWith(
            "/orders/subscriptions/9/reactivate"
        );
        expect(result).toEqual({ orderId: 9 });
    });

    it("gets one-time orders with filters", async () => {
        const paginated = { data: [], total: 0, page: 1, limit: 10 };
        apiMock.get.mockResolvedValue({ data: { data: paginated } });

        const result = await orderService.getOrders({ page: 1 });
        expect(apiMock.get).toHaveBeenCalledWith("/orders/one-time", {
            params: { page: 1 },
        });
        expect(result).toEqual(paginated);
    });

    it("gets a one-time order by id", async () => {
        const order = { orderId: 4 };
        apiMock.get.mockResolvedValue({ data: { data: { order } } });

        const result = await orderService.getOrder(4);
        expect(apiMock.get).toHaveBeenCalledWith("/orders/one-time/4");
        expect(result).toEqual(order);
    });

    it("creates a one-time order", async () => {
        const payload = { customerId: 1, quantity: 5 };
        apiMock.post.mockResolvedValue({
            data: { data: { order: { orderId: 4 } } },
        });

        const result = await orderService.createOrder(payload as never);
        expect(apiMock.post).toHaveBeenCalledWith("/orders/one-time", payload);
        expect(result).toEqual({ orderId: 4 });
    });

    it("updates a one-time order", async () => {
        apiMock.put.mockResolvedValue({
            data: { data: { order: { orderId: 4 } } },
        });

        const result = await orderService.updateOrder(4, { quantity: 8 });
        expect(apiMock.put).toHaveBeenCalledWith("/orders/one-time/4", {
            quantity: 8,
        });
        expect(result).toEqual({ orderId: 4 });
    });

    it("cancels a one-time order", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });
        await orderService.cancelOrder(4);
        expect(apiMock.patch).toHaveBeenCalledWith("/orders/one-time/4/cancel");
    });

    it("changes a one-time order status", async () => {
        apiMock.patch.mockResolvedValue({
            data: { data: { order: { orderId: 4 } } },
        });

        const result = await orderService.changeOrderStatus(4, "Completed");
        expect(apiMock.patch).toHaveBeenCalledWith(
            "/orders/one-time/4/status",
            { status: "Completed" }
        );
        expect(result).toEqual({ orderId: 4 });
    });

    it("reactivates a one-time order", async () => {
        apiMock.patch.mockResolvedValue({
            data: { data: { order: { orderId: 4 } } },
        });

        const result = await orderService.reactivateOrder(4);
        expect(apiMock.patch).toHaveBeenCalledWith(
            "/orders/one-time/4/reactivate"
        );
        expect(result).toEqual({ orderId: 4 });
    });

    it("bulk creates orders", async () => {
        const orders = [{ customerId: 1 }];
        apiMock.post.mockResolvedValue({ data: { data: { orders } } });

        const result = await orderService.bulkCreateOrders([
            { customerId: 1 } as never,
        ]);
        expect(apiMock.post).toHaveBeenCalledWith(
            "/orders/one-time/bulk",
            [{ customerId: 1 }]
        );
        expect(result).toEqual(orders);
    });

    it("gets milk types", async () => {
        const milkTypes = [{ milkTypeId: 1, productName: "Full Cream" }];
        apiMock.get.mockResolvedValue({ data: { data: { milkTypes } } });

        const result = await orderService.getMilkTypes();
        expect(apiMock.get).toHaveBeenCalledWith("/orders/milk-types");
        expect(result).toEqual(milkTypes);
    });
});
