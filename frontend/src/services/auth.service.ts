// src/services/auth.service.ts

import api from "./api";
import type {
    CurrentUserResponse,
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    LoginResponseFromBackend,
    CurrentUserResponseFromBackend,
    ChangePasswordRequest,
    ChangePasswordResponse,
} from "../types/auth.types";

class AuthService {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponseFromBackend>(
            "/auth/login",
            credentials
        );
        console.log("response from login: ", response)
        return response.data.data;
    }

    async getCurrentUser(): Promise<CurrentUserResponse> {
        const response = await api.get<CurrentUserResponseFromBackend>("/auth/me");

        return response.data.data;
    }

    async logout(): Promise<LogoutResponse> {
        const response = await api.post<LogoutResponse>("/auth/logout");

        return response.data;
    }
    async changePassword(
        payload: ChangePasswordRequest
    ): Promise<ChangePasswordResponse> {
        const response = await api.patch<ChangePasswordResponse>(
            "/auth/change-password",
            payload
        );

        return response.data;
    }
}

export default new AuthService();