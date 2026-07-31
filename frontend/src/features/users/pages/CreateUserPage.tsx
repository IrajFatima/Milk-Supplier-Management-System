// src/features/users/pages/CreateUserPage.tsx

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import UserForm from "../components/UserForm";

import { userService } from "../../../services/user.service";

import type { CreateUserRequest } from "../../../types/user.types";

export default function CreateUserPage() {
    const navigate = useNavigate();

    async function handleCreate(
        data: CreateUserRequest
    ) {
        try {
            await userService.createUser(data);

            toast.success("User created successfully.");

            navigate("/users");
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to create user."
                )
            );

            throw new Error("User creation failed.", {
                cause: error,
            });
        }
    }

    return (
        <div className="space-y-6">
            <h1
                className="text-2xl font-bold"
                style={{
                    color: "var(--color-text)",
                }}
            >
                Add User
            </h1>

            <div
                className="
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    p-6
                "
            >
                <UserForm
                    mode="create"
                    onSubmit={handleCreate}
                />
            </div>
        </div>
    );
}