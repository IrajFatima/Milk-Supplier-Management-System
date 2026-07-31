// src/modules/deliveries/delivery.repository.ts

import { pool } from "../../config/database.js";
import { DELIVERY_STATUS } from "../../shared/constants/delivery.js";
import { ORDER_TYPES, SUBSCRIPTION_STATUS } from "../../shared/constants/order.js";

import {
    Delivery,
    DeliveryFilters,
    PaginatedDeliveries,
    DeliveryStaff,
    AssignDeliveryRequest,
    CreateDeliveryRequest,
    SubscriptionDeliveryCandidate,
    UpdateDeliveryStatusRequest,
} from "../../shared/types/delivery.types.js";

export class DeliveryRepository {

    private mapRow(row: any): Delivery {
        return {
            deliveryId: row.delivery_id,
            orderId: row.order_id,
            customerId: row.customer_id,

            customerName: row.customer_name,
            contactNumber: row.contact_number,
            deliveryAddressLine1: row.delivery_address_line_1,
            deliveryAddressLine2: row.delivery_address_line_2,
            cityTown: row.city_town,
            stateProvince: row.state_province,
            postalCode: row.postal_code,
            landmark: row.landmark,

            orderType: row.order_type,
            milkTypeId: row.milk_type_id,
            milkType: row.milk_type,

            scheduledQuantity: Number(row.scheduled_quantity),

            deliveryStaffId: row.delivery_staff_id
                ? Number(row.delivery_staff_id)
                : null,

            deliveryStaffName: row.delivery_staff_name ?? null,

            deliveryDate: row.delivery_date,
            deliveryTimePreference: row.delivery_time_preference,

            deliveredQuantity:
                row.delivered_quantity !== null
                    ? Number(row.delivered_quantity)
                    : null,

            deliveryStatus: row.delivery_status,
            paymentCollected: Number(row.payment_collected),
            deliveryRemarks: row.delivery_remarks,
            createdDate: row.created_date,
        };
    }

    async findById(deliveryId: number): Promise<Delivery | null> {

        const query = `
            SELECT
                d.delivery_id,
                d.order_id,
                d.customer_id,
                d.delivery_staff_id,
                d.delivery_date,
                d.scheduled_quantity,
                d.delivered_quantity,
                d.delivery_status,
                d.payment_collected,
                d.delivery_remarks,

                o.order_type,
                o.delivery_time_preference,
                o.created_date,

                mt.milk_type_id,
                mt.product_name AS milk_type,

                c.customer_name,
                c.contact_number,
                c.delivery_address_line_1,
                c.delivery_address_line_2,
                c.city_town,
                c.state_province,
                c.postal_code,
                c.landmark,

                e.full_name AS delivery_staff_name

            FROM deliveries d

            INNER JOIN orders o
                ON d.order_id = o.order_id

            INNER JOIN customers c
                ON d.customer_id = c.customer_id

            INNER JOIN milk_types mt
                ON o.milk_type_id = mt.milk_type_id

            LEFT JOIN employees e
                ON d.delivery_staff_id = e.employee_id

            WHERE d.delivery_id = $1

            LIMIT 1;
        `;

        const { rows } = await pool.query(query, [deliveryId]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRow(rows[0]);
    }

    async getAssignedDeliveries(
        employeeId: number,
        filters: DeliveryFilters
    ): Promise<PaginatedDeliveries> {
        const { page, limit, search, status, milkTypeId } = filters;
        const offset = (page - 1) * limit;

        const values: any[] = [employeeId];
        const conditions = [
            "d.delivery_staff_id = $1",
            "d.delivery_date = CURRENT_DATE",
        ];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`(c.customer_name ILIKE $${values.length} OR CAST(d.delivery_id AS TEXT) ILIKE $${values.length})`);
        }

        if (status) {
            values.push(status);
            conditions.push(`d.delivery_status = $${values.length}`);
        }

        if (milkTypeId) {
            values.push(milkTypeId);
            conditions.push(`o.milk_type_id = $${values.length}`);
        }

        const whereClause = `WHERE ${conditions.join(" AND ")}`;

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM deliveries d
         INNER JOIN orders o ON d.order_id = o.order_id
         INNER JOIN customers c ON d.customer_id = c.customer_id
         ${whereClause};`,
            values
        );

        const total = Number(countResult.rows[0].count);

        values.push(limit, offset);

        const { rows } = await pool.query(
            `SELECT
            d.delivery_id,d.delivery_date,d.scheduled_quantity,d.delivery_status,
            d.delivery_staff_id,d.delivered_quantity,d.payment_collected,d.delivery_remarks,
            c.customer_name,
            o.order_id,o.order_type,o.delivery_time_preference,o.created_date,
            mt.milk_type_id,mt.product_name AS milk_type,
            e.full_name AS delivery_staff_name
        FROM deliveries d
        INNER JOIN orders o ON d.order_id = o.order_id
        INNER JOIN customers c ON d.customer_id = c.customer_id
        INNER JOIN milk_types mt ON o.milk_type_id = mt.milk_type_id
        LEFT JOIN employees e ON d.delivery_staff_id = e.employee_id
        ${whereClause}
        ORDER BY o.delivery_time_preference,c.customer_name
        LIMIT $${values.length - 1} OFFSET $${values.length};`,
            values
        );

        return {
            data: rows.map((row) => ({
                deliveryId: row.delivery_id,
                customerName: row.customer_name,
                orderType: row.order_type,
                milkType: row.milk_type,
                scheduledQuantity: Number(row.scheduled_quantity),
                deliveryDate: row.delivery_date,
                deliveryStaffId: row.delivery_staff_id !== null ? Number(row.delivery_staff_id) : null,
                deliveryStaffName: row.delivery_staff_name ?? null,
                deliveryStatus: row.delivery_status,
                createdDate: row.created_date,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async existsById(deliveryId: number): Promise<boolean> {

        const query = `
            SELECT 1
            FROM deliveries
            WHERE delivery_id = $1
            LIMIT 1;
        `;

        const { rows } = await pool.query(query, [deliveryId]);

        return rows.length > 0;
    }

    async findAssignableStaffById(
        employeeId: number
    ): Promise<DeliveryStaff | null> {

        const query = `
            SELECT
                e.employee_id,
                e.full_name
            FROM employees e

            INNER JOIN users u
                ON e.employee_id = u.employee_id

            INNER JOIN roles r
                ON u.role_id = r.role_id

            WHERE
                e.employee_id = $1
                AND e.employment_status = 'Active'
                AND r.role_name = 'Delivery Staff'

            LIMIT 1;
        `;

        const { rows } = await pool.query(query, [employeeId]);

        if (rows.length === 0) {
            return null;
        }

        return {
            employeeId: Number(rows[0].employee_id),
            fullName: rows[0].full_name,
        };
    }

    async create(
        payload: CreateDeliveryRequest
    ): Promise<number> {

        const query = `
        INSERT INTO deliveries (
            order_id,
            customer_id,
            delivery_date,
            scheduled_quantity,
            delivery_status
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        RETURNING delivery_id;
    `;

        const { rows } = await pool.query(query, [
            payload.orderId,
            payload.customerId,
            payload.deliveryDate,
            payload.scheduledQuantity,
            DELIVERY_STATUS.SCHEDULED,
        ]);

        return Number(rows[0].delivery_id);
    }

    async createMany(
        deliveries: CreateDeliveryRequest[]
    ): Promise<number> {

        if (deliveries.length === 0) {
            return 0;
        }

        const values: any[] = [];

        const placeholders = deliveries.map((delivery, index) => {

            const base = index * 5;

            values.push(
                delivery.orderId,
                delivery.customerId,
                delivery.deliveryDate,
                delivery.scheduledQuantity,
                DELIVERY_STATUS.SCHEDULED
            );

            return `(
            $${base + 1},
            $${base + 2},
            $${base + 3},
            $${base + 4},
            $${base + 5}
        )`;
        });

        const query = `
        INSERT INTO deliveries (
            order_id,
            customer_id,
            delivery_date,
            scheduled_quantity,
            delivery_status
        )
        VALUES
            ${placeholders.join(",")}
        ON CONFLICT (order_id, delivery_date)
        DO NOTHING
        RETURNING delivery_id;
    `;

        const { rows } = await pool.query(query, values);

        return rows.length;
    }

    async updateStatus(
        deliveryId: number,
        payload: UpdateDeliveryStatusRequest
    ): Promise<Delivery> {

        const query = `
        UPDATE deliveries

        SET
            delivery_status = $1,
            delivered_quantity = $2,
            delivery_remarks = $3

        WHERE
            delivery_id = $4

        RETURNING delivery_id;
    `;

        const { rows } = await pool.query(query, [
            payload.deliveryStatus,
            payload.deliveredQuantity ?? null,
            payload.remarks ?? null,
            deliveryId,
        ]);

        return (await this.findById(
            Number(rows[0].delivery_id)
        ))!;
    }

    async getDeliveryPlanningCutoffTime(): Promise<string | null> {

        const query = `
        SELECT config_value
        FROM system_configurations
        WHERE config_key = 'delivery_cutoff_time'
        LIMIT 1;
    `;

        const { rows } = await pool.query(query);

        return rows.length > 0
            ? rows[0].config_value
            : null;
    }

    async getSubscriptionsForDelivery(
        deliveryDate: string
    ): Promise<SubscriptionDeliveryCandidate[]> {

        const dayOfWeek = new Date(deliveryDate).getDay();

        const isMonday = dayOfWeek === 1;
        const dayOfMonth = new Date(deliveryDate).getDate();
        const isAlternateDay = dayOfMonth % 2 === 1;

        let query = `
            SELECT
                o.order_id,
                o.customer_id,
                o.quantity
            FROM orders o
            WHERE
                o.order_type = $1
                AND o.order_status = $2
                AND (
                    o.delivery_frequency = 'Daily'
        `;

        if (isMonday) {
            query += `
                OR o.delivery_frequency = 'Weekly'
            `;
        }

        if (isAlternateDay) {
            query += `
                OR o.delivery_frequency = 'Alternate Days'
            `;
        }

        query += `
            );
        `;

        const { rows } = await pool.query(query, [
            ORDER_TYPES.SUBSCRIPTION, SUBSCRIPTION_STATUS.ACTIVE
        ]);

        return rows.map((row) => ({
            orderId: Number(row.order_id),
            customerId: Number(row.customer_id),
            quantity: Number(row.quantity),
        }));
    }

    async getDeliveryStaff(): Promise<DeliveryStaff[]> {

        const query = `
            SELECT
                e.employee_id,
                e.full_name

            FROM employees e

            INNER JOIN users u
                ON e.employee_id = u.employee_id

            INNER JOIN roles r
                ON u.role_id = r.role_id

            WHERE
                e.employment_status = 'Active'
                AND r.role_name = 'Delivery Staff'

            ORDER BY e.full_name;
        `;

        const { rows } = await pool.query(query);

        return rows.map((row) => ({
            employeeId: Number(row.employee_id),
            fullName: row.full_name,
        }));
    }

    async assign(
        deliveryId: number,
        payload: AssignDeliveryRequest
    ): Promise<Delivery> {

        const query = `
            UPDATE deliveries
            SET delivery_staff_id = $1
            WHERE delivery_id = $2
            RETURNING delivery_id;
        `;

        const { rows } = await pool.query(query, [
            payload.deliveryStaffId,
            deliveryId,
        ]);

        return (await this.findById(rows[0].delivery_id))!;
    }

    async list(
        filters: DeliveryFilters
    ): Promise<PaginatedDeliveries> {

        const {
            page,
            limit,
            search,
            deliveryDate,
            status,
            customerId,
            milkTypeId,
            deliveryStaffId,
            orderType,
        } = filters;

        const offset = (page - 1) * limit;

        const values: any[] = [];
        const conditions: string[] = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`
                (
                    c.customer_name ILIKE $${values.length}
                    OR CAST(d.delivery_id AS TEXT) ILIKE $${values.length}
                )
            `);
        }

        if (deliveryDate) {
            values.push(deliveryDate);
            conditions.push(`
                d.delivery_date = $${values.length}
            `);
        }

        if (status) {
            values.push(status);
            conditions.push(`
                d.delivery_status = $${values.length}
            `);
        }

        if (customerId) {
            values.push(customerId);
            conditions.push(`
                d.customer_id = $${values.length}
            `);
        }

        if (milkTypeId) {
            values.push(milkTypeId);
            conditions.push(`
                o.milk_type_id = $${values.length}
            `);
        }

        if (deliveryStaffId) {
            values.push(deliveryStaffId);
            conditions.push(`
                d.delivery_staff_id = $${values.length}
            `);
        }

        if (orderType) {
            values.push(orderType);
            conditions.push(`
                o.order_type = $${values.length}
            `);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";
        const countQuery = `
            SELECT COUNT(*)
            FROM deliveries d
            INNER JOIN orders o
                ON d.order_id = o.order_id
            INNER JOIN customers c
                ON d.customer_id = c.customer_id
            ${whereClause};
        `;

        const countResult = await pool.query(
            countQuery,
            values
        );

        const total = Number(
            countResult.rows[0].count
        );

        values.push(limit);
        values.push(offset);

        const query = `
            SELECT
                d.delivery_id,
                d.delivery_date,
                d.scheduled_quantity,
                d.delivery_status,
                d.delivery_staff_id,
                c.customer_name,
                o.order_type,
                o.created_date,
                mt.product_name AS milk_type,
                e.full_name AS delivery_staff_name
            FROM deliveries d
            INNER JOIN orders o
                ON d.order_id = o.order_id
            INNER JOIN customers c
                ON d.customer_id = c.customer_id
            INNER JOIN milk_types mt
                ON o.milk_type_id = mt.milk_type_id
            LEFT JOIN employees e
                ON d.delivery_staff_id = e.employee_id
            ${whereClause}
            ORDER BY
                d.delivery_date DESC,
                d.delivery_id DESC
            LIMIT $${values.length - 1}
            OFFSET $${values.length};
        `;

        const { rows } = await pool.query(
            query,
            values
        );

        return {
            data: rows.map((row) => ({
                deliveryId: row.delivery_id,
                customerName: row.customer_name,
                orderType: row.order_type,
                milkType: row.milk_type,
                scheduledQuantity: Number(row.scheduled_quantity),
                deliveryDate: row.delivery_date,
                deliveryStaffId:
                    row.delivery_staff_id !== null
                        ? Number(row.delivery_staff_id)
                        : null,
                deliveryStaffName:
                    row.delivery_staff_name ?? null,
                deliveryStatus: row.delivery_status,
                createdDate: row.created_date,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}

export const deliveryRepository = new DeliveryRepository();