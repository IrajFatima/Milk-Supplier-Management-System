import CustomerStatusBadge from "./CustomerStatusBadge";

import type { Customer } from "../../../types/customer.types";

interface CustomerDetailsProps {
    customer: Customer;
}

export default function CustomerDetails({
    customer,
}: CustomerDetailsProps) {
    return (
        <div
            className="
                grid
                gap-6
                rounded-xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                p-6
                md:grid-cols-2
            "
        >
            <DetailItem
                label="Customer Name"
                value={customer.customer_name}
            />

            <DetailItem
                label="Customer Type"
                value={customer.customer_type}
            />

            <DetailItem
                label="Contact Number"
                value={customer.contact_number ?? "-"}
            />

            <DetailItem
                label="Email Address"
                value={customer.email_address ?? "-"}
            />

            <DetailItem
                label="Payment Model"
                value={customer.payment_model ?? "-"}
            />

            <div>
                <p className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                    Account Status
                </p>

                <CustomerStatusBadge
                    status={customer.account_status}
                />
            </div>

            <DetailItem
                label="Address Line 1"
                value={customer.delivery_address_line_1 ?? "-"}
            />

            <DetailItem
                label="Address Line 2"
                value={customer.delivery_address_line_2 ?? "-"}
            />

            <DetailItem
                label="City / Town"
                value={customer.city_town ?? "-"}
            />

            <DetailItem
                label="State / Province"
                value={customer.state_province ?? "-"}
            />

            <DetailItem
                label="Postal Code"
                value={customer.postal_code ?? "-"}
            />

            <DetailItem
                label="Delivery Area / Route"
                value={customer.delivery_area_route ?? "-"}
            />

            <DetailItem
                label="Landmark"
                value={customer.landmark ?? "-"}
            />

            <DetailItem
                label="Registration Date"
                value={new Date(
                    customer.registration_date
                ).toLocaleDateString()}
            />
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