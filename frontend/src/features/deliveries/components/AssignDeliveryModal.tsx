// src/features/deliveries/components/AssignDeliveryModal.tsx

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../components/Modal";
import Dropdown from "../../../components/Dropdown";

import { deliveryService } from "../../../services/delivery.service";

import type { DeliveryStaff } from "../../../types/delivery.types";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface AssignDeliveryModalProps {
    isOpen: boolean;
    deliveryId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AssignDeliveryModal({
    isOpen,
    deliveryId,
    onClose,
    onSuccess,
}: AssignDeliveryModalProps) {
    const [deliveryStaff, setDeliveryStaff] = useState<DeliveryStaff[]>([]);
    const [deliveryStaffId, setDeliveryStaffId] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        async function loadDeliveryStaff() {
            try {
                setLoading(true);

                const response = await deliveryService.getDeliveryStaff();

                setDeliveryStaff(response);
                setDeliveryStaffId("");
            } catch (error: unknown) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load delivery staff."
                    )
                );
            } finally {
                setLoading(false);
            }
        }

        loadDeliveryStaff();
    }, [isOpen]);

    async function handleSubmit() {
        if (!deliveryId) return;

        if (deliveryStaffId === "") {
            toast.error("Please select a delivery staff member.");
            return;
        }

        try {
            setSaving(true);

            await deliveryService.assignDelivery(deliveryId, {
                deliveryStaffId,
            });

            toast.success("Delivery assigned successfully.");

            onSuccess();
            onClose();
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(error, "Failed to assign delivery.")
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Assign Delivery Staff"
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
                        {saving ? "Assigning..." : "Assign"}
                    </button>
                </>
            }
        >
            {loading ? (
                <p className="text-[var(--color-text-secondary)]">
                    Loading delivery staff...
                </p>
            ) : (
                <Dropdown
                    label="Delivery Staff"
                    required
                    value={deliveryStaffId}
                    onChange={(e) =>
                        setDeliveryStaffId(
                            e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                        )
                    }
                >
                    <option value="">Select Delivery Staff</option>

                    {deliveryStaff.map((staff) => (
                        <option
                            key={staff.employeeId}
                            value={staff.employeeId}
                        >
                            {staff.fullName}
                        </option>
                    ))}
                </Dropdown>
            )}
        </Modal>
    );
}