import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../components/Modal";
import Dropdown from "../../../components/Dropdown";
import TextField from "../../../components/TextField";
import TextArea from "../../../components/TextArea";

import {
    DELIVERY_STATUS,
    DELIVERY_STATUS_OPTIONS,
    type DeliveryStatus,
} from "../../../constants/delivery";

import { deliveryService } from "../../../services/delivery.service";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface UpdateDeliveryData {
    deliveryId: number;
    scheduledQuantity: number;
    deliveryStatus: DeliveryStatus;
    deliveredQuantity: number | null;
    deliveryRemarks: string | null;
}

interface UpdateDeliveryStatusModalProps {
    isOpen: boolean;
    delivery: UpdateDeliveryData | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UpdateDeliveryStatusModal({
    isOpen,
    delivery,
    onClose,
    onSuccess,
}: UpdateDeliveryStatusModalProps) {
    const [deliveryStatus, setDeliveryStatus] =
        useState<DeliveryStatus>(
            DELIVERY_STATUS.SUCCESSFULLY_DELIVERED
        );

    const [deliveredQuantity, setDeliveredQuantity] =
        useState("");

    const [remarks, setRemarks] = useState("");

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen || !delivery) {
            return;
        }
        const resetForm = () => {
            setDeliveryStatus(
                delivery.deliveryStatus ===
                    DELIVERY_STATUS.SCHEDULED
                    ? DELIVERY_STATUS.SUCCESSFULLY_DELIVERED
                    : delivery.deliveryStatus
            );

            setDeliveredQuantity(
                delivery.deliveredQuantity?.toString() ?? ""
            );

            setRemarks(delivery.deliveryRemarks ?? "");
        }
        resetForm();
    }, [delivery, isOpen]);

    async function handleSubmit() {
        if (!delivery) {
            return;
        }

        if (
            deliveryStatus ===
            DELIVERY_STATUS.PARTIALLY_DELIVERED &&
            !deliveredQuantity.trim()
        ) {
            toast.error(
                "Please enter delivered quantity."
            );
            return;
        }

        try {
            setSaving(true);

            await deliveryService.updateDeliveryStatus(
                delivery.deliveryId,
                {
                    deliveryStatus,
                    deliveredQuantity:
                        deliveryStatus ===
                            DELIVERY_STATUS.PARTIALLY_DELIVERED
                            ? Number(deliveredQuantity)
                            : undefined,
                    remarks:
                        remarks.trim() || undefined,
                }
            );

            toast.success(
                "Delivery updated successfully."
            );

            onSuccess();
            onClose();
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to update delivery."
                )
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Update Delivery Status"
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
                        {saving
                            ? "Updating..."
                            : "Update"}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <Dropdown
                    label="Delivery Status"
                    required
                    value={deliveryStatus}
                    onChange={(e) =>
                        setDeliveryStatus(
                            e.target
                                .value as DeliveryStatus
                        )
                    }
                >
                    {DELIVERY_STATUS_OPTIONS.filter(
                        (status) =>
                            status !==
                            DELIVERY_STATUS.SCHEDULED
                    ).map((status) => (
                        <option
                            key={status}
                            value={status}
                        >
                            {status}
                        </option>
                    ))}
                </Dropdown>

                {deliveryStatus ===
                    DELIVERY_STATUS.PARTIALLY_DELIVERED && (
                        <TextField
                            type="number"
                            step="0.01"
                            min={0}
                            max={delivery?.scheduledQuantity}
                            label="Delivered Quantity (L)"
                            required
                            value={deliveredQuantity}
                            onChange={(e) =>
                                setDeliveredQuantity(
                                    e.target.value
                                )
                            }
                        />
                    )}

                <TextArea
                    label="Remarks"
                    rows={4}
                    value={remarks}
                    onChange={(e) =>
                        setRemarks(e.target.value)
                    }
                />
            </div>
        </Modal>
    );
}