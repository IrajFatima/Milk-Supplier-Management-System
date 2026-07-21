export const ROLES = {
  OWNER: "Owner",
  SYSTEM_ADMINISTRATOR: "System Administrator",
  ACCOUNTANT: "Accountant",
  FARM_WORKER: "Farm Worker",
  DELIVERY_STAFF: "Delivery Staff",
  CUSTOMER: "Customer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const MVP_ROLES: ReadonlyArray<Role> = [
  ROLES.OWNER,
  ROLES.ACCOUNTANT,
  ROLES.FARM_WORKER,
  ROLES.DELIVERY_STAFF,
];