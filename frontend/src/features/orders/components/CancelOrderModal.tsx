import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal";
import Spinner from "../../../components/Spinner";
import { orderService } from "../../../services/order.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import {ORDER_TYPES, type OrderType} from "../../../constants/order";

interface CancelOrderModalProps {
    isOpen: boolean;
    /** The order/subscription ID to cancel */
    orderId: number | null;
    /** "subscription" or "one-time" */
    orderType: OrderType;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CancelOrderModal({
    isOpen,
    orderId,
    orderType,
    onClose,
    onSuccess,
}: CancelOrderModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (orderId === null) return;

        setIsSubmitting(true);

        try {
            if (orderType === ORDER_TYPES.SUBSCRIPTION) {
                await orderService.cancelSubscription(orderId);
                toast.success("Subscription cancelled successfully.");
            } else {
                await orderService.cancelOrder(orderId);
                toast.success("Order cancelled successfully.");
            }

            onSuccess();
            onClose();
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(error, "Failed to cancel. Please try again.")
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const entityLabel = orderType === ORDER_TYPES.SUBSCRIPTION ? "subscription" : "order";

    const entityTitle =
        entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1);
    return (
        <Modal
            isOpen={isOpen}
            title={`Cancel ${entityTitle}`}
            onClose={onClose}
            size="sm"
            footer={
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] transition hover:bg-[var(--color-background)] disabled:opacity-50"
                    >
                        Keep
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {isSubmitting ? <Spinner size="sm" /> : `Yes, Cancel ${entityTitle}`}
                    </button>
                </div>
            }
        >
            <p className="text-sm text-[var(--color-text-secondary)]">
                Are you sure you want to cancel this {entityLabel}? This action cannot be undone.
            </p>
        </Modal>
    );
}
