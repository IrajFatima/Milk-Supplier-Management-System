// src/modules/orders/order.repository.ts

import { PoolClient } from "pg";
import { pool } from "../../config/database.js";
import {
    CreateOneTimeOrderRequest,
    CreateSubscriptionRequest,
    MilkType,
    OrderEntity,
    OrderFilters,
    UpdateOneTimeOrderRequest,
    UpdateSubscriptionRequest,
    OrderListItem
} from "../../shared/types/order.types.js";
import { ONE_TIME_ORDER_STATUS, SUBSCRIPTION_STATUS, ORDER_TYPES } from "../../shared/constants/order.js";
import { SYSTEM_CONFIGURATION_KEYS } from "../../shared/constants/config.js";
import { AppError } from "../../shared/errors/AppError.js";

// helper mapper functions //

interface OrderRow {
    order_id: number;
    customer_id: number;
    order_type: string;
    billing_model: string;
    monthly_flat_rate: number | string | null;
    billing_cycle: string | null;
    pro_ration_applied: boolean;
    milk_type_id: number;
    quantity: number | string;
    delivery_frequency: string | null;
    delivery_date: Date | string | null;
    delivery_time_preference: string | null;
    order_status: string;
    created_date: Date | string;

    customer_name?: string;
    milk_type_name?: string;
}

function mapOrder(row: OrderRow): OrderEntity;

function mapOrder(
    row: OrderRow,
    extras: {
        customerName: string;
        milkTypeName: string;
    }
): OrderListItem;

function mapOrder(
    row: OrderRow,
    extras?: {
        customerName: string;
        milkTypeName: string;
    }
): OrderEntity | OrderListItem {
    const order: OrderEntity = {
        orderId: Number(row.order_id),
        customerId: Number(row.customer_id),
        orderType: row.order_type as OrderEntity["orderType"],
        billingModel: row.billing_model as OrderEntity["billingModel"],
        monthlyFlatRate:
            row.monthly_flat_rate !== null
                ? Number(row.monthly_flat_rate)
                : null,
        billingCycle: row.billing_cycle as OrderEntity["billingCycle"],
        proRationApplied: row.pro_ration_applied,
        milkTypeId: Number(row.milk_type_id),
        quantity: Number(row.quantity),
        deliveryFrequency:
            row.delivery_frequency as OrderEntity["deliveryFrequency"],
        deliveryDate: row.delivery_date
            ? new Date(row.delivery_date)
            : null,
        deliveryTimePreference:
            row.delivery_time_preference as OrderEntity["deliveryTimePreference"],
        orderStatus: row.order_status as OrderEntity["orderStatus"],
        createdDate: new Date(row.created_date),
    };
    if (!extras) {
        return order;
    }
    return {
        ...order,
        customerName: extras.customerName,
        milkTypeName: extras.milkTypeName,
    };
}

///////////////////////////////////////////////
class OrderRepository {
    private readonly updateFieldMap: Record<string, string> = {
        billingModel: "billing_model",
        monthlyFlatRate: "monthly_flat_rate",
        billingCycle: "billing_cycle",
        proRationApplied: "pro_ration_applied",
        milkTypeId: "milk_type_id",
        quantity: "quantity",
        deliveryFrequency: "delivery_frequency",
        deliveryDate: "delivery_date",
        deliveryTimePreference: "delivery_time_preference",
        orderStatus: "order_status",
    };

    private readonly sortableColumns: readonly string[] = [
        "created_date",
        "delivery_date",
        "quantity",
        "order_status",
    ];

    async beginTransaction(): Promise<PoolClient> {
        const client = await pool.connect();
        await client.query("BEGIN");
        return client;
    }

    async commit(client: PoolClient): Promise<void> {
        try {
            await client.query("COMMIT");
        } finally {
            client.release();
        }
    }

    async rollback(client: PoolClient): Promise<void> {
        try {
            await client.query("ROLLBACK");
        } finally {
            client.release();
        }
    }

    async customerExists(customerId: number): Promise<boolean> {
        const result = await pool.query(
            `
      SELECT 1
      FROM customers
      WHERE customer_id = $1
        AND account_status = 'Active'
      LIMIT 1
      `,
            [customerId]
        );

        return (result.rowCount ?? 0) > 0;
    }

    async milkTypeExists(milkTypeId: number): Promise<boolean> {
        const result = await pool.query(
            `
      SELECT 1
      FROM milk_types
      WHERE milk_type_id = $1
        AND status = 'Active'
      LIMIT 1
      `,
            [milkTypeId]
        );

        return (result.rowCount ?? 0) > 0;
    }

    async exists(orderId: number): Promise<boolean> {
        const result = await pool.query(
            `
      SELECT 1
      FROM orders
      WHERE order_id = $1
      LIMIT 1
      `,
            [orderId]
        );

        return (result.rowCount ?? 0) > 0;
    }

    async getOrderCutoffTime(): Promise<string | null> {
        const result = await pool.query(
            `
      SELECT config_value
      FROM system_configurations
      WHERE config_key = $1
      `,
            [SYSTEM_CONFIGURATION_KEYS.ORDER_CUTOFF_TIME]
        );

        return result.rows[0]?.config_value ?? null;
    }

    async getById(orderId: number): Promise<OrderEntity | null> {
        const result = await pool.query(
            `
      SELECT *
      FROM orders
      WHERE order_id = $1
      `,
            [orderId]
        );

        return result.rows[0] ? mapOrder(result.rows[0]) : null;
    }

    async getByIdAndType(
        orderId: number,
        orderType: string
    ): Promise<OrderListItem | null> {
        const result = await pool.query(
            `
        SELECT
            o.*,
            c.customer_name,
            mt.product_name AS milk_type_name
        FROM orders o
        INNER JOIN customers c
            ON c.customer_id = o.customer_id
        INNER JOIN milk_types mt
            ON mt.milk_type_id = o.milk_type_id
        WHERE o.order_id = $1
          AND o.order_type = $2
        `,
            [orderId, orderType]
        );

        if (!result.rows[0]) {
            return null;
        }

        return mapOrder(result.rows[0], {
            customerName: result.rows[0].customer_name,
            milkTypeName: result.rows[0].milk_type_name,
        }) as OrderListItem;
    }

    async subscriptionExists(
        customerId: number,
        milkTypeId: number,
        deliveryTimePreference: string,
        deliveryFrequency: string,
        excludeOrderId?: number
    ): Promise<boolean> {
        const result = await pool.query(
            `
        SELECT 1
        FROM orders
        WHERE customer_id = $1
          AND milk_type_id = $2
          AND delivery_time_preference = $3
          AND delivery_frequency = $4
          AND order_type = $5
          AND order_status <> $6
          AND ($7::BIGINT IS NULL OR order_id <> $7)
        LIMIT 1
        `,
            [
                customerId,
                milkTypeId,
                deliveryTimePreference,
                deliveryFrequency,
                ORDER_TYPES.SUBSCRIPTION,
                SUBSCRIPTION_STATUS.CANCELLED,
                excludeOrderId ?? null,
            ]
        );

        return (result.rowCount ?? 0) > 0;
    }

    async createSubscription(
        data: CreateSubscriptionRequest,
        client?: PoolClient
    ): Promise<OrderEntity> {
        const db = client ?? pool;

        const result = await db.query(
            `
    INSERT INTO orders (
      customer_id,
      order_type,
      billing_model,
      monthly_flat_rate,
      billing_cycle,
      pro_ration_applied,
      milk_type_id,
      quantity,
      delivery_frequency,
      delivery_date,
      delivery_time_preference,
      order_status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    )
    RETURNING *
    `,
            [
                data.customerId,
                ORDER_TYPES.SUBSCRIPTION,
                data.billingModel,
                data.monthlyFlatRate ?? null,
                data.billingCycle ?? null,
                data.proRationApplied ?? false,
                data.milkTypeId,
                data.quantity,
                data.deliveryFrequency,
                data.deliveryDate ?? null,
                data.deliveryTimePreference,
                SUBSCRIPTION_STATUS.ACTIVE,
            ]
        );

        return mapOrder(result.rows[0]);
    }

    async createOrder(
        data: CreateOneTimeOrderRequest,
        client?: PoolClient
    ): Promise<OrderEntity> {
        const db = client ?? pool;

        const result = await db.query(
            `
    INSERT INTO orders (
      customer_id,
      order_type,
      billing_model,
      milk_type_id,
      quantity,
      delivery_date,
      delivery_time_preference,
      order_status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8
    )
    RETURNING *
    `,
            [
                data.customerId,
                ORDER_TYPES.ONE_TIME,
                data.billingModel,
                data.milkTypeId,
                data.quantity,
                data.deliveryDate,
                data.deliveryTimePreference,
                ONE_TIME_ORDER_STATUS.SCHEDULED,
            ]
        );

        return mapOrder(result.rows[0]);
    }

    async bulkCreateOrders(
        orders: CreateOneTimeOrderRequest[],
        client: PoolClient
    ): Promise<OrderEntity[]> {
        const createdOrders: OrderEntity[] = [];

        for (const order of orders) {
            const created = await this.createOrder(order, client);
            createdOrders.push(created);
        }

        return createdOrders;
    }

    async updateOrder(
        orderId: number,
        updates: Partial<UpdateSubscriptionRequest & UpdateOneTimeOrderRequest>,
        client?: PoolClient
    ): Promise<OrderEntity> {
        const db = client ?? pool;

        const setClauses: string[] = [];
        const values: unknown[] = [];

        Object.entries(updates).forEach(([key, value]) => {
            const dbColumn = this.updateFieldMap[key];
            if (value !== undefined && dbColumn) {
                values.push(value);
                setClauses.push(`${dbColumn} = $${values.length}`);
            }
        });

        if (setClauses.length === 0) {
            throw new AppError(400, "No fields provided for update.");
        }

        values.push(orderId);

        const result = await db.query(
            `
    UPDATE orders
    SET
      ${setClauses.join(", ")}
    WHERE order_id = $${values.length}
    RETURNING *
    `,
            values
        );

        return mapOrder(result.rows[0]);
    }

    async updateSubscription(
        orderId: number,
        updates: UpdateSubscriptionRequest,
        client?: PoolClient
    ): Promise<OrderEntity> {
        return this.updateOrder(orderId, updates as unknown as Partial<UpdateSubscriptionRequest & UpdateOneTimeOrderRequest>, client);
    }

    async updateOneTimeOrder(
        orderId: number,
        updates: UpdateOneTimeOrderRequest,
        client?: PoolClient
    ): Promise<OrderEntity> {
        return this.updateOrder(orderId, updates as unknown as Partial<UpdateSubscriptionRequest & UpdateOneTimeOrderRequest>, client);
    }

    async cancelOrder(
        orderId: number,
        client?: PoolClient
    ): Promise<OrderEntity> {
        const db = client ?? pool;

        const result = await db.query(
            `
    UPDATE orders
    SET
      order_status = $1
    WHERE order_id = $2
    RETURNING *
    `,
            [
                ONE_TIME_ORDER_STATUS.CANCELLED,
                orderId,
            ]
        );

        return mapOrder(result.rows[0]);
    }

    async listSubscriptions(filters: OrderFilters): Promise<OrderListItem[]> {
        return this.listByType(filters, ORDER_TYPES.SUBSCRIPTION);
    }

    async countSubscriptions(filters: OrderFilters): Promise<number> {
        return this.countByType(filters, ORDER_TYPES.SUBSCRIPTION);
    }

    async listOrders(filters: OrderFilters): Promise<OrderListItem[]> {
        return this.listByType(filters, ORDER_TYPES.ONE_TIME);
    }

    async countOrders(filters: OrderFilters): Promise<number> {
        return this.countByType(filters, ORDER_TYPES.ONE_TIME);
    }

    private buildFilterQuery(
        filters: OrderFilters,
        orderType: string,
        isCountQuery = false
    ): { whereClause: string; values: unknown[]; orderByClause: string; limitOffsetClause: string } {
        const {
            page = 1,
            limit = 10,
            search,
            orderStatus,
            milkTypeId,
            deliveryTimePreference,
            fromDate,
            toDate,
            sortBy = "created_date",
            sortOrder = "DESC",
        } = filters;

        const values: unknown[] = [orderType];
        const where: string[] = [`o.order_type = $${values.length}`];

        if (search) {
            values.push(`%${search}%`);
            where.push(`c.customer_name ILIKE $${values.length}`);
        }

        if (orderStatus) {
            values.push(orderStatus);
            where.push(`o.order_status = $${values.length}`);
        }

        if (milkTypeId) {
            values.push(milkTypeId);
            where.push(`o.milk_type_id = $${values.length}`);
        }

        if (deliveryTimePreference) {
            values.push(deliveryTimePreference);
            where.push(`o.delivery_time_preference = $${values.length}`);
        }

        if (fromDate) {
            values.push(fromDate);
            where.push(`o.delivery_date >= $${values.length}`);
        }

        if (toDate) {
            values.push(toDate);
            where.push(`o.delivery_date <= $${values.length}`);
        }

        const whereClause = where.join(" AND ");

        if (isCountQuery) {
            return {
                whereClause,
                values,
                orderByClause: "",
                limitOffsetClause: "",
            };
        }

        const orderColumn = this.sortableColumns.includes(sortBy) ? sortBy : "created_date";
        const cleanSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
        const orderByClause = `ORDER BY o.${orderColumn} ${cleanSortOrder}`;

        values.push(limit);
        const limitPlaceholder = `$${values.length}`;
        values.push((page - 1) * limit);
        const offsetPlaceholder = `$${values.length}`;

        const limitOffsetClause = `LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`;

        return {
            whereClause,
            values,
            orderByClause,
            limitOffsetClause,
        };
    }

    private async listByType(
        filters: OrderFilters,
        orderType: string
    ): Promise<OrderListItem[]> {
        const {
            whereClause,
            values,
            orderByClause,
            limitOffsetClause,
        } = this.buildFilterQuery(
            filters,
            orderType,
            false
        );

        const result = await pool.query(
            `
        SELECT
            o.*,
            c.customer_name,
            mt.product_name AS milk_type_name
        FROM orders o
        JOIN customers c
            ON c.customer_id = o.customer_id
        JOIN milk_types mt
            ON mt.milk_type_id = o.milk_type_id
        WHERE ${whereClause}
        ${orderByClause}
        ${limitOffsetClause}
        `,
            values
        );

        return result.rows.map(row =>
            mapOrder(row, {
                customerName: row.customer_name,
                milkTypeName: row.milk_type_name,
            })
        ) as OrderListItem[];
    }

    private async countByType(
        filters: OrderFilters,
        orderType: string
    ): Promise<number> {
        const { whereClause, values } = this.buildFilterQuery(
            filters,
            orderType,
            true
        );

        const result = await pool.query(
            `
        SELECT COUNT(*)::INTEGER AS total
        FROM orders o
        JOIN customers c
            ON c.customer_id = o.customer_id
        WHERE ${whereClause}
        `,
            values
        );

        return result.rows[0]?.total ?? 0;
    }
    async getMilkTypes(): Promise<
        MilkType[]
    > {
        const result = await pool.query(
            `
        SELECT
            milk_type_id AS "milkTypeId",
            product_name AS "productName",
            unit,
            default_unit_price AS "defaultUnitPrice"
        FROM milk_types
        WHERE status = 'Active'
        ORDER BY product_name ASC
        `
        );

        return result.rows;
    }
    async updateOrderStatus(
        orderId: number,
        status: string,
        client?: PoolClient
    ): Promise<OrderEntity> {
        const db = client ?? pool;

        const result = await db.query(
            `
        UPDATE orders
        SET order_status = $1
        WHERE order_id = $2
        RETURNING *
        `,
            [status, orderId]
        );

        if (!result.rows[0]) {
            throw new AppError(404, "Order not found.");
        }

        return mapOrder(result.rows[0]);
    }
}

export const orderRepository = new OrderRepository();