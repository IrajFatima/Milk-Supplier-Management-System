// src/types/user.types.ts

import type { Role } from "../constants/roles";

export type AccountStatus = "Active" | "Inactive" | "Suspended";

export interface User {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
  accountStatus: AccountStatus;
  employeeId: number | null;
  customerId: number | null;
  roleId: number;
  roleName: Role;
  lastLogin: Date | null;
}

export interface PublicUser {
  userId: number;
  username: string;
  email: string;
  role: Role;
  employeeId: number | null;
  accountStatus: AccountStatus;
  lastLogin: string | null;
}