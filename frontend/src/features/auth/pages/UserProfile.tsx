import { FaUserCircle, FaShieldAlt, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import authService from "../../../services/auth.service";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../types/api.types";
import TextField from "../../../components/TextField";
import Spinner from "../../../components/Spinner";


const UserProfile = () => {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const { user, logout, loading } = useAuth();
    const handlePasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await authService.changePassword(passwordData);

            toast.success(response.message);

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setShowChangePassword(false);
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;

            toast.error(
                err.response?.data.message ?? "Failed to update password."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Spinner fullScreen />;
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-text)]">
                        User Profile
                    </h1>

                    <p className="mt-1 text-[var(--color-text-secondary)]">
                        Manage your account information and security settings.
                    </p>
                </div>

                {/* User Information */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                    <div className="border-b border-[var(--color-border)] px-6 py-4">
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">
                            User Information
                        </h2>
                    </div>

                    <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                            <FaUserCircle size={52} />
                        </div>

                        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Username
                                </p>
                                <p className="font-semibold text-[var(--color-text)]">
                                    {user?.username}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Email
                                </p>
                                <p className="font-semibold text-[var(--color-text)]">
                                    {user?.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Role
                                </p>
                                <p className="font-semibold text-[var(--color-text)]">
                                    {user?.role}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Account Status */}
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                        <div className="border-b border-[var(--color-border)] px-6 py-4">
                            <h2 className="text-lg font-semibold text-[var(--color-text)]">
                                Account Status
                            </h2>
                        </div>

                        <div className="space-y-5 p-6">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Status
                                </p>

                                <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                    {user?.accountStatus}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Last Login
                                </p>

                                <p className="font-semibold text-[var(--color-text)]">
                                    {user?.lastLogin
                                        ? new Date(user.lastLogin).toLocaleString()
                                        : "Never"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                        <div className="border-b border-[var(--color-border)] px-6 py-4">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text)]">
                                <FaShieldAlt />
                                Security
                            </h2>
                        </div>

                        <div className="space-y-6 p-6">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Password
                                </p>

                                <p className="font-semibold tracking-widest text-[var(--color-text)]">
                                    ************
                                </p>
                            </div>
                            {!showChangePassword &&
                                <button
                                    onClick={() => setShowChangePassword((prev) => !prev)}
                                    className="inline-flex items-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)]"
                                >
                                    Change Password
                                </button>
                            }
                            {showChangePassword && (
                                <div className="mt-6 border-t border-[var(--color-border)] pt-6">
                                    <form className="space-y-5" onSubmit={handleSubmit}>

                                        <TextField
                                            label="Current Password"
                                            name="currentPassword"
                                            type="password"
                                            required
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                        />

                                        <TextField
                                            label="New Password"
                                            name="newPassword"
                                            type="password"
                                            required
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                        />

                                        <TextField
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                        />

                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowChangePassword(false);

                                                    setPasswordData({
                                                        currentPassword: "",
                                                        newPassword: "",
                                                        confirmPassword: "",
                                                    });
                                                }}
                                                className="rounded-lg border border-[var(--color-border)] px-4 py-2"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="flex min-w-[170px] items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {submitting ? (
                                                    <Spinner size="sm" className="border-white border-t-transparent py-0" />
                                                ) : (
                                                    "Update Password"
                                                )}
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                    <div className="border-b border-[var(--color-border)] px-6 py-4">
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">
                            Quick Actions
                        </h2>
                    </div>

                    <div className="p-6">
                        <button
                            onClick={async () => {
                                try {
                                    await logout();
                                    toast.success("Logged out successfully.");
                                } catch {
                                    toast.error("Failed to logout.");
                                }
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-danger)] px-4 py-2 text-white transition hover:opacity-90"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;