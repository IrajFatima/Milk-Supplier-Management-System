// src/features/users/components/DeactivateUserModal.tsx

import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../components/Modal";

import { userService } from "../../../services/user.service";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface DeactivateUserModalProps {
    isOpen: boolean;
    userId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeactivateUserModal({
    isOpen,
    userId,
    onClose,
    onSuccess,
}: DeactivateUserModalProps) {
    const [saving, setSaving] = useState(false);

    async function handleSubmit() {
        if (!userId) return;

        try {
            setSaving(true);

            await userService.deactivateUser(userId);

            toast.success("User deactivated successfully.");

            onSuccess();
            onClose();
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(error, "Failed to deactivate user.")
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Deactivate User"
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
                        className="rounded-md bg-[var(--color-danger)] px-4 py-2 text-white disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Confirm"}
                    </button>
                </>
            }
        >
            <p className="text-sm text-[var(--color-text-secondary)]">
                Are you sure you want to deactivate this user account?
                The user will no longer be able to access the system.
            </p>
        </Modal>
    );
}