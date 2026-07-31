// src/shared/constants/order.ts

export const ORDER_TYPES = {
  SUBSCRIPTION: "Subscription",
  ONE_TIME: "One-Time",
} as const;

export const ORDER_TYPE_OPTIONS = Object.values(ORDER_TYPES);

export const BILLING_MODELS = {
  SUBSCRIPTION: "Subscription",
  PER_DELIVERY: "Per Delivery",
  FLAT_RATE: "Flat Rate",
} as const;

export const BILLING_CYCLES = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUAL: "Annual",
} as const;

export const DELIVERY_SLOTS = {
  MORNING: "Morning",
  EVENING: "Evening",
} as const;

export const DELIVERY_FREQUENCIES = {
  DAILY: "Daily",
  ALTERNATE_DAYS: "Alternate Days",
  WEEKLY: "Weekly",
  SELECTED_DAYS: "Selected Days",
} as const;

/* =====================================================
   Subscription Statuses
   ===================================================== */

export const SUBSCRIPTION_STATUS = {
  PENDING: "Pending",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
} as const;

/* =====================================================
   One-Time Order Statuses
   ===================================================== */

export const ONE_TIME_ORDER_STATUS = {
  PENDING: "Pending",
  SCHEDULED: "Scheduled",
  LOCKED: "Locked",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

/* ===================================================== */

export const SORT_ORDER = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

export const ORDER_SORT_FIELDS = {
  CREATED_DATE: "created_date",
  DELIVERY_DATE: "delivery_date",
  QUANTITY: "quantity",
  ORDER_STATUS: "order_status",
} as const;



export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;


/* =====================================================
   Types
   ===================================================== */

export type OrderType =
  (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];

export type BillingModel =
  (typeof BILLING_MODELS)[keyof typeof BILLING_MODELS];

export type BillingCycle =
  (typeof BILLING_CYCLES)[keyof typeof BILLING_CYCLES];

export type DeliverySlot =
  (typeof DELIVERY_SLOTS)[keyof typeof DELIVERY_SLOTS];

export type DeliveryFrequency =
  (typeof DELIVERY_FREQUENCIES)[keyof typeof DELIVERY_FREQUENCIES];

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export type OneTimeOrderStatus =
  (typeof ONE_TIME_ORDER_STATUS)[keyof typeof ONE_TIME_ORDER_STATUS];

export type OrderStatus =
  | SubscriptionStatus
  | OneTimeOrderStatus;

export type SortOrder =
  (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export type OrderSortField =
  (typeof ORDER_SORT_FIELDS)[keyof typeof ORDER_SORT_FIELDS];