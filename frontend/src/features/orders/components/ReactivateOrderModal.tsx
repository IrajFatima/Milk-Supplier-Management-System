import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../components/Modal";
import Spinner from "../../../components/Spinner";

import { orderService } from "../../../services/order.service";

import {
    ORDER_TYPES,
    type OrderType,
} from "../../../constants/order";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface ReactivateOrderModalProps {
    isOpen: boolean;
    orderId: number | null;
    orderType: OrderType;
    onClose: () =>void;
    onSuccess: () => void;
}

export default function ReactivateOrderModal({
    isOpen,
    orderId,
    orderType,
    onClose,
    onSuccess,
}: ReactivateOrderModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (orderId === null) return;

        setIsSubmitting(true);

        try {
            if (orderType === ORDER_TYPES.SUBSCRIPTION) {
                await orderService.reactivateSubscription(orderId);
                toast.success("Subscription reactivated successfully.");
            } else {
                await orderService.reactivateOrder(orderId);
                toast.success("Order reactivated successfully.");
            }

            onSuccess();
            onClose();
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to reactivate."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const entity =
        orderType === ORDER_TYPES.SUBSCRIPTION
            ? "Subscription"
            : "Order";

    return (
        <Modal
            isOpen={isOpen}
            title={`Reactivate ${entity}`}
            onClose={onClose}
            size="sm"
            footer={
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-md border border-[var(--color-border)] px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        {isSubmitting ? (
                            <Spinner size="sm" />
                        ) : (
                            `Reactivate ${entity}`
                        )}
                    </button>
                </div>
            }
        >
            <p className="text-sm text-[var(--color-text-secondary)]">
                This will reactivate the {entity.toLowerCase()}.
            </p>
        </Modal>
    );
}