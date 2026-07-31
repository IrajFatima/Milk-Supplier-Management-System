// src/services/user.service.ts

import api from "./api";

import type {
    CreateUserRequest,
    PaginatedUsers,
    UpdateUserRequest,
    UserDetails,
    UserFilters,
    UserRole,
} from "../types/user.types";

export const userService = {
    async getUsers(filters: UserFilters): Promise<PaginatedUsers> {
        const response = await api.get("/users", { params: filters });

        return response.data.data;
    },

    async getUser(id: number): Promise<UserDetails> {
        const response = await api.get(`/users/${id}`);

        return response.data.data.user;
    },

    async createUser(data: CreateUserRequest): Promise<UserDetails> {
        const response = await api.post("/users", data);

        return response.data.data;
    },

    async updateUser(
        id: number,
        data: UpdateUserRequest
    ): Promise<UserDetails> {
        const response = await api.put(`/users/${id}`, data);

        return response.data.data;
    },

    async reactivateUser(id: number): Promise<void> {
        await api.patch(`/users/${id}/activate`);
    },

    async deactivateUser(id: number): Promise<void> {
        await api.patch(`/users/${id}/deactivate`);
    },

    async getRoles(): Promise<UserRole[]> {
        const response = await api.get("/users/roles");

        return response.data.data.roles;
    },
};