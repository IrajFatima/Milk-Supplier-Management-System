//  src/types/user.types.ts
import type { Role } from "../constants/roles.js";
import type { AccountStatus, EmploymentStatus } from "../constants/user.js";

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
  lastLogin: Date | null;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roleId: number;
  fullName: string;
  contactNumber?: string;
  jobTitle?: string;
  department?: string;
  hireDate: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  roleId?: number;
  fullName?: string;
  contactNumber?: string;
  jobTitle?: string;
  department?: string;
  hireDate?: string;
}

export interface UserFilters {
  page: number;
  limit: number;
  search?: string;
  roleId?: number;
  accountStatus?: AccountStatus;
}

export interface UserListItem {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  roleId: number;
  roleName: Role;
  department: string | null;
  jobTitle: string | null;
  accountStatus: AccountStatus;
  employmentStatus: EmploymentStatus;
}

export interface UserDetails {
  userId: number;
  username: string;
  email: string;
  roleId: number;
  roleName: Role;
  accountStatus: AccountStatus;
  lastLogin: Date | null;
  employeeId: number;
  fullName: string;
  contactNumber: string | null;
  emailAddress: string | null;
  jobTitle: string | null;
  department: string | null;
  hireDate: Date | null;
  employmentStatus: EmploymentStatus;
}

export interface PaginatedUsers {
  data: UserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserRole {
  roleId: number;
  roleName: Role;
}