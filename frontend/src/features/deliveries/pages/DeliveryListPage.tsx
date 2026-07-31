// src/features/deliveries/pages/DeliveryListPage.tsx

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Pagination from "../../../components/Pagination";
import DeliverySearchBar from "../components/DeliverySearchBar";
import DeliveryFilters from "../components/DeliveryFilters";
import DeliveryTable from "../components/DeliveryTable";
import AssignDeliveryModal from "../components/AssignDeliveryModal";
import UpdateDeliveryStatusModal from "../components/UpdateDeliveryStatusModal";

import { deliveryService } from "../../../services/delivery.service";
import { orderService } from "../../../services/order.service";

import { useAuth } from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";

import { ROLES } from "../../../constants/roles";

import type { DeliveryFilters as DeliveryFiltersType, DeliveryListItem, DeliveryStaff } from "../../../types/delivery.types";
import type { DeliveryStatus } from "../../../constants/delivery";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface MilkType {
    milkTypeId: number;
    productName: string;
}

export default function DeliveryListPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const latestRequest = useRef(0);

    const [selectedDelivery, setSelectedDelivery] = useState<{
        deliveryId: number;
        scheduledQuantity: number;
        deliveryStatus: DeliveryStatus;
        deliveredQuantity: number | null;
        deliveryRemarks: string | null;
    } | null>(null);

    const [deliveries, setDeliveries] = useState<DeliveryListItem[]>([]);
    const [deliveryStaff, setDeliveryStaff] = useState<DeliveryStaff[]>([]);
    const [milkTypes, setMilkTypes] = useState<MilkType[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search);
    const [filters, setFilters] = useState<DeliveryFiltersType>({ page: 1, limit: 10 });
    const [totalPages, setTotalPages] = useState(1);
    const [assignDeliveryId, setAssignDeliveryId] = useState<number | null>(null);

    const role = user?.role;
    const isOwner = role === ROLES.OWNER;
    const canAssign = isOwner;
    const canUpdate = role === ROLES.DELIVERY_STAFF;

    const loadDeliveries = useCallback(async () => {
        const requestId = ++latestRequest.current;

        try {
            setLoading(true);

            const response = isOwner
                ? await deliveryService.getDeliveries({ ...filters, search: debouncedSearch || undefined })
                : await deliveryService.getMyDeliveries({ ...filters, search: debouncedSearch || undefined });

            if (requestId !== latestRequest.current) return;

            setDeliveries(response.data);
            setTotalPages(response.totalPages);
        } catch (error: unknown) {
            if (requestId !== latestRequest.current) return;
            toast.error(getApiErrorMessage(error, "Failed to load deliveries."));
        } finally {
            if (requestId === latestRequest.current) setLoading(false);
        }
    }, [isOwner, filters, debouncedSearch]);

    const loadDropdowns = useCallback(async () => {
        try {
            setMilkTypes(await orderService.getMilkTypes());

            if (isOwner) {
                const staff = await deliveryService.getDeliveryStaff();
                setDeliveryStaff(staff);
            }
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Failed to load filters."));
        }
    }, [isOwner]);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { loadDeliveries(); }, [loadDeliveries]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { loadDropdowns(); }, [loadDropdowns]);

    const handleFilterChange = (updatedFilters: DeliveryFiltersType) => setFilters(updatedFilters);

    const handlePageChange = (page: number) => setFilters(previous => ({ ...previous, page }));

    return (
        <>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Delivery Planning</h1>

                <DeliverySearchBar
                    value={search}
                    onChange={(value) => {
                        setSearch(value);
                        setFilters(previous => ({ ...previous, page: 1 }));
                    }}
                />

                <DeliveryFilters filters={filters} milkTypes={milkTypes} deliveryStaff={deliveryStaff} canAssign={canAssign} onChange={handleFilterChange} />

                <DeliveryTable
                    deliveries={deliveries}
                    loading={loading}
                    canAssign={canAssign}
                    canUpdate={canUpdate}
                    onView={(id) => navigate(`/deliveries/${id}`)}
                    onAssign={(id) => setAssignDeliveryId(id)}
                    onUpdate={async (delivery) => {
                        try {
                            const selected = isOwner
                                ? await deliveryService.getDeliveryById(delivery.deliveryId)
                                : await deliveryService.getMyDeliveryById(delivery.deliveryId);

                            setSelectedDelivery({
                                deliveryId: selected.deliveryId,
                                scheduledQuantity: selected.scheduledQuantity,
                                deliveryStatus: selected.deliveryStatus,
                                deliveredQuantity: selected.deliveredQuantity,
                                deliveryRemarks: selected.deliveryRemarks,
                            });
                        } catch (error: unknown) {
                            toast.error(getApiErrorMessage(error, "Failed to load delivery."));
                        }
                    }}
                />

                <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>

            {canAssign && <AssignDeliveryModal isOpen={assignDeliveryId !== null} deliveryId={assignDeliveryId} onClose={() => setAssignDeliveryId(null)} onSuccess={loadDeliveries} />}

            <UpdateDeliveryStatusModal
                isOpen={selectedDelivery !== null}
                delivery={selectedDelivery}
                onClose={() => setSelectedDelivery(null)}
                onSuccess={async () => {
                    setSelectedDelivery(null);
                    await loadDeliveries();
                }}
            />
        </>
    );
}