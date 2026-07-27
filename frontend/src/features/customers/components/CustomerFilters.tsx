import type { ChangeEvent } from "react";

import Dropdown from "../../../components/Dropdown";

import {
    CUSTOMER_ACCOUNT_STATUS,
} from "../../../constants/customer";

import {
    CUSTOMER_TYPE,
} from "../../../constants/customer";

import {
    PAYMENT_MODEL,
} from "../../../constants/customer";

import type {
    CustomerFilters as CustomerFiltersType,
} from "../../../types/customer.types";

interface CustomerFiltersProps {
    filters: CustomerFiltersType;
    onChange: (filters: CustomerFiltersType) => void;
}

export default function CustomerFilters({
    filters,
    onChange,
}: CustomerFiltersProps) {

    const handleChange =
        (
            field: keyof Pick<
                CustomerFiltersType,
                "account_status" | "customer_type" | "payment_model"
            >
        ) =>
        (event: ChangeEvent<HTMLSelectElement>) => {

            const value = event.target.value;

            onChange({
                ...filters,
                page: 1,
                [field]: value === "" ? undefined : value,
            });
        };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <Dropdown
                value={filters.customer_type ?? ""}
                onChange={handleChange("customer_type")}
            >
                <option value="">All Customer Types</option>

                {Object.values(CUSTOMER_TYPE).map((type) => (
                    <option
                        key={type}
                        value={type}
                    >
                        {type}
                    </option>
                ))}
            </Dropdown>

            <Dropdown
                value={filters.payment_model ?? ""}
                onChange={handleChange("payment_model")}
            >
                <option value="">All Payment Models</option>

                {Object.values(PAYMENT_MODEL).map((payment) => (
                    <option
                        key={payment}
                        value={payment}
                    >
                        {payment}
                    </option>
                ))}
            </Dropdown>

            <Dropdown
                value={filters.account_status ?? ""}
                onChange={handleChange("account_status")}
            >
                <option value="">All Statuses</option>

                {Object.values(CUSTOMER_ACCOUNT_STATUS).map((status) => (
                    <option
                        key={status}
                        value={status}
                    >
                        {status}
                    </option>
                ))}
            </Dropdown>

        </div>
    );
}