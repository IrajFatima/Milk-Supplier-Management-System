import { AppError } from "../../shared/errors/AppError.js";
import { pool } from "../../config/database.js";
import {
  CreateCustomerRequest,
  ChangeCustomerStatusRequest,
  CustomerDetail,
  CustomerFilters,
  PaginatedCustomers,
  UpdateCustomerRequest,
} from "../../shared/types/customer.types.js";
import { customerRepository } from "./customer.repository.js";
import { CUSTOMER_ACCOUNT_STATUS_OPTIONS } from "../../shared/constants/customer.js";

export class CustomerService {
  async createCustomer(
    payload: CreateCustomerRequest
  ): Promise<CustomerDetail> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existingEmail = await customerRepository.findCustomerByEmail(
        payload.email_address,
        client
      );

      if (existingEmail) {
        throw new AppError(409, "Email address already exists.");
      }

      const existingContact =
        await customerRepository.findCustomerByContactNumber(
          payload.contact_number,
          client
        );

      if (existingContact) {
        throw new AppError(409, "Contact number already exists.");
      }

      const customerId = await customerRepository.createCustomer(payload, client);
      const customer = await customerRepository.findCustomerById(customerId, client);

      if (!customer) {
        throw new AppError(500, "Failed to retrieve created customer.");
      }

      await client.query("COMMIT");

      return customer;
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
      ) {
        throw new AppError(409, "Email address already exists.");
      }

      throw error;
    } finally {
      client.release();
    }
  }

  async listCustomers(filters: CustomerFilters): Promise<PaginatedCustomers> {
    const normalizedFilters: CustomerFilters = {
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    const total = await customerRepository.countCustomers(normalizedFilters);
    const data = await customerRepository.findCustomers(normalizedFilters);

    return {
      data,
      total,
      page: normalizedFilters.page,
      limit: normalizedFilters.limit,
      totalPages: Math.ceil(total / normalizedFilters.limit),
    };
  }

  async getCustomerById(customerId: number): Promise<CustomerDetail> {
    const customer = await customerRepository.findCustomerById(customerId);

    if (!customer) {
      throw new AppError(404, "Customer not found.");
    }

    return customer;
  }

  async updateCustomerProfile(
    customerId: number,
    payload: UpdateCustomerRequest
  ): Promise<CustomerDetail> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existingCustomer = await customerRepository.findCustomerById(
        customerId,
        client
      );

      if (!existingCustomer) {
        throw new AppError(404, "Customer not found.");
      }

      if (
        payload.contact_number !== undefined &&
        payload.contact_number !== existingCustomer.contact_number
      ) {
        const existingContact =
          await customerRepository.findCustomerByContactNumber(
            payload.contact_number,
            client
          );

        if (existingContact && existingContact.customer_id !== customerId) {
          throw new AppError(409, "Contact number already exists.");
        }
      }

      await customerRepository.updateCustomer(customerId, payload, client);

      const customer = await customerRepository.findCustomerById(
        customerId,
        client
      );

      if (!customer) {
        throw new AppError(500, "Failed to retrieve updated customer.");
      }

      await client.query("COMMIT");

      return customer;
    } catch (error: unknown) {
      await client.query("ROLLBACK");

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
      ) {
        throw new AppError(409, "Contact number already exists.");
      }

      throw error;
    } finally {
      client.release();
    }
  }

  async changeCustomerStatus(
    customerId: number,
    payload: ChangeCustomerStatusRequest
  ): Promise<CustomerDetail> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existingCustomer = await customerRepository.findCustomerById(
        customerId,
        client
      );

      if (!existingCustomer) {
        throw new AppError(404, "Customer not found.");
      }

      if (!CUSTOMER_ACCOUNT_STATUS_OPTIONS.includes(payload.account_status)) {
        throw new AppError(400, "Invalid account status.");
      }

      if (existingCustomer.account_status === payload.account_status) {
        throw new AppError(400, "Customer already has this account status.");
      }


      await customerRepository.updateCustomerStatus(
        customerId,
        payload.account_status,
        client
      );

      const customer = await customerRepository.findCustomerById(
        customerId,
        client
      );

      if (!customer) {
        throw new AppError(500, "Failed to retrieve updated customer.");
      }

      await client.query("COMMIT");

      return customer;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export const customerService = new CustomerService();
