import api from "./api";

import type {
    ChangeCustomerStatusRequest,
    CreateCustomerRequest,
    Customer,
    CustomerFilters,
    PaginatedCustomers,
    UpdateCustomerRequest,
} from "../types/customer.types";

export const customerService = {
    async getCustomers(
        filters: CustomerFilters
    ): Promise<PaginatedCustomers> {
        const response = await api.get("/customers", {
            params: filters,
        });
        console.log("getCustomer response:", response.data.data);


        return response.data.data;
    },

    async getCustomer(id: number): Promise<Customer> {
        const response = await api.get(`/customers/${id}`);
        return response.data.data.customer;
    },

    async createCustomer(
        data: CreateCustomerRequest
    ): Promise<Customer> {
        const response = await api.post("/customers", data);

        return response.data.data.customer;
    },

    async updateCustomer(
        id: number,
        data: UpdateCustomerRequest
    ): Promise<Customer> {
        const response = await api.put(`/customers/${id}`, data);

        return response.data.data.customer;
    },

    async changeCustomerStatus(
        id: number,
        data: ChangeCustomerStatusRequest
    ): Promise<void> {
        await api.patch(`/customers/${id}/status`, data);
    },
};