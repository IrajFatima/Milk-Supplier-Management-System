// src/features/orders/components/SubscriptionForm.tsx

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Dropdown from "../../../components/Dropdown";
import Spinner from "../../../components/Spinner";
import TextField from "../../../components/TextField";

import {
    BILLING_CYCLES,
    BILLING_MODELS,
    DELIVERY_FREQUENCIES,
    DELIVERY_SLOTS,
    type BillingModel,
    type DeliveryFrequency,
    type DeliverySlot,
} from "../../../constants/order";

import { CUSTOMER_ACCOUNT_STATUS } from "../../../constants/customer";

import { customerService } from "../../../services/customer.service";
import { orderService } from "../../../services/order.service";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import type { CustomerListItem } from "../../../types/customer.types";

import type {
    CreateSubscriptionRequest,
    MilkType,
    OrderEntity,
    UpdateSubscriptionRequest,
} from "../../../types/order.types";

type CreateProps = {
    mode: "create";
    order?: never;
    onSubmit: (
        data: CreateSubscriptionRequest
    ) => Promise<void>;
};

type EditProps = {
    mode: "edit";
    order: OrderEntity;
    onSubmit: (
        data: UpdateSubscriptionRequest
    ) => Promise<void>;
};

type Props = CreateProps | EditProps;

type FormValues = {
    customerId: string;
    billingModel: BillingModel;
    monthlyFlatRate: string;
    billingCycle: string;
    proRationApplied: boolean;
    milkTypeId: string;
    quantity: string;
    deliveryFrequency: string;
    deliveryDate: string;
    deliveryTimePreference: string;
};

export default function SubscriptionForm({
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
        watch,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            customerId: "",
            billingModel:
                BILLING_MODELS.SUBSCRIPTION,
            monthlyFlatRate: "",
            billingCycle: "",
            proRationApplied: false,
            milkTypeId: "",
            quantity: "",
            deliveryFrequency: "",
            deliveryDate: "",
            deliveryTimePreference: "",
        },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const billingModel = watch(
        "billingModel"
    ) as BillingModel;

    const deliveryFrequency = watch(
        "deliveryFrequency"
    ) as DeliveryFrequency;

    useEffect(() => {
        let active = true;

        async function loadOptions() {
            try {
                setLoadingData(true);

                const [
                    customersResponse,
                    milkTypesResponse,
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

                setMilkTypes(
                    milkTypesResponse
                );
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
                    BILLING_MODELS.SUBSCRIPTION,
                monthlyFlatRate: "",
                billingCycle: "",
                proRationApplied: false,
                milkTypeId: "",
                quantity: "",
                deliveryFrequency: "",
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
                    order.billingModel as BillingModel,
                monthlyFlatRate:
                    order.monthlyFlatRate?.toString() ??
                    "",
                billingCycle:
                    order.billingCycle ?? "",
                proRationApplied:
                    order.proRationApplied,
                milkTypeId: String(
                    order.milkTypeId
                ),
                quantity: String(
                    order.quantity
                ),
                deliveryFrequency:
                    order.deliveryFrequency ??
                    "",
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
    }, [
        loadingData,
        mode,
        order,
        reset,
    ]);

    async function submitHandler(
        data: FormValues
    ) {
        try {
            setSubmitting(true);

            const payload = {
                billingModel:
                    data.billingModel,
                monthlyFlatRate:
                    data.billingModel ===
                        BILLING_MODELS.FLAT_RATE
                        ? Number(
                            data.monthlyFlatRate
                        )
                        : undefined,
                billingCycle:
                    data.billingModel === BILLING_MODELS.FLAT_RATE
                        ? data.billingCycle
                        : undefined,
                proRationApplied:
                    data.billingModel ===
                        BILLING_MODELS.FLAT_RATE
                        ? data.proRationApplied
                        : undefined,
                milkTypeId: Number(
                    data.milkTypeId
                ),
                quantity: Number(
                    data.quantity
                ),
                deliveryFrequency:
                    data.deliveryFrequency as DeliveryFrequency,
                deliveryDate:
                    data.deliveryDate ||
                    undefined,
                deliveryTimePreference:
                    data.deliveryTimePreference as DeliverySlot,
            };

            if (mode === "edit") {
                await onSubmit(
                    payload as UpdateSubscriptionRequest
                );
            } else {
                await onSubmit({
                    ...payload,
                    customerId: Number(
                        data.customerId
                    ),
                } as CreateSubscriptionRequest);
            }
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to save subscription."
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
                    required
                    error={
                        errors
                            .billingModel
                            ?.message
                    }
                    {...register(
                        "billingModel",
                        {
                            required:
                                "Billing model is required.",
                        }
                    )}
                >
                    <option value="">
                        Select Billing Model
                    </option>

                    <option
                        value={
                            BILLING_MODELS.SUBSCRIPTION
                        }
                    >
                        Subscription
                    </option>

                    <option
                        value={
                            BILLING_MODELS.FLAT_RATE
                        }
                    >
                        Flat Rate
                    </option>
                </Dropdown>
                {billingModel === BILLING_MODELS.FLAT_RATE && (
                    <Dropdown
                        label="Billing Cycle"
                        required
                        error={errors.billingCycle?.message}
                        {...register("billingCycle", {
                            required: "Billing cycle is required.",
                        })}
                    >
                        <option value="">
                            Select Billing Cycle
                        </option>

                        {Object.values(BILLING_CYCLES).map((cycle) => (
                            <option key={cycle} value={cycle}>
                                {cycle}
                            </option>
                        ))}
                    </Dropdown>
                )}

                {billingModel ===
                    BILLING_MODELS.FLAT_RATE && (
                        <TextField
                            label="Monthly Flat Rate"
                            required
                            type="number"
                            step="0.01"
                            error={
                                errors
                                    .monthlyFlatRate
                                    ?.message
                            }
                            {...register(
                                "monthlyFlatRate",
                                {
                                    required:
                                        "Monthly flat rate is required.",
                                    validate: (
                                        value
                                    ) =>
                                        Number(
                                            value
                                        ) > 0 ||
                                        "Amount must be greater than zero.",
                                }
                            )}
                        />
                    )}
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
                    label="Quantity (Liters)"
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
                <Dropdown
                    label="Delivery Frequency"
                    required
                    error={
                        errors
                            .deliveryFrequency
                            ?.message
                    }
                    {...register(
                        "deliveryFrequency",
                        {
                            required:
                                "Delivery frequency is required.",
                        }
                    )}
                >
                    <option value="">
                        Select Frequency
                    </option>

                    {Object.values(
                        DELIVERY_FREQUENCIES
                    ).map(
                        (
                            frequency
                        ) => (
                            <option
                                key={
                                    frequency
                                }
                                value={
                                    frequency
                                }
                            >
                                {
                                    frequency
                                }
                            </option>
                        )
                    )}
                </Dropdown>

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

            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label={
                        deliveryFrequency ===
                            DELIVERY_FREQUENCIES.DAILY
                            ? "Delivery Start Date"
                            : "First Delivery Date"
                    }
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
            </div>

            {billingModel ===
                BILLING_MODELS.FLAT_RATE  && (
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...register(
                                "proRationApplied"
                            )}
                        />

                        <span className="text-[var(--color-text)]">
                            Apply Pro-Ration
                        </span>
                    </label>
                )}

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
                        ? "Update Subscription"
                        : "Create Subscription"}
            </button>
        </form>
    );
}