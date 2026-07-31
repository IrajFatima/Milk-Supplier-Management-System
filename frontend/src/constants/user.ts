export const ACCOUNT_STATUS = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
} as const;
export const EMPLOYEE_STATUS = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
} as const;

export type AccountStatus =
    (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];
export type EmploymentStatus =
    (typeof EMPLOYEE_STATUS)[keyof typeof EMPLOYEE_STATUS];
