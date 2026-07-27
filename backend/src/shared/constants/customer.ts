export const CUSTOMER_TYPE = {
  B2C: "B2C",
  B2B: "B2B",
} as const;

export const CUSTOMER_TYPE_OPTIONS = Object.values(CUSTOMER_TYPE);

export type CustomerType =
  (typeof CUSTOMER_TYPE)[keyof typeof CUSTOMER_TYPE];

export const PAYMENT_MODEL = {
  PREPAID: "Prepaid",
  POSTPAID: "Postpaid",
} as const;

export const PAYMENT_MODEL_OPTIONS = Object.values(PAYMENT_MODEL);

export type PaymentModel =
  (typeof PAYMENT_MODEL)[keyof typeof PAYMENT_MODEL];

export const CUSTOMER_ACCOUNT_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
} as const;

export const CUSTOMER_ACCOUNT_STATUS_OPTIONS = Object.values(
  CUSTOMER_ACCOUNT_STATUS
);

export type CustomerAccountStatus =
  (typeof CUSTOMER_ACCOUNT_STATUS)[keyof typeof CUSTOMER_ACCOUNT_STATUS];
