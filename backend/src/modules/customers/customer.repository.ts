import { pool } from "../../config/database.js";
import type { PoolClient } from "pg";
import {
  CreateCustomerRequest,
  CustomerDetail,
  CustomerFilters,
  CustomerListItem,
  UpdateCustomerRequest,
} from "../../shared/types/customer.types.js";
import type { CustomerAccountStatus } from "../../shared/constants/customer.js";

export class CustomerRepository {
  private buildWhereClause(filters: CustomerFilters): {
    whereClause: string;
    values: unknown[];
  } {
    const values: unknown[] = [];
    const conditions: string[] = [];

    if (filters.search) {
      values.push(`%${filters.search}%`);
      conditions.push(`(
        customer_name ILIKE $${values.length}
        OR contact_number ILIKE $${values.length}
        OR email_address ILIKE $${values.length}
      )`);
    }

    if (filters.account_status) {
      values.push(filters.account_status);
      conditions.push(`account_status = $${values.length}`);
    }

    if (filters.customer_type) {
      values.push(filters.customer_type);
      conditions.push(`customer_type = $${values.length}`);
    }

    if (filters.payment_model) {
      values.push(filters.payment_model);
      conditions.push(`payment_model = $${values.length}`);
    }

    return {
      whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
      values,
    };
  }

  private mapDetailRow(row: any): CustomerDetail {
    return {
      customer_id: Number(row.customer_id),
      customer_type: row.customer_type,
      customer_name: row.customer_name,
      contact_number: row.contact_number,
      email_address: row.email_address,
      delivery_address_line_1: row.delivery_address_line_1,
      delivery_address_line_2: row.delivery_address_line_2,
      city_town: row.city_town,
      state_province: row.state_province,
      postal_code: row.postal_code,
      delivery_area_route: row.delivery_area_route,
      landmark: row.landmark,
      payment_model: row.payment_model,
      account_status: row.account_status,
      registration_date: row.registration_date,
    };
  }

  private mapListRow(row: any): CustomerListItem {
    return {
      customer_id: Number(row.customer_id),
      customer_name: row.customer_name,
      customer_type: row.customer_type,
      contact_number: row.contact_number,
      email_address: row.email_address,
      payment_model: row.payment_model,
      account_status: row.account_status,
      registration_date: row.registration_date,
    };
  }

  async findCustomerById(
    customerId: number,
    client?: PoolClient
  ): Promise<CustomerDetail | null> {
    const query = `
      SELECT
        customer_id,
        customer_type,
        customer_name,
        contact_number,
        email_address,
        delivery_address_line_1,
        delivery_address_line_2,
        city_town,
        state_province,
        postal_code,
        delivery_area_route,
        landmark,
        payment_model,
        account_status,
        registration_date
      FROM customers
      WHERE customer_id = $1
      LIMIT 1;
    `;

    const executor = client ?? pool;
    const { rows } = await executor.query(query, [customerId]);

    if (!rows.length) {
      return null;
    }

    return this.mapDetailRow(rows[0]);
  }

  async findCustomerByEmail(
    emailAddress: string,
    client?: PoolClient
  ): Promise<{ customer_id: number } | null> {
    const query = `
      SELECT customer_id
      FROM customers
      WHERE LOWER(email_address) = LOWER($1)
      LIMIT 1;
    `;

    const executor = client ?? pool;
    const { rows } = await executor.query(query, [emailAddress]);

    if (!rows.length) {
      return null;
    }

    return { customer_id: Number(rows[0].customer_id) };
  }

  async findCustomerByContactNumber(
    contactNumber: string,
    client?: PoolClient
  ): Promise<{ customer_id: number } | null> {
    const query = `
      SELECT customer_id
      FROM customers
      WHERE contact_number = $1
      LIMIT 1;
    `;

    const executor = client ?? pool;
    const { rows } = await executor.query(query, [contactNumber]);

    if (!rows.length) {
      return null;
    }

    return { customer_id: Number(rows[0].customer_id) };
  }

  async createCustomer(
    payload: CreateCustomerRequest,
    client?: PoolClient
  ): Promise<number> {
    const query = `
      INSERT INTO customers (
        customer_type,
        customer_name,
        contact_number,
        email_address,
        delivery_address_line_1,
        delivery_address_line_2,
        city_town,
        state_province,
        postal_code,
        delivery_area_route,
        landmark,
        payment_model,
        account_status,
        registration_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Active', NOW())
      RETURNING customer_id;
    `;

    const executor = client ?? pool;
    const { rows } = await executor.query(query, [
      payload.customer_type,
      payload.customer_name,
      payload.contact_number,
      payload.email_address,
      payload.delivery_address_line_1,
      payload.delivery_address_line_2 ?? null,
      payload.city_town,
      payload.state_province,
      payload.postal_code,
      payload.delivery_area_route ?? null,
      payload.landmark ?? null,
      payload.payment_model,
    ]);

    return Number(rows[0].customer_id);
  }

  async updateCustomer(
    customerId: number,
    payload: UpdateCustomerRequest,
    client?: PoolClient
  ): Promise<void> {
    const editableFields = [
      "customer_name",
      "contact_number",
      "delivery_address_line_1",
      "delivery_address_line_2",
      "city_town",
      "state_province",
      "postal_code",
      "delivery_area_route",
      "landmark",
      "payment_model",
    ] as const;

    const fieldsToUpdate = editableFields.filter(
      (field) => payload[field] !== undefined
    );

    if (!fieldsToUpdate.length) {
      return;
    }

    const values: unknown[] = fieldsToUpdate.map((field) => payload[field]);
    values.push(customerId);

    const setClause = fieldsToUpdate
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    const query = `
      UPDATE customers
      SET ${setClause}
      WHERE customer_id = $${values.length};
    `;

    const executor = client ?? pool;
    await executor.query(query, values);
  }

  async updateCustomerStatus(
    customerId: number,
    targetStatus: CustomerAccountStatus,
    client?: PoolClient
  ): Promise<void> {
    const query = `
      UPDATE customers
      SET account_status = $1
      WHERE customer_id = $2;
    `;

    const executor = client ?? pool;
    await executor.query(query, [targetStatus, customerId]);
  }

  async countCustomers(filters: CustomerFilters): Promise<number> {
    const { whereClause, values } = this.buildWhereClause(filters);

    const query = `
      SELECT COUNT(*) AS total
      FROM customers
      ${whereClause};
    `;

    const { rows } = await pool.query(query, values);

    return Number(rows[0].total);
  }

  async findCustomers(filters: CustomerFilters): Promise<CustomerListItem[]> {
    const { whereClause, values } = this.buildWhereClause(filters);
    const offset = (filters.page - 1) * filters.limit;

    values.push(filters.limit);
    values.push(offset);

    const query = `
      SELECT
        customer_id,
        customer_name,
        customer_type,
        contact_number,
        email_address,
        payment_model,
        account_status,
        registration_date
      FROM customers
      ${whereClause}
      ORDER BY registration_date DESC, customer_id DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length};
    `;

    const { rows } = await pool.query(query, values);

    return rows.map((row) => this.mapListRow(row));
  }
}

export const customerRepository = new CustomerRepository();
