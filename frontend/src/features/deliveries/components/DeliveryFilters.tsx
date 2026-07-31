// src/features/deliveries/components/DeliveryFilters.tsx

import type { ChangeEvent } from "react";

import Dropdown from "../../../components/Dropdown";
import TextField from "../../../components/TextField";

import {
    DELIVERY_STATUS,
    type DeliveryStatus,
} from "../../../constants/delivery";

import {
    ORDER_TYPES,
    type OrderType,
} from "../../../constants/order";

import type {
    DeliveryFilters as DeliveryFiltersType,
    DeliveryStaff,
} from "../../../types/delivery.types";

interface MilkType {
    milkTypeId: number;
    productName: string;
}

interface DeliveryFiltersProps {
    filters: DeliveryFiltersType;
    milkTypes: MilkType[];
    deliveryStaff: DeliveryStaff[];
    canAssign: boolean;
    onChange: (filters: DeliveryFiltersType) => void;
}

export default function DeliveryFilters({
    filters,
    milkTypes,
    deliveryStaff,
    canAssign,
    onChange,
}: DeliveryFiltersProps) {
    const handleChange =
        (
            field: keyof Pick<
                DeliveryFiltersType,
                | "deliveryDate"
                | "status"
                | "orderType"
                | "milkTypeId"
                | "deliveryStaffId"
            >
        ) =>
            (
                event: ChangeEvent<
                    HTMLSelectElement | HTMLInputElement
                >
            ) => {
                const value = event.target.value;

                onChange({
                    ...filters,
                    page: 1,
                    [field]:
                        value === ""
                            ? undefined
                            : field === "milkTypeId" ||
                                field === "deliveryStaffId"
                                ? Number(value)
                                : value,
                });
            };

    return (
        <div
            className={`grid gap-4 ${canAssign
                    ? "md:grid-cols-2 lg:grid-cols-5"
                    : "md:grid-cols-2 lg:grid-cols-4"
                }`}
        >
            {canAssign && (

                <TextField
                    type="date"
                    className="input"
                    value={filters.deliveryDate ?? ""}
                    onChange={handleChange("deliveryDate")}
                />
            )}

            <Dropdown
                value={filters.status ?? ""}
                onChange={handleChange("status")}
            >
                <option value="">All Statuses</option>

                {Object.values(DELIVERY_STATUS).map(
                    (status: DeliveryStatus) => (
                        <option
                            key={status}
                            value={status}
                        >
                            {status}
                        </option>
                    )
                )}
            </Dropdown>

            <Dropdown
                value={filters.orderType ?? ""}
                onChange={handleChange("orderType")}
            >
                <option value="">All Order Types</option>

                {Object.values(ORDER_TYPES).map(
                    (type: OrderType) => (
                        <option
                            key={type}
                            value={type}
                        >
                            {type}
                        </option>
                    )
                )}
            </Dropdown>

            <Dropdown
                value={filters.milkTypeId ?? ""}
                onChange={handleChange("milkTypeId")}
            >
                <option value="">All Milk Types</option>

                {milkTypes.map((milkType) => (
                    <option
                        key={milkType.milkTypeId}
                        value={milkType.milkTypeId}
                    >
                        {milkType.productName}
                    </option>
                ))}
            </Dropdown>

            {canAssign && (
                <Dropdown
                    value={filters.deliveryStaffId ?? ""}
                    onChange={handleChange(
                        "deliveryStaffId"
                    )}
                >
                    <option value="">
                        All Delivery Staff
                    </option>

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
        </div>
    );
}