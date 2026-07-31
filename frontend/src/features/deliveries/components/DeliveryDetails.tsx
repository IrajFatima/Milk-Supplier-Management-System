// src/features/deliveries/components/DeliveryDetails.tsx

import DeliveryStatusBadge from "./DeliveryStatusBadge";

import type { Delivery } from "../../../types/delivery.types";

interface DeliveryDetailsProps {
    delivery: Delivery;
}

export default function DeliveryDetails({
    delivery,
}: DeliveryDetailsProps) {
    return (
        <div className="space-y-6">
            <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <h2 className="mb-4 text-lg font-semibold">Customer</h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <DetailItem
                        label="Name"
                        value={delivery.customerName}
                    />

                    <DetailItem
                        label="Phone"
                        value={delivery.contactNumber ?? "-"}
                    />
                </div>
            </section>

            <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <h2 className="mb-4 text-lg font-semibold">Address</h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <DetailItem
                        label="Address Line 1"
                        value={delivery.deliveryAddressLine1 ?? "-"}
                    />

                    <DetailItem
                        label="Address Line 2"
                        value={delivery.deliveryAddressLine2 ?? "-"}
                    />

                    <DetailItem
                        label="City"
                        value={delivery.cityTown ?? "-"}
                    />

                    <DetailItem
                        label="Province"
                        value={delivery.stateProvince ?? "-"}
                    />

                    <DetailItem
                        label="Postal Code"
                        value={delivery.postalCode ?? "-"}
                    />

                    <DetailItem
                        label="Landmark"
                        value={delivery.landmark ?? "-"}
                    />
                </div>
            </section>

            <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <h2 className="mb-4 text-lg font-semibold">Order</h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <DetailItem
                        label="Order Type"
                        value={delivery.orderType}
                    />

                    <DetailItem
                        label="Milk Type"
                        value={delivery.milkType}
                    />

                    <DetailItem
                        label="Quantity"
                        value={`${delivery.scheduledQuantity} L`}
                    />

                    <DetailItem
                        label="Delivery Time Preference"
                        value={delivery.deliveryTimePreference ?? "-"}
                    />
                </div>
            </section>

            <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <h2 className="mb-4 text-lg font-semibold">Delivery</h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <DetailItem
                        label="Delivery Date"
                        value={new Date(
                            delivery.deliveryDate
                        ).toLocaleDateString()}
                    />

                    <DetailItem
                        label="Assigned Staff"
                        value={delivery.deliveryStaffName ?? "-"}
                    />

                    <DetailItem
                        label="Delivered Quantity"
                        value={
                            delivery.deliveredQuantity !== null
                                ? `${delivery.deliveredQuantity} L`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Remarks"
                        value={delivery.deliveryRemarks ?? "-"}
                    />

                    <div>
                        <p className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]">
                            Status
                        </p>

                        <DeliveryStatusBadge
                            status={delivery.deliveryStatus}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

interface DetailItemProps {
    label: string;
    value: string;
}

function DetailItem({
    label,
    value,
}: DetailItemProps) {
    return (
        <div>
            <p className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]">
                {label}
            </p>

            <p className="text-[var(--color-text)]">
                {value}
            </p>
        </div>
    );
}