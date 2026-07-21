// src/constants/roles.ts

export const ROLES = {
  OWNER: "Owner",
  FARM_WORKER: "Farm Worker",
  DELIVERY_STAFF: "Delivery Staff",
  ACCOUNTANT: "Accountant",
  SYSTEM_ADMINISTRATOR: "System Administrator",
  CUSTOMER: "Customer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
