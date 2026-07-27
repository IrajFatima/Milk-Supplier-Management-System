import type { CustomerType, PaymentModel, CustomerAccountStatus } from "../constants/customer";

export interface Customer {
    customer_id: number;
    customer_type: CustomerType;
    customer_name: string;
    contact_number: string | null;
    email_address: string | null;

    delivery_address_line_1: string | null;
    delivery_address_line_2: string | null;

    city_town: string | null;
    state_province: string | null;
    postal_code: string | null;

    delivery_area_route: string | null;
    landmark: string | null;

    payment_model: PaymentModel | null;

    account_status: CustomerAccountStatus;

    registration_date: Date;
}

export type CustomerDetail = Customer;

export interface CustomerListItem {
    customer_id: number;
    customer_name: string;
    customer_type: CustomerType;

    contact_number: string | null;
    email_address: string | null;

    payment_model: PaymentModel | null;

    account_status: CustomerAccountStatus;

    registration_date: Date;
}

export interface CreateCustomerRequest {
    customer_type: CustomerType;
    customer_name: string;
    contact_number: string;
    email_address: string;

    delivery_address_line_1: string;
    delivery_address_line_2?: string;

    city_town: string;
    state_province: string;
    postal_code: string;

    delivery_area_route?: string;
    landmark?: string;

    payment_model: PaymentModel;
}

export interface UpdateCustomerRequest {
    customer_name?: string;
    contact_number?: string;

    delivery_address_line_1?: string;
    delivery_address_line_2?: string;

    city_town?: string;
    state_province?: string;
    postal_code?: string;

    delivery_area_route?: string;
    landmark?: string;

    payment_model?: PaymentModel;
}

export interface ChangeCustomerStatusRequest {
    account_status: CustomerAccountStatus;
}

export interface CustomerFilters {
    page: number;
    limit: number;

    search?: string;

    account_status?: CustomerAccountStatus;

    customer_type?: CustomerType;

    payment_model?: PaymentModel;
}


export interface PaginatedCustomers {
    data: CustomerListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
