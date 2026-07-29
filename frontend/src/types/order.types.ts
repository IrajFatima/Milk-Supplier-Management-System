import type {
  BillingCycle,
  BillingModel,
  DeliveryFrequency,
  DeliverySlot,
  OrderStatus,
  OrderType,
  SortOrder,
  OrderSortField,
} from "../constants/order.js";

export interface CreateSubscriptionRequest {
  customerId: number;
  billingModel: Extract<
    BillingModel,
    "Subscription" | "Flat Rate"
  >;
  monthlyFlatRate?: number;
  billingCycle?: BillingCycle;
  proRationApplied?: boolean;
  milkTypeId: number;
  quantity: number;
  deliveryFrequency: DeliveryFrequency;
  deliveryDate?: string;
  deliveryTimePreference: DeliverySlot;
}

export interface UpdateSubscriptionRequest {
  billingModel?: Extract<
    BillingModel,
    "Subscription" | "Flat Rate"
  >;
  monthlyFlatRate?: number;
  billingCycle?: BillingCycle;
  proRationApplied?: boolean;
  milkTypeId?: number;
  quantity?: number;
  deliveryFrequency?: DeliveryFrequency;
  deliveryDate?: string;
  deliveryTimePreference?: DeliverySlot;
  orderStatus?: OrderStatus;
}

export interface CreateOneTimeOrderRequest {
  customerId: number;
  billingModel: Extract<BillingModel, "Per Delivery">;
  milkTypeId: number;
  quantity: number;
  deliveryDate: string;
  deliveryTimePreference: DeliverySlot;
}

export interface UpdateOneTimeOrderRequest {
  billingModel?: Extract<BillingModel, "Per Delivery">;
  milkTypeId?: number;
  quantity?: number;
  deliveryDate?: string;
  deliveryTimePreference?: DeliverySlot;
  orderStatus?: OrderStatus;
}

export interface BulkCreateOrdersRequest {
  orders: CreateOneTimeOrderRequest[];
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: OrderStatus;
  milkTypeId?: number;
  deliveryTimePreference?: DeliverySlot;
  fromDate?: string;
  toDate?: string;
  sortBy?: OrderSortField;
  sortOrder?: SortOrder;
}

export interface PaginatedOrders<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderEntity {
  orderId: number;
  customerId: number;
  orderType: OrderType;
  billingModel: BillingModel;
  monthlyFlatRate: number | null;
  billingCycle: BillingCycle | null;
  proRationApplied: boolean;
  milkTypeId: number;
  quantity: number;
  deliveryFrequency: DeliveryFrequency | null;
  deliveryDate: Date | null;
  deliveryTimePreference: DeliverySlot | null;
  orderStatus: OrderStatus;
  createdDate: Date;
}

export interface OrderListItem extends OrderEntity {
  customerName: string;
  milkTypeName: string;
}
export interface OrderItem extends OrderEntity {
  customerName: string;
  milkTypeName: string;
}

export interface MilkType {
    milkTypeId: number;
    productName: string;
    unit: string;
    defaultUnitPrice: number;
}