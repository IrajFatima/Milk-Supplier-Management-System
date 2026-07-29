import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../../components/Modal";
import Dropdown from "../../../components/Dropdown";
import Spinner from "../../../components/Spinner";

import { orderService } from "../../../services/order.service";

import {
    ORDER_TYPES,
    SUBSCRIPTION_STATUS,
    ONE_TIME_ORDER_STATUS,
    type OrderStatus,
    type OrderType,
} from "../../../constants/order";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface ChangeOrderStatusModalProps {
    isOpen: boolean;
    orderId: number | null;
    currentStatus: OrderStatus | null;
    orderType: OrderType;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ChangeOrderStatusModal({
    isOpen,
    orderId,
    currentStatus,
    orderType,
    onClose,
    onSuccess,
}: ChangeOrderStatusModalProps) {
    const [status, setStatus] =
        useState<OrderStatus | "">("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const options = useMemo(() => {
        const statuses =
            orderType === ORDER_TYPES.SUBSCRIPTION
                ? Object.values(SUBSCRIPTION_STATUS).filter(
                    (s) =>
                        s !==
                        SUBSCRIPTION_STATUS.CANCELLED
                )
                : Object.values(ONE_TIME_ORDER_STATUS).filter(
                    (s) =>
                        s !==
                        ONE_TIME_ORDER_STATUS.CANCELLED
                );

        return statuses
            .filter((s) => s !== currentStatus)
            .map((status) => ({
                label: status,
                value: status,
            }));
    }, [orderType, currentStatus]);

    const handleSubmit = async () => {
        if (!orderId || !status) return;

        setIsSubmitting(true);

        try {
            if (orderType === ORDER_TYPES.SUBSCRIPTION) {
                await orderService.changeSubscriptionStatus(
                    orderId,
                    status
                );

                toast.success(
                    "Subscription status updated."
                );
            } else {
                await orderService.changeOrderStatus(
                    orderId,
                    status
                );

                toast.success(
                    "Order status updated."
                );
            }

            onSuccess();
            onClose();
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to update status."
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
            title={`Change ${entity} Status`}
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
                        disabled={
                            !status ||
                            isSubmitting
                        }
                        onClick={handleSubmit}
                        className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-white"
                    >
                        {isSubmitting ? (
                            <Spinner size="sm" />
                        ) : (
                            "Update Status"
                        )}
                    </button>
                </div>
            }
        >
            <Dropdown
                label="Status"
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value as OrderStatus)
                }
                required
            >
                <option value="">Select status</option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </Dropdown>
        </Modal>
    );
}