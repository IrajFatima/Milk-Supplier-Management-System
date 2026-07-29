import api from "./api";

import type {
  CreateOneTimeOrderRequest,
  CreateSubscriptionRequest,
  MilkType,
  OrderEntity,
  OrderFilters,
  OrderListItem,
  PaginatedOrders,
  UpdateOneTimeOrderRequest,
  UpdateSubscriptionRequest,
  OrderItem
} from "../types/order.types";


export interface CustomerOption {
  customerId: number;
  customerName: string;
}


export const orderService = {

  async getSubscriptions(
    filters: OrderFilters
  ): Promise<PaginatedOrders<OrderListItem>> {
    const response = await api.get("/orders/subscriptions", {
      params: filters,
    });

    return response.data.data;
  },

  async getSubscription(id: number): Promise<OrderItem> {
    const response = await api.get(`/orders/subscriptions/${id}`);

    return response.data.data.order;
  },

  async createSubscription(
    data: CreateSubscriptionRequest
  ): Promise<OrderEntity> {
    const response = await api.post("/orders/subscriptions", data);

    return response.data.data.order;
  },

  async updateSubscription(
    id: number,
    data: UpdateSubscriptionRequest
  ): Promise<OrderEntity> {
    const response = await api.put(`/orders/subscriptions/${id}`, data);

    return response.data.data.order;
  },

  async cancelSubscription(id: number): Promise<void> {
    await api.patch(`/orders/subscriptions/${id}/cancel`);
  },
  async changeSubscriptionStatus(
    id: number,
    status: string
  ): Promise<OrderEntity> {
    const response = await api.patch(
      `/orders/subscriptions/${id}/status`,
      { status }
    );

    return response.data.data.order;
  },

  async reactivateSubscription(
    id: number
  ): Promise<OrderEntity> {
    const response = await api.patch(
      `/orders/subscriptions/${id}/reactivate`
    );

    return response.data.data.order;
  },

  // =====================================================
  // One-Time Orders
  // =====================================================

  async getOrders(
    filters: OrderFilters
  ): Promise<PaginatedOrders<OrderListItem>> {
    const response = await api.get("/orders/one-time", {
      params: filters,
    });

    return response.data.data;
  },

  async getOrder(id: number): Promise<OrderItem> {
    const response = await api.get(`/orders/one-time/${id}`);

    return response.data.data.order;
  },

  async createOrder(
    data: CreateOneTimeOrderRequest
  ): Promise<OrderEntity> {
    const response = await api.post("/orders/one-time", data);

    return response.data.data.order;
  },

  async updateOrder(
    id: number,
    data: UpdateOneTimeOrderRequest
  ): Promise<OrderEntity> {
    const response = await api.put(`/orders/one-time/${id}`, data);

    return response.data.data.order;
  },

  async cancelOrder(id: number): Promise<void> {
    await api.patch(`/orders/one-time/${id}/cancel`);
  },

  async changeOrderStatus(
    id: number,
    status: string
  ): Promise<OrderEntity> {
    const response = await api.patch(
      `/orders/one-time/${id}/status`,
      { status }
    );

    return response.data.data.order;
  },

  async reactivateOrder(
    id: number
  ): Promise<OrderEntity> {
    const response = await api.patch(
      `/orders/one-time/${id}/reactivate`
    );

    return response.data.data.order;
  },

  /** Backend expects a flat array, NOT { orders: [...] }. Response returns { data: { orders: OrderEntity[] } }. */
  async bulkCreateOrders(
    data: CreateOneTimeOrderRequest[]
  ): Promise<OrderEntity[]> {
    const response = await api.post("/orders/one-time/bulk", data);

    return response.data.data.orders;
  },

  async getMilkTypes(): Promise<MilkType[]> {
    const response = await api.get("/orders/milk-types");

    return response.data.data.milkTypes;
  }
}
