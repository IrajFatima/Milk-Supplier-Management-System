import { useEffect, useState } from "react";

import Dropdown from "../../../components/Dropdown";
import TextField from "../../../components/TextField";

import { orderService } from "../../../services/order.service";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import type { MilkType, OrderFilters } from "../../../types/order.types";

import {
    DELIVERY_SLOTS,
    ONE_TIME_ORDER_STATUS,
    SUBSCRIPTION_STATUS,
} from "../../../constants/order";

import type {
    DeliverySlot,
    OrderType,
} from "../../../constants/order";


interface OrderFiltersProps {
    orderType: OrderType;
    filters: OrderFilters;
    onChange: (filters: OrderFilters) => void;
}

export default function OrderFilters({
    orderType,
    filters,
    onChange,
}: OrderFiltersProps) {
    const [milkTypes, setMilkTypes] = useState<MilkType[]>([]);

    const statusOptions =
        orderType === "Subscription"
            ? Object.values(SUBSCRIPTION_STATUS)
            : Object.values(ONE_TIME_ORDER_STATUS);

    const slotOptions: DeliverySlot[] = Object.values(
        DELIVERY_SLOTS
    );
    useEffect(() => {
        let active = true;

        async function loadMilkTypes() {
            try {
                const response =
                    await orderService.getMilkTypes();

                if (!active) return;

                setMilkTypes(response);
            } catch (error) {
                console.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load milk types."
                    )
                );
            }
        }

        loadMilkTypes();

        return () => {
            active = false;
        };
    }, []);

    const handleChange = (
        key: keyof OrderFilters,
        value: string | undefined
    ) => {
        onChange({
            ...filters,
            page: 1,
            [key]:
                key === "milkTypeId"
                    ? value
                        ? Number(value)
                        : undefined
                    : value || undefined,
        });
    };

    return (
        <div className="flex flex-wrap gap-4">
            <div className="min-w-[180px] flex-1">
                <Dropdown
                    label="Status"
                    value={filters.orderStatus ?? ""}
                    onChange={(e) =>
                        handleChange(
                            "orderStatus",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Statuses
                    </option>

                    {statusOptions.map((status) => (
                        <option
                            key={status}
                            value={status}
                        >
                            {status}
                        </option>
                    ))}
                </Dropdown>
            </div>

            <div className="min-w-[180px] flex-1">
                <Dropdown
                    label="Delivery Slot"
                    value={
                        filters.deliveryTimePreference ??
                        ""
                    }
                    onChange={(e) =>
                        handleChange(
                            "deliveryTimePreference",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Slots
                    </option>

                    {slotOptions.map((slot) => (
                        <option
                            key={slot}
                            value={slot}
                        >
                            {slot}
                        </option>
                    ))}
                </Dropdown>
            </div>

            <div className="min-w-[180px] flex-1">
                <Dropdown
                    label="Milk Type"
                    value={filters.milkTypeId?.toString() ?? ""}
                    onChange={(e) =>
                        handleChange(
                            "milkTypeId",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Milk Types
                    </option>

                    {milkTypes.map((milkType) => (
                        <option
                            key={milkType.milkTypeId}
                            value={milkType.milkTypeId}
                        >
                            {milkType.productName}
                        </option>
                    ))}
                </Dropdown>
            </div>

            <div className="min-w-[180px] flex-1">
                <TextField
                    label="From Date"
                    type="date"
                    value={filters.fromDate ?? ""}
                    onChange={(e) =>
                        handleChange(
                            "fromDate",
                            e.target.value
                        )
                    }
                />
            </div>

        </div>
    );
}