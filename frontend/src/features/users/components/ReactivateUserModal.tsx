// src/features/users/components/ReactivateUserModal.tsx

import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../components/Modal";

import { userService } from "../../../services/user.service";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface ReactivateUserModalProps {
    isOpen: boolean;
    userId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReactivateUserModal({
    isOpen,
    userId,
    onClose,
    onSuccess,
}: ReactivateUserModalProps) {
    const [saving, setSaving] = useState(false);

    async function handleSubmit() {
        if (!userId) return;

        try {
            setSaving(true);

            await userService.reactivateUser(userId);

            toast.success("User reactivated successfully.");

            onSuccess();
            onClose();
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(error, "Failed to reactivate user.")
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Reactivate User"
            onClose={onClose}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-[var(--color-border)] px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-white disabled:opacity-50"
                    >
                        {saving ? "Reactivating..." : "Reactivate"}
                    </button>
                </>
            }
        >
            <p className="text-[var(--color-text-secondary)]">
                Are you sure you want to reactivate this user account?
            </p>
        </Modal>
    );
}