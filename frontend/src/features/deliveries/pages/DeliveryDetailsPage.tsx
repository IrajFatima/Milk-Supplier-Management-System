// src/features/deliveries/pages/DeliveryDetailsPage.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import DeliveryDetails from "../components/DeliveryDetails";
import UpdateDeliveryStatusModal from "../components/UpdateDeliveryStatusModal";
import { deliveryService } from "../../../services/delivery.service";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../constants/roles";
import type { Delivery } from "../../../types/delivery.types";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

export default function DeliveryDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [loading, setLoading] = useState(true);
    const [updateOpen, setUpdateOpen] = useState(false);
    const isOwner = user?.role === ROLES.OWNER;
    const isDeliveryStaff =
        user?.role === ROLES.DELIVERY_STAFF;

    useEffect(() => {
        async function loadDelivery() {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const response = isOwner
                    ? await deliveryService.getDeliveryById(
                        Number(id)
                    )
                    : await deliveryService.getMyDeliveryById(
                        Number(id)
                    );

                setDelivery(response);
            } catch (error: unknown) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load delivery details."
                    )
                );
            } finally {
                setLoading(false);
            }
        }

        loadDelivery();
    }, [id, isOwner]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner />
            </div>
        );
    }

    if (!delivery) {
        return (
            <div className="text-center text-[var(--color-text-secondary)]">
                Delivery not found.
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
                    Delivery Details
                </h1>

                {isDeliveryStaff && (
                    <>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setUpdateOpen(true)}
                                disabled={delivery.deliveryStatus !== "Scheduled"}
                                className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Update Delivery Status
                            </button>
                        </div>

                        <UpdateDeliveryStatusModal
                            isOpen={updateOpen}
                            delivery={delivery}
                            onClose={() => setUpdateOpen(false)}
                            onSuccess={async () => {
                                setUpdateOpen(false);

                                const updated = isOwner
                                    ? await deliveryService.getDeliveryById(
                                        delivery.deliveryId
                                    )
                                    : await deliveryService.getMyDeliveryById(
                                        delivery.deliveryId
                                    );

                                setDelivery(updated);
                            }}
                        />
                    </>
                )}
            </div>

            <DeliveryDetails delivery={delivery} />

        </div>
    );
}