// src/features/auth/components/LoginForm.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import authService from "../../../services/auth.service";
import { ROLES } from "../../../constants/roles";
import type { ApiErrorResponse } from "../../../types/api.types";
import type { LoginFormData } from "../../../types/auth.types";
import Spinner from "../../../components/Spinner";
import TextField from "../../../components/TextField";

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            setSubmitting(true);

            const response = await authService.login(data);

            login(response.token, response.user);

            toast.success("Login successful.");

            switch (response.user.role) {
                case ROLES.OWNER:
                    navigate("/owner/dashboard", { replace: true });
                    break;

                case ROLES.FARM_WORKER:
                    navigate("/farm/dashboard", { replace: true });
                    break;

                case ROLES.DELIVERY_STAFF:
                    navigate("/delivery/dashboard", { replace: true });
                    break;

                case ROLES.ACCOUNTANT:
                    navigate("/accountant/dashboard", { replace: true });
                    break;
                case ROLES.SYSTEM_ADMINISTRATOR:
                    navigate("/administrator/dashboard", { replace: true });
                    break;
                case ROLES.CUSTOMER:
                    navigate("/customer/dashboard", { replace: true });
                    break;
                default:
                    navigate("/login", { replace: true });
            }
        } catch (error: unknown) {
            let message = "Unable to login. Please try again.";

            if (axios.isAxiosError<ApiErrorResponse>(error)) {
                message = error.response?.data.message ?? message;
            }

            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <TextField
                label="Username or Email"
                placeholder="Enter your username or email"
                error={errors.usernameOrEmail?.message}
                {...register("usernameOrEmail", {
                    required: "Username or email is required.",
                })}
            />

            <TextField
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password", {
                    required: "Password is required.",
                })}
            />

            <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-2 font-medium text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {submitting && (
                    <Spinner
                        size="sm"
                        className="border-white border-t-transparent"
                    />
                )}

                {submitting ? "Signing In..." : "Sign In"}
            </button>
        </form>
    );
}