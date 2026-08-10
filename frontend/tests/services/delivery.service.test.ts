import { describe, it, expect, vi, beforeEach } from "vitest";
import { deliveryService } from "../../src/services/delivery.service";

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

describe("deliveryService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("gets deliveries with filters", async () => {
        const paginated = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
        };
        apiMock.get.mockResolvedValue({ data: { data: paginated } });

        const result = await deliveryService.getDeliveries({ page: 1 });
        expect(apiMock.get).toHaveBeenCalledWith("/deliveries", {
            params: { page: 1 },
        });
        expect(result).toEqual(paginated);
    });

    it("gets my deliveries with filters", async () => {
        apiMock.get.mockResolvedValue({ data: { data: { data: [] } } });

        await deliveryService.getMyDeliveries({ page: 1 });
        expect(apiMock.get).toHaveBeenCalledWith("/deliveries/my", {
            params: { page: 1 },
        });
    });

    it("gets a delivery by id", async () => {
        const delivery = { deliveryId: 7 };
        apiMock.get.mockResolvedValue({ data: { data: { delivery } } });

        const result = await deliveryService.getDeliveryById(7);
        expect(apiMock.get).toHaveBeenCalledWith("/deliveries/7");
        expect(result).toEqual(delivery);
    });

    it("gets my delivery by id", async () => {
        const delivery = { deliveryId: 7 };
        apiMock.get.mockResolvedValue({ data: { data: { delivery } } });

        const result = await deliveryService.getMyDeliveryById(7);
        expect(apiMock.get).toHaveBeenCalledWith("/deliveries/my/7");
        expect(result).toEqual(delivery);
    });

    it("assigns a delivery to staff", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });

        await deliveryService.assignDelivery(7, { deliveryStaffId: 3 });
        expect(apiMock.patch).toHaveBeenCalledWith("/deliveries/7/assign", {
            deliveryStaffId: 3,
        });
    });

    it("updates delivery status", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });

        await deliveryService.updateDeliveryStatus(7, {
            deliveryStatus: "Delivered",
        });
        expect(apiMock.patch).toHaveBeenCalledWith("/deliveries/7/status", {
            deliveryStatus: "Delivered",
        });
    });

    it("gets delivery staff", async () => {
        const deliveryStaff = [{ employeeId: 3, fullName: "Sam" }];
        apiMock.get.mockResolvedValue({
            data: { data: { deliveryStaff } },
        });

        const result = await deliveryService.getDeliveryStaff();
        expect(apiMock.get).toHaveBeenCalledWith("/deliveries/staff");
        expect(result).toEqual(deliveryStaff);
    });
});
