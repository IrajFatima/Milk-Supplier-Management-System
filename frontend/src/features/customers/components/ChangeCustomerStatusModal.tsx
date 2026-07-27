import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../components/Modal";
import Dropdown from "../../../components/Dropdown";
import { customerService } from "../../../services/customer.service";

import {
    CUSTOMER_ACCOUNT_STATUS,
    type CustomerAccountStatus,
} from "../../../constants/customer";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface ChangeCustomerStatusModalProps {
    isOpen: boolean;
    customerId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ChangeCustomerStatusModal({
    isOpen,
    customerId,
    onClose,
    onSuccess,
}: ChangeCustomerStatusModalProps) {
    const [status, setStatus] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const regulate = () => {
            if (!isOpen) {
                setStatus("");
            }
        };
        regulate();
    }, [isOpen]);

    async function handleSubmit() {
        if (!customerId) return;

        if (!status) {
            toast.error("Please select a status.");
            return;
        }
        if (!status) {
            toast.error("Please select a status.");
            return;
        }

        try {
            setSaving(true);

            await customerService.changeCustomerStatus(customerId, {
                account_status: status as CustomerAccountStatus,
            });

            toast.success("Customer status updated successfully.");

            onSuccess();
            onClose();
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to update customer status."
                )
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Change Customer Status"
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
                        {saving ? "Updating..." : "Update"}
                    </button>
                </>
            }
        >
            <Dropdown
                label="Status"
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="">Select Status</option>

                <option value={CUSTOMER_ACCOUNT_STATUS.ACTIVE}>
                    {CUSTOMER_ACCOUNT_STATUS.ACTIVE}
                </option>

                <option value={CUSTOMER_ACCOUNT_STATUS.INACTIVE}>
                    {CUSTOMER_ACCOUNT_STATUS.INACTIVE}
                </option>

                <option value={CUSTOMER_ACCOUNT_STATUS.SUSPENDED}>
                    {CUSTOMER_ACCOUNT_STATUS.SUSPENDED}
                </option>
            </Dropdown>
        </Modal>
    );
}