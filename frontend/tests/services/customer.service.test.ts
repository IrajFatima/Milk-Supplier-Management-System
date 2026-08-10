import { describe, it, expect, vi, beforeEach } from "vitest";
import { customerService } from "../../src/services/customer.service";

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

describe("customerService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("gets paginated customers with filters", async () => {
        const paginated = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
        };
        apiMock.get.mockResolvedValue({ data: { data: paginated } });

        const result = await customerService.getCustomers({
            page: 1,
            limit: 10,
            search: "john",
        });

        expect(apiMock.get).toHaveBeenCalledWith("/customers", {
            params: { page: 1, limit: 10, search: "john" },
        });
        expect(result).toEqual(paginated);
    });

    it("gets a single customer", async () => {
        const customer = { customer_id: 3, customer_name: "John" };
        apiMock.get.mockResolvedValue({ data: { data: { customer } } });

        const result = await customerService.getCustomer(3);

        expect(apiMock.get).toHaveBeenCalledWith("/customers/3");
        expect(result).toEqual(customer);
    });

    it("creates a customer", async () => {
        const payload = {
            customer_type: "Retail",
            customer_name: "John",
        };
        apiMock.post.mockResolvedValue({
            data: { data: { customer: { customer_id: 3 } } },
        });

        const result = await customerService.createCustomer(payload as never);

        expect(apiMock.post).toHaveBeenCalledWith("/customers", payload);
        expect(result).toEqual({ customer_id: 3 });
    });

    it("updates a customer", async () => {
        apiMock.put.mockResolvedValue({
            data: { data: { customer: { customer_id: 3 } } },
        });

        const result = await customerService.updateCustomer(3, {
            customer_name: "Jane",
        });

        expect(apiMock.put).toHaveBeenCalledWith("/customers/3", {
            customer_name: "Jane",
        });
        expect(result).toEqual({ customer_id: 3 });
    });

    it("changes customer status", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });

        await customerService.changeCustomerStatus(3, {
            account_status: "Active",
        });

        expect(apiMock.patch).toHaveBeenCalledWith("/customers/3/status", {
            account_status: "Active",
        });
    });
});
