import { beforeEach, describe, expect, it, vi } from "vitest";

import { customerService } from "../../../src/modules/customers/customer.service.js";
import { customerRepository } from "../../../src/modules/customers/customer.repository.js";
import { pool } from "../../../src/config/database.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock("../../../src/modules/customers/customer.repository.js", () => ({
    customerRepository: {
        findCustomerByEmail: vi.fn(),
        findCustomerByContactNumber: vi.fn(),
        createCustomer: vi.fn(),
        findCustomerById: vi.fn(),
        countCustomers: vi.fn(),
        findCustomers: vi.fn(),
        updateCustomer: vi.fn(),
        updateCustomerStatus: vi.fn(),
    },
}));

vi.mock("../../../src/config/database.js", () => ({
    pool: {
        connect: vi.fn(),
    },
}));

describe("customerService", () => {
    const client = {
        query: vi.fn(),
        release: vi.fn(),
    };

    const customer = {
        customer_id: 1,
        email_address: "customer@example.com",
        contact_number: "03001234567",
        account_status: "Active",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(pool.connect).mockResolvedValue(client as any);

        client.query.mockResolvedValue(undefined);
        client.release.mockImplementation(() => { });
    });

    describe("createCustomer", () => {
        it("creates a customer", async () => {
            vi.mocked(customerRepository.findCustomerByEmail).mockResolvedValue(null);
            vi.mocked(customerRepository.findCustomerByContactNumber).mockResolvedValue(null);
            vi.mocked(customerRepository.createCustomer).mockResolvedValue(1);

            vi.mocked(customerRepository.findCustomerById)
                .mockResolvedValueOnce(customer as any);

            await expect(
                customerService.createCustomer({} as any)
            ).resolves.toEqual(customer);

            expect(client.query).toHaveBeenCalledWith("BEGIN");
            expect(client.query).toHaveBeenCalledWith("COMMIT");
            expect(client.release).toHaveBeenCalled();
        });

        it("throws when email already exists", async () => {
            vi.mocked(customerRepository.findCustomerByEmail).mockResolvedValue(
                customer as any
            );

            await expect(
                customerService.createCustomer({
                    email_address: "customer@example.com",
                } as any)
            ).rejects.toThrow("Email address already exists.");

            expect(client.query).toHaveBeenCalledWith("ROLLBACK");
        });

        it("throws when contact number already exists", async () => {
            vi.mocked(customerRepository.findCustomerByEmail).mockResolvedValue(null);

            vi.mocked(
                customerRepository.findCustomerByContactNumber
            ).mockResolvedValue(customer as any);

            await expect(
                customerService.createCustomer({
                    contact_number: "03001234567",
                } as any)
            ).rejects.toThrow("Contact number already exists.");
        });
    });

    describe("listCustomers", () => {
        it("returns paginated customers", async () => {
            vi.mocked(customerRepository.countCustomers).mockResolvedValue(1);

            vi.mocked(customerRepository.findCustomers).mockResolvedValue([
                customer,
            ] as any);

            await expect(
                customerService.listCustomers({
                    page: 1,
                    limit: 20,
                })
            ).resolves.toEqual({
                data: [customer],
                total: 1,
                page: 1,
                limit: 20,
                totalPages: 1,
            });
        });
    });

    describe("getCustomerById", () => {
        it("returns customer by id", async () => {
            vi.mocked(customerRepository.findCustomerById).mockResolvedValue(
                customer as any
            );

            await expect(
                customerService.getCustomerById(1)
            ).resolves.toEqual(customer);
        });

        it("throws when customer does not exist", async () => {
            vi.mocked(customerRepository.findCustomerById).mockResolvedValue(
                null
            );

            await expect(
                customerService.getCustomerById(1)
            ).rejects.toThrow("Customer not found.");
        });
    });

    describe("updateCustomerProfile", () => {
        it("updates customer profile", async () => {
            vi.mocked(customerRepository.findCustomerById)
                .mockResolvedValueOnce(customer as any)
                .mockResolvedValueOnce({
                    ...customer,
                    contact_number: "03112223333",
                } as any);

            vi.mocked(
                customerRepository.findCustomerByContactNumber
            ).mockResolvedValue(null);

            await expect(
                customerService.updateCustomerProfile(1, {
                    contact_number: "03112223333",
                } as any)
            ).resolves.toEqual({
                ...customer,
                contact_number: "03112223333",
            });

            expect(customerRepository.updateCustomer).toHaveBeenCalled();
            expect(client.query).toHaveBeenCalledWith("COMMIT");
        });

        it("throws when customer does not exist", async () => {
            vi.mocked(customerRepository.findCustomerById).mockResolvedValue(
                null
            );

            await expect(
                customerService.updateCustomerProfile(1, {} as any)
            ).rejects.toThrow("Customer not found.");
        });

        it("throws when contact number already exists", async () => {
            vi.mocked(customerRepository.findCustomerById).mockResolvedValue(
                customer as any
            );

            vi.mocked(
                customerRepository.findCustomerByContactNumber
            ).mockResolvedValue({
                customer_id: 2,
            } as any);

            await expect(
                customerService.updateCustomerProfile(1, {
                    contact_number: "03112223333",
                } as any)
            ).rejects.toThrow("Contact number already exists.");
        });
    });

    describe("changeCustomerStatus", () => {
        it("changes customer status", async () => {
            vi.mocked(customerRepository.findCustomerById)
                .mockResolvedValueOnce(customer as any)
                .mockResolvedValueOnce({
                    ...customer,
                    account_status: "Inactive",
                } as any);

            await expect(
                customerService.changeCustomerStatus(1, {
                    account_status: "Inactive",
                } as any)
            ).resolves.toEqual({
                ...customer,
                account_status: "Inactive",
            });

            expect(customerRepository.updateCustomerStatus).toHaveBeenCalled();
            expect(client.query).toHaveBeenCalledWith("COMMIT");
        });

        it("throws when customer does not exist", async () => {
            vi.mocked(customerRepository.findCustomerById).mockResolvedValue(
                null
            );

            await expect(
                customerService.changeCustomerStatus(1, {
                    account_status: "Inactive",
                } as any)
            ).rejects.toThrow("Customer not found.");
        });

        it("throws when status is unchanged", async () => {
            vi.mocked(customerRepository.findCustomerById).mockResolvedValue(
                customer as any
            );

            await expect(
                customerService.changeCustomerStatus(1, {
                    account_status: "Active",
                } as any)
            ).rejects.toThrow(
                "Customer already has this account status."
            );
        });
    });
});