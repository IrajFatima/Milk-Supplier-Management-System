// src/features/users/pages/UserDetailsPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import UserDetails from "../components/UserDetails";

import Spinner from "../../../components/Spinner";

import { userService } from "../../../services/user.service";

import { useAuth } from "../../../hooks/useAuth";

import { ROLES } from "../../../constants/roles";
import { ACCOUNT_STATUS } from "../../../constants/user";

import type { UserDetails as UserDetailsType } from "../../../types/user.types";

export default function UserDetailsPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const { user } = useAuth();

    const [userDetails, setUserDetails] =
        useState<UserDetailsType | null>(null);

    const [loading, setLoading] = useState(true);

    const canEdit =
        user?.role === ROLES.OWNER ||
        user?.role === ROLES.SYSTEM_ADMINISTRATOR;

    useEffect(() => {
        async function loadUser() {
            if (!id) return;

            try {
                const response =
                    await userService.getUser(Number(id));

                setUserDetails(response);
            } catch (error: unknown) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load user details."
                    )
                );
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner />
            </div>
        );
    }

    if (!userDetails) {
        return (
            <div className="text-center text-[var(--color-text-secondary)]">
                User not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1
                    className="text-2xl font-bold"
                    style={{
                        color: "var(--color-text)",
                    }}
                >
                    User Details
                </h1>

                {canEdit &&
                    userDetails.accountStatus !== ACCOUNT_STATUS.INACTIVE && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/users/${userDetails.userId}/edit`
                                )
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-md
                                bg-[var(--color-primary)]
                                px-4
                                py-2
                                text-white
                                transition
                                hover:bg-[var(--color-primary-hover)]
                            "
                        >
                            <FiEdit size={18} />

                            Edit
                        </button>
                    )}
            </div>

            <UserDetails user={userDetails} />
        </div>
    );
}