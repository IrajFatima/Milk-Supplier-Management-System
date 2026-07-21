import { Request } from "express";
import { PublicUser } from "./user.types.js";
import { Role } from "../constants/roles.js";

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: PublicUser;
}

export interface JwtPayload {
  userId: number;
  username: string;
  role: Role;
  employeeId: number | null;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}