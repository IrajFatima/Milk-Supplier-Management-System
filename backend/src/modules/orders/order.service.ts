// src/modules/orders/order.service.ts
import { AppError } from "../../shared/errors/AppError.js";
import { orderRepository } from "./order.repository.js";
import { deliveryService } from "../deliveries/delivery.service.js";
import {
    CreateSubscriptionRequest,
    CreateOneTimeOrderRequest,
    UpdateSubscriptionRequest,
    UpdateOneTimeOrderRequest,
    OrderFilters,
    PaginatedOrders,
    OrderEntity,
    OrderListItem,
    MilkType,
} from "../../shared/types/order.types.js";
import { BILLING_MODELS, ONE_TIME_ORDER_STATUS, SUBSCRIPTION_STATUS, ORDER_TYPES, OrderStatus } from "../../shared/constants/order.js";
import { validateOrderCutoffTime, validateDeliveryDate } from "./helpers/cutoff.helper.js";

export class OrderService {
    // =====================================================
    // Subscription
    // =====================================================

    async createSubscription(payload: CreateSubscriptionRequest): Promise<OrderEntity> {
        await this.validateCustomer(payload.customerId);
        await this.validateMilkType(payload.milkTypeId);
        this.validateQuantity(payload.quantity);
        this.validateBillingModel(payload.billingModel, payload.monthlyFlatRate, payload.billingCycle);
        await this.validateSubscriptionDuplicate(
            payload.customerId,
            payload.milkTypeId,
            payload.deliveryTimePreference,
            payload.deliveryFrequency
        );

        return orderRepository.createSubscription(payload);
    }

    async updateSubscription(
        orderId: number,
        payload: UpdateSubscriptionRequest
    ): Promise<OrderEntity> {
        await this.validateCutoff();
        const subscription = await this.getSubscription(orderId);

        if (subscription.orderStatus === SUBSCRIPTION_STATUS.CANCELLED) {
            throw new AppError(400, "Cancelled subscriptions cannot be updated.");
        }

        if (payload.quantity !== undefined) {
            this.validateQuantity(payload.quantity);
        }

        if (payload.milkTypeId !== undefined) {
            await this.validateMilkType(payload.milkTypeId);
        }

        const mergedBillingModel = payload.billingModel ?? subscription.billingModel;
        const mergedMonthlyFlatRate = payload.monthlyFlatRate !== undefined ? payload.monthlyFlatRate : subscription.monthlyFlatRate;
        const mergedBillingCycle = payload.billingCycle !== undefined ? payload.billingCycle : subscription.billingCycle;

        this.validateBillingModel(
            mergedBillingModel,
            mergedMonthlyFlatRate ?? undefined,
            mergedBillingCycle ?? undefined
        );

        const customerId = subscription.customerId;
        const milkTypeId = payload.milkTypeId ?? subscription.milkTypeId;
        const deliveryTimePreference = payload.deliveryTimePreference ?? subscription.deliveryTimePreference;
        const deliveryFrequency = payload.deliveryFrequency ?? subscription.deliveryFrequency;

        await this.validateSubscriptionDuplicate(
            customerId,
            milkTypeId,
            deliveryTimePreference!,
            deliveryFrequency!,
            orderId
        );

        return orderRepository.updateOrder(
            orderId,
            payload as unknown as Partial<UpdateSubscriptionRequest & UpdateOneTimeOrderRequest>
        );
    }

    async cancelSubscription(orderId: number): Promise<OrderEntity> {
        await this.validateCutoff();
        const subscription = await this.getSubscription(orderId);

        if (subscription.orderStatus === SUBSCRIPTION_STATUS.CANCELLED) {
            throw new AppError(400, "Subscription is already cancelled.");
        }

        return orderRepository.cancelOrder(orderId);
    }

    async getSubscriptionById(orderId: number): Promise<OrderEntity> {
        return this.getSubscription(orderId);
    }

    async listSubscriptions(filters: OrderFilters): Promise<PaginatedOrders<OrderListItem>> {
        const [orders, total] = await Promise.all([
            orderRepository.listSubscriptions(filters),
            orderRepository.countSubscriptions(filters),
        ]);

        return {
            data: orders as OrderListItem[],
            total,
            page: filters.page ?? 1,
            limit: filters.limit ?? 10,
        };
    }

    // =====================================================
    // One-Time Orders
    // =====================================================

    async createOrder(payload: CreateOneTimeOrderRequest): Promise<OrderEntity> {
        await this.validateCustomer(payload.customerId);
        await this.validateMilkType(payload.milkTypeId);
        this.validateQuantity(payload.quantity);

        // BR-OM-204: Validate delivery date (not past, not today after cutoff)
        await this.validateOneTimeDeliveryDate(payload.deliveryDate);

        const order = await orderRepository.createOrder(payload);

        await deliveryService.create({
            orderId: order.orderId,
            customerId: order.customerId,
            deliveryDate: order.deliveryDate!,
            scheduledQuantity: order.quantity,
        });

        return order;
    }

    async bulkCreateOrders(payload: CreateOneTimeOrderRequest[]): Promise<OrderEntity[]> {
        const client = await orderRepository.beginTransaction();
        try {
            for (const order of payload) {
                await this.validateCustomer(order.customerId);
                await this.validateMilkType(order.milkTypeId);
                this.validateQuantity(order.quantity);
                // BR-OM-204: Validate delivery date for each order
                await this.validateOneTimeDeliveryDate(order.deliveryDate);
            }
            const created = await orderRepository.bulkCreateOrders(payload, client);

            await deliveryService.createMany(
                created.map((order) => ({
                    orderId: order.orderId,
                    customerId: order.customerId,
                    deliveryDate: order.deliveryDate!,
                    scheduledQuantity: order.quantity,
                }))
            );

            await orderRepository.commit(client);

            return created;
        } catch (error) {
            await orderRepository.rollback(client);
            throw error;
        }
    }

    async updateOrder(orderId: number, payload: UpdateOneTimeOrderRequest): Promise<OrderEntity> {
        await this.validateCutoff();
        const order = await this.getOrder(orderId);

        if (order.orderStatus === ONE_TIME_ORDER_STATUS.CANCELLED) {
            throw new AppError(400, "Cancelled orders cannot be updated.");
        }

        if (payload.quantity !== undefined) {
            this.validateQuantity(payload.quantity);
        }

        if (payload.milkTypeId !== undefined) {
            await this.validateMilkType(payload.milkTypeId);
        }

        // BR-OM-204: Validate delivery date if being updated
        if (payload.deliveryDate !== undefined) {
            await this.validateOneTimeDeliveryDate(payload.deliveryDate);
        }

        return orderRepository.updateOrder(
            orderId,
            payload as unknown as Partial<UpdateSubscriptionRequest & UpdateOneTimeOrderRequest>
        );
    }

    async cancelOrder(orderId: number): Promise<OrderEntity> {
        await this.validateCutoff();
        const order = await this.getOrder(orderId);

        if (order.orderStatus === ONE_TIME_ORDER_STATUS.CANCELLED) {
            throw new AppError(400, "Order is already cancelled.");
        }

        return orderRepository.cancelOrder(orderId);
    }

    async getOrderById(orderId: number): Promise<OrderEntity> {
        return this.getOrder(orderId);
    }

    async listOrders(filters: OrderFilters): Promise<PaginatedOrders<OrderListItem>> {
        const [orders, total] = await Promise.all([
            orderRepository.listOrders(filters),
            orderRepository.countOrders(filters),
        ]);

        return {
            data: orders as OrderListItem[],
            total,
            page: filters.page ?? 1,
            limit: filters.limit ?? 10,
        };
    }
    async getMilkTypes(): Promise<MilkType[]> {
        return orderRepository.getMilkTypes();
    }

    async changeOrderStatus(
        orderId: number,
        status: OrderStatus
    ): Promise<OrderEntity> {
        await this.validateCutoff();

        const order = await orderRepository.getById(orderId);

        if (!order) {
            throw new AppError(404, "Order not found.");
        }

        if (order.orderType === ORDER_TYPES.SUBSCRIPTION) {
            if (
                !Object.values(SUBSCRIPTION_STATUS).includes(
                    status as (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS]
                )
            ) {
                throw new AppError(
                    400,
                    "Invalid status for subscription."
                );
            }

            if (status === SUBSCRIPTION_STATUS.CANCELLED) {
                throw new AppError(
                    400,
                    "Use the cancel endpoint to cancel a subscription."
                );
            }

            if (order.orderStatus === SUBSCRIPTION_STATUS.CANCELLED) {
                throw new AppError(
                    400,
                    "Cancelled subscriptions cannot change status. Reactivate first."
                );
            }
        } else {
            if (
                !Object.values(ONE_TIME_ORDER_STATUS).includes(
                    status as (typeof ONE_TIME_ORDER_STATUS)[keyof typeof ONE_TIME_ORDER_STATUS]
                )
            ) {
                throw new AppError(
                    400,
                    "Invalid status for one-time order."
                );
            }

            if (status === ONE_TIME_ORDER_STATUS.CANCELLED) {
                throw new AppError(
                    400,
                    "Use the cancel endpoint to cancel an order."
                );
            }

            if (order.orderStatus === ONE_TIME_ORDER_STATUS.CANCELLED) {
                throw new AppError(
                    400,
                    "Cancelled orders cannot change status. Reactivate first."
                );
            }
        }

        return orderRepository.updateOrderStatus(orderId, status);
    }

    async reactivateOrder(orderId: number): Promise<OrderEntity> {
        await this.validateCutoff();

        const order = await orderRepository.getById(orderId);

        if (!order) {
            throw new AppError(404, "Order not found.");
        }

        let newStatus: OrderStatus;

        if (order.orderType === ORDER_TYPES.SUBSCRIPTION) {
            if (order.orderStatus !== SUBSCRIPTION_STATUS.CANCELLED) {
                throw new AppError(
                    400,
                    "Only cancelled subscriptions can be reactivated."
                );
            }

            newStatus = SUBSCRIPTION_STATUS.ACTIVE;
        } else {
            if (order.orderStatus !== ONE_TIME_ORDER_STATUS.CANCELLED) {
                throw new AppError(
                    400,
                    "Only cancelled orders can be reactivated."
                );
            }

            newStatus = ONE_TIME_ORDER_STATUS.PENDING;
        }

        return orderRepository.updateOrderStatus(orderId, newStatus);
    }
    // =====================================================
    // Private Helpers
    // =====================================================

    private async validateCustomer(customerId: number): Promise<void> {
        const exists = await orderRepository.customerExists(customerId);
        if (!exists) {
            throw new AppError(404, "Customer not found.");
        }
    }

    private async validateMilkType(milkTypeId: number): Promise<void> {
        const exists = await orderRepository.milkTypeExists(milkTypeId);
        if (!exists) {
            throw new AppError(404, "Milk type not found.");
        }
    }

    private validateQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new AppError(400, "Quantity must be greater than 0.");
        }
    }

    private validateBillingModel(
        billingModel: string,
        monthlyFlatRate?: number,
        billingCycle?: string
    ): void {
        if (billingModel === BILLING_MODELS.FLAT_RATE || billingModel === "Flat Rate") {
            if (!monthlyFlatRate || monthlyFlatRate <= 0) {
                throw new AppError(400, "Flat Rate requires monthlyFlatRate.");
            }
            if (!billingCycle) {
                throw new AppError(400, "Flat Rate requires billingCycle.");
            }
        }
    }

    private async validateCutoff(): Promise<void> {
        const cutoff = await orderRepository.getOrderCutoffTime();
        validateOrderCutoffTime(cutoff!);
    }

    private async validateOneTimeDeliveryDate(deliveryDate: string): Promise<void> {
        const cutoff = await orderRepository.getOrderCutoffTime();
        validateDeliveryDate(deliveryDate, cutoff);
    }

    private async getSubscription(orderId: number): Promise<OrderEntity> {
        const subscription = await orderRepository.getByIdAndType(
            orderId,
            ORDER_TYPES.SUBSCRIPTION
        );
        if (!subscription) {
            throw new AppError(404, "Subscription not found.");
        }
        return subscription;
    }

    private async getOrder(orderId: number): Promise<OrderEntity> {
        const order = await orderRepository.getByIdAndType(orderId, ORDER_TYPES.ONE_TIME);
        if (!order) {
            throw new AppError(404, "Order not found.");
        }
        return order;
    }

    private async validateSubscriptionDuplicate(
        customerId: number,
        milkTypeId: number,
        deliveryTimePreference: string,
        deliveryFrequency: string,
        excludeOrderId?: number
    ): Promise<void> {
        const duplicate = await orderRepository.subscriptionExists(
            customerId,
            milkTypeId,
            deliveryTimePreference,
            deliveryFrequency,
            excludeOrderId
        );
        if (duplicate) {
            throw new AppError(409, "An active subscription already exists with these details.");
        }
    }

}

export const orderService = new OrderService();