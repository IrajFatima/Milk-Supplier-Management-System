import { ROLES, type Role } from "./roles";

export interface NavigationItem {
  title: string;
  path: string;
  roles: Role[];
}

export const navigationItems: NavigationItem[] = [
  // =========================
  // Dashboards
  // =========================
  {
    title: "Dashboard",
    path: "/owner/dashboard",
    roles: [ROLES.OWNER],
  },
  {
    title: "Dashboard",
    path: "/farm/dashboard",
    roles: [ROLES.FARM_WORKER],
  },
  {
    title: "Dashboard",
    path: "/delivery/dashboard",
    roles: [ROLES.DELIVERY_STAFF],
  },
  {
    title: "Dashboard",
    path: "/accountant/dashboard",
    roles: [ROLES.ACCOUNTANT],
  },
  {
    title: "Dashboard",
    path: "/administrator/dashboard",
    roles: [ROLES.SYSTEM_ADMINISTRATOR],
  },
  {
    title: "Dashboard",
    path: "/customer/dashboard",
    roles: [ROLES.CUSTOMER],
  },

  // =========================
  // MVP Modules
  // =========================

  {
    title: "Animals",
    path: "/animals",
    roles: [
      ROLES.OWNER,
      ROLES.FARM_WORKER,
    ],
  },

  {
    title: "Production",
    path: "/production",
    roles: [
      ROLES.OWNER,
      ROLES.FARM_WORKER,
      ROLES.ACCOUNTANT,
    ],
  },

  {
    title: "Customers",
    path: "/customers",
    roles: [
      ROLES.OWNER,
      ROLES.DELIVERY_STAFF,
      ROLES.ACCOUNTANT,
      ROLES.CUSTOMER,
    ],
  },

  {
    title: "Deliveries",
    path: "/deliveries",
    roles: [
      ROLES.OWNER,
      ROLES.DELIVERY_STAFF,
      ROLES.ACCOUNTANT,
    ],
  },

  {
    title: "Billing",
    path: "/billing",
    roles: [
      ROLES.OWNER,
      ROLES.DELIVERY_STAFF,
      ROLES.ACCOUNTANT,
      ROLES.CUSTOMER,
    ],
  },

  // ==========================================================
  // Future Modules (Should Have / Nice to Have)
  // Uncomment as the corresponding features are implemented.
  // ==========================================================

  /*
  {
    title: "Users",
    path: "/users",
    roles: [
      ROLES.OWNER,
      ROLES.SYSTEM_ADMINISTRATOR,
    ],
  },

  {
    title: "Employees",
    path: "/employees",
    roles: [
      ROLES.OWNER,
      ROLES.ACCOUNTANT,
      ROLES.SYSTEM_ADMINISTRATOR,
    ],
  },

  {
    title: "Health",
    path: "/health",
    roles: [
      ROLES.OWNER,
      ROLES.FARM_WORKER,
    ],
  },

  {
    title: "Inventory",
    path: "/inventory",
    roles: [
      ROLES.OWNER,
      ROLES.FARM_WORKER,
      ROLES.DELIVERY_STAFF,
      ROLES.ACCOUNTANT,
    ],
  },

  {
    title: "Expenses",
    path: "/expenses",
    roles: [
      ROLES.OWNER,
      ROLES.FARM_WORKER,
      ROLES.ACCOUNTANT,
    ],
  },

  {
    title: "Reports",
    path: "/reports",
    roles: [
      ROLES.OWNER,
      ROLES.FARM_WORKER,
      ROLES.DELIVERY_STAFF,
      ROLES.ACCOUNTANT,
      ROLES.CUSTOMER,
    ],
  },

  {
    title: "Notifications",
    path: "/notifications",
    roles: [
      ROLES.OWNER,
      ROLES.FARM_WORKER,
      ROLES.DELIVERY_STAFF,
      ROLES.ACCOUNTANT,
      ROLES.CUSTOMER,
      ROLES.SYSTEM_ADMINISTRATOR,
    ],
  },

  {
    title: "Audit Logs",
    path: "/audit-logs",
    roles: [
      ROLES.OWNER,
      ROLES.ACCOUNTANT,
      ROLES.SYSTEM_ADMINISTRATOR,
    ],
  },

  {
    title: "System",
    path: "/system",
    roles: [
      ROLES.OWNER,
      ROLES.SYSTEM_ADMINISTRATOR,
    ],
  },
  */
];