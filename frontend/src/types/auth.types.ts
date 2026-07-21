// src/types/auth.types.ts

import type { PublicUser } from "./user.types";
import type { Role } from "../constants/roles";

export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface LoginResponseFromBackend {
    success: boolean;
    message: string
    data: {
        token: string;
        user: PublicUser;
    };
}
export interface LoginResponse {
    token: string;
    user: PublicUser;
}

export interface CurrentUserResponse {
    user: PublicUser;
}
export interface CurrentUserResponseFromBackend {
    success: boolean;
    message: string
    data: {
        user: PublicUser;
    };
}

export interface LogoutResponse {
    success: boolean;
    message: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

export interface JwtPayload {
    userId: number;
    username: string;
    role: Role;
    employeeId: number | null;
}

export interface LoginFormData {
    usernameOrEmail: string;
    password: string;
}