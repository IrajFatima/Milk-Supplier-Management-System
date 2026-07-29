// src/features/orders/components/OneTimeOrderForm.tsx

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Dropdown from "../../../components/Dropdown";
import Spinner from "../../../components/Spinner";
import TextField from "../../../components/TextField";

import {
    BILLING_MODELS,
    DELIVERY_SLOTS,
    type DeliverySlot,
} from "../../../constants/order";

import { CUSTOMER_ACCOUNT_STATUS } from "../../../constants/customer";

import { customerService } from "../../../services/customer.service";
import { orderService } from "../../../services/order.service";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import type { CustomerListItem } from "../../../types/customer.types";

import type {
    CreateOneTimeOrderRequest,
    MilkType,
    OrderEntity,
    UpdateOneTimeOrderRequest,
} from "../../../types/order.types";

type CreateProps = {
    mode: "create";
    order?: OrderEntity;
    onSubmit: (
        data: CreateOneTimeOrderRequest
    ) => Promise<void>;
};

type EditProps = {
    mode: "edit";
    order: OrderEntity;
    onSubmit: (
        data: UpdateOneTimeOrderRequest
    ) => Promise<void>;
};

type Props = CreateProps | EditProps;

type FormValues = {
    customerId: string;
    billingModel: string;
    milkTypeId: string;
    quantity: string;
    deliveryDate: string;
    deliveryTimePreference: string;
};

export default function OneTimeOrderForm({
    mode,
    order,
    onSubmit,
}: Props) {
    const [loadingData, setLoadingData] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [customers, setCustomers] =
        useState<CustomerListItem[]>([]);

    const [milkTypes, setMilkTypes] =
        useState<MilkType[]>([]);

    const isInitialLoad = useRef(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            customerId: "",
            billingModel:
                BILLING_MODELS.PER_DELIVERY,
            milkTypeId: "",
            quantity: "",
            deliveryDate: "",
            deliveryTimePreference: "",
        },
    });

    useEffect(() => {
        let active = true;

        async function loadOptions() {
            try {
                setLoadingData(true);

                const [
                    customersResponse,
                    milkTypes,
                ] = await Promise.all([
                    customerService.getCustomers({
                        page: 1,
                        limit: 100,
                        account_status:
                            CUSTOMER_ACCOUNT_STATUS.ACTIVE,
                    }),
                    orderService.getMilkTypes(),
                ]);

                if (!active) return;

                setCustomers(
                    customersResponse.data
                );
                setMilkTypes(milkTypes);
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load form data."
                    )
                );
            } finally {
                if (active) {
                    setLoadingData(false);
                }
            }
        }

        loadOptions();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (loadingData) return;

        if (mode === "create") {
            reset({
                customerId: "",
                billingModel:
                    BILLING_MODELS.PER_DELIVERY,
                milkTypeId: "",
                quantity: "",
                deliveryDate: "",
                deliveryTimePreference: "",
            });

            isInitialLoad.current = false;
            return;
        }

        if (
            mode === "edit" &&
            order &&
            isInitialLoad.current
        ) {
            reset({
                customerId: String(
                    order.customerId
                ),
                billingModel:
                    order.billingModel,
                milkTypeId: String(
                    order.milkTypeId
                ),
                quantity: String(
                    order.quantity
                ),
                deliveryDate:
                    order.deliveryDate
                        ? new Date(
                            order.deliveryDate
                        )
                            .toISOString()
                            .split("T")[0]
                        : "",
                deliveryTimePreference:
                    order.deliveryTimePreference ??
                    "",
            });

            isInitialLoad.current = false;
        }
    }, [loadingData, mode, order, reset]);

    async function submitHandler(
        data: FormValues
    ) {
        try {
            setSubmitting(true);

            const payload = {
                billingModel:
                    BILLING_MODELS.PER_DELIVERY,
                milkTypeId: Number(
                    data.milkTypeId
                ),
                quantity: Number(
                    data.quantity
                ),
                deliveryDate:
                    data.deliveryDate,
                deliveryTimePreference:
                    data.deliveryTimePreference as DeliverySlot,
            };

            if (mode === "edit") {
                await onSubmit(
                    payload as UpdateOneTimeOrderRequest
                );
            } else {
                await onSubmit({
                    ...payload,
                    customerId: Number(
                        data.customerId
                    ),
                });
            }
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to save order."
                )
            );
        } finally {
            setSubmitting(false);
        }
    }

    const isEdit = mode === "edit";

    if (loadingData) {
        return (
            <div className="flex h-52 items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(
                submitHandler
            )}
            className="space-y-6"
        >
            <div className="grid gap-4 md:grid-cols-2">
                <Dropdown
                    label="Customer"
                    required
                    disabled={isEdit}
                    error={
                        errors.customerId
                            ?.message
                    }
                    {...register(
                        "customerId",
                        {
                            required:
                                "Customer is required.",
                        }
                    )}
                >
                    <option value="">
                        Select Customer
                    </option>

                    {customers.map(
                        (customer) => (
                            <option
                                key={
                                    customer.customer_id
                                }
                                value={
                                    customer.customer_id
                                }
                            >
                                {
                                    customer.customer_name
                                }
                            </option>
                        )
                    )}
                </Dropdown>

                <Dropdown
                    label="Billing Model"
                    disabled
                    {...register(
                        "billingModel"
                    )}
                >
                    <option
                        value={
                            BILLING_MODELS.PER_DELIVERY
                        }
                    >
                        Per Delivery
                    </option>
                </Dropdown>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Dropdown
                    label="Milk Type"
                    required
                    error={
                        errors.milkTypeId
                            ?.message
                    }
                    {...register(
                        "milkTypeId",
                        {
                            required:
                                "Milk type is required.",
                        }
                    )}
                >
                    <option value="">
                        Select Milk Type
                    </option>

                    {milkTypes.map(
                        (milkType) => (
                            <option
                                key={
                                    milkType.milkTypeId
                                }
                                value={
                                    milkType.milkTypeId
                                }
                            >
                                {
                                    milkType.productName
                                }
                            </option>
                        )
                    )}
                </Dropdown>

                <TextField
                    label="Quantity (L)"
                    required
                    type="number"
                    step="0.01"
                    error={
                        errors.quantity
                            ?.message
                    }
                    {...register(
                        "quantity",
                        {
                            required:
                                "Quantity is required.",
                            validate: (
                                value
                            ) =>
                                Number(
                                    value
                                ) > 0 ||
                                "Quantity must be greater than zero.",
                        }
                    )}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label="Delivery Date"
                    required
                    type="date"
                    error={
                        errors
                            .deliveryDate
                            ?.message
                    }
                    {...register(
                        "deliveryDate",
                        {
                            required:
                                "Delivery date is required.",
                        }
                    )}
                />

                <Dropdown
                    label="Delivery Slot"
                    required
                    error={
                        errors
                            .deliveryTimePreference
                            ?.message
                    }
                    {...register(
                        "deliveryTimePreference",
                        {
                            required:
                                "Delivery slot is required.",
                        }
                    )}
                >
                    <option value="">
                        Select Delivery Slot
                    </option>

                    {Object.values(
                        DELIVERY_SLOTS
                    ).map((slot) => (
                        <option
                            key={slot}
                            value={slot}
                        >
                            {slot}
                        </option>
                    ))}
                </Dropdown>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-white disabled:opacity-50"
            >
                {submitting && (
                    <Spinner
                        size="sm"
                        className="border-white border-t-transparent"
                    />
                )}

                {submitting
                    ? "Saving..."
                    : isEdit
                        ? "Update Order"
                        : "Create Order"}
            </button>
        </form>
    );
}