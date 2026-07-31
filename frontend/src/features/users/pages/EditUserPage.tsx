// src/features/users/pages/EditUserPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import UserForm from "../components/UserForm";

import Spinner from "../../../components/Spinner";

import { userService } from "../../../services/user.service";

import type {
    UpdateUserRequest,
    UserDetails,
} from "../../../types/user.types";

export default function EditUserPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            if (!id) return;

            try {
                const response = await userService.getUser(
                    Number(id)
                );

                setUser(response);
            } catch (error: unknown) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load user."
                    )
                );
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [id]);

    async function handleUpdate(
        data: UpdateUserRequest
    ) {
        if (!id) return;

        try {
            await userService.updateUser(
                Number(id),
                data
            );

            toast.success("User updated successfully.");

            navigate(`/users/${id}`);
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to update user."
                )
            );

            throw new Error("User update failed.", {
                cause: error,
            });
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center text-[var(--color-text-secondary)]">
                User not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1
                className="text-2xl font-bold"
                style={{
                    color: "var(--color-text)",
                }}
            >
                Edit User
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
                    user={user}
                    mode="edit"
                    onSubmit={handleUpdate}
                />
            </div>
        </div>
    );
}