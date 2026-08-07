import { beforeEach, describe, expect, it, vi } from "vitest";
import { validationResult } from "express-validator";

import { customerController } from "../../../src/modules/customers/customer.controller.js";
import { customerService } from "../../../src/modules/customers/customer.service.js";

vi.mock("express-validator", () => ({
    validationResult: vi.fn(),
}));

vi.mock("../../../src/modules/customers/customer.service.js", () => ({
    customerService: {
        createCustomer: vi.fn(),
        getCustomerById: vi.fn(),
        listCustomers: vi.fn(),
        updateCustomerProfile: vi.fn(),
        changeCustomerStatus: vi.fn(),
    },
}));

describe("customerController", () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            body: {},
            params: {},
            query: {},
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

    describe("create", () => {
        it("creates a customer", async () => {
            const customer = { customer_id: 1 };

            vi.mocked(customerService.createCustomer).mockResolvedValue(
                customer as any
            );

            await customerController.create(req, res, next);

            expect(customerService.createCustomer).toHaveBeenCalledWith(
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(201);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Customer created successfully.",
                data: {
                    customer,
                },
            });
        });

        it("passes service errors to next", async () => {
            const error = new Error("Service failed");

            vi.mocked(customerService.createCustomer).mockRejectedValue(error);

            await customerController.create(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("getById", () => {
        it("returns a customer", async () => {
            req.params.id = "1";

            const customer = { customer_id: 1 };

            vi.mocked(customerService.getCustomerById).mockResolvedValue(
                customer as any
            );

            await customerController.getById(req, res, next);

            expect(customerService.getCustomerById).toHaveBeenCalledWith(1);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    customer,
                },
            });
        });
    });

    describe("list", () => {
        it("returns paginated customers", async () => {
            const customers = {
                data: [],
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 0,
            };

            vi.mocked(customerService.listCustomers).mockResolvedValue(
                customers as any
            );

            await customerController.list(req, res, next);

            expect(customerService.listCustomers).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: customers,
            });
        });
    });

    describe("update", () => {
        it("updates a customer", async () => {
            req.params.id = "1";

            const customer = { customer_id: 1 };

            vi.mocked(
                customerService.updateCustomerProfile
            ).mockResolvedValue(customer as any);

            await customerController.update(req, res, next);

            expect(
                customerService.updateCustomerProfile
            ).toHaveBeenCalledWith(1, req.body);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Customer updated successfully.",
                data: {
                    customer,
                },
            });
        });
    });

    describe("changeStatus", () => {
        it("changes customer status", async () => {
            req.params.id = "1";

            await customerController.changeStatus(req, res, next);

            expect(
                customerService.changeCustomerStatus
            ).toHaveBeenCalledWith(1, req.body);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Customer status updated successfully.",
            });
        });

        it("passes service errors to next", async () => {
            req.params.id = "1";

            const error = new Error("Service failed");

            vi.mocked(
                customerService.changeCustomerStatus
            ).mockRejectedValue(error);

            await customerController.changeStatus(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});