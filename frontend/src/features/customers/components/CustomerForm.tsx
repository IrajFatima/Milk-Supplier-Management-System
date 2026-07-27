import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import TextField from "../../../components/TextField";
import Dropdown from "../../../components/Dropdown";
import TextArea from "../../../components/TextArea";
import Spinner from "../../../components/Spinner";

import {
    CUSTOMER_TYPE,
    PAYMENT_MODEL,
    type CustomerType,
    type PaymentModel,
} from "../../../constants/customer";

import type {
    Customer,
    CreateCustomerRequest,
    UpdateCustomerRequest,
} from "../../../types/customer.types";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface CreateCustomerFormProps {
    mode: "create";
    customer?: Customer;
    onSubmit: (data: CreateCustomerRequest) => Promise<void>;
}

interface EditCustomerFormProps {
    mode: "edit";
    customer: Customer;
    onSubmit: (data: UpdateCustomerRequest) => Promise<void>;
}

type CustomerFormProps =
    | CreateCustomerFormProps
    | EditCustomerFormProps;

type CustomerFormValues = {
    customer_type: CustomerType;
    customer_name: string;
    contact_number: string;
    email_address: string;

    delivery_address_line_1: string;
    delivery_address_line_2: string;

    city_town: string;
    state_province: string;
    postal_code: string;

    delivery_area_route: string;
    landmark: string;

    payment_model: PaymentModel;
};

export default function CustomerForm({
    mode,
    customer,
    onSubmit,
}: CustomerFormProps) {
    const [submitting, setSubmitting] = useState(false);

    const isInitialLoad = useRef(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CustomerFormValues>({
        defaultValues: {
            customer_type: "" as CustomerType,
            customer_name: "",
            contact_number: "",
            email_address: "",

            delivery_address_line_1: "",
            delivery_address_line_2: "",

            city_town: "",
            state_province: "",
            postal_code: "",

            delivery_area_route: "",
            landmark: "",

            payment_model: "" as PaymentModel,
        },
    });

    useEffect(() => {
        if (mode === "create") {
            reset({
                customer_type: "" as CustomerType,
                customer_name: "",
                contact_number: "",
                email_address: "",

                delivery_address_line_1: "",
                delivery_address_line_2: "",

                city_town: "",
                state_province: "",
                postal_code: "",

                delivery_area_route: "",
                landmark: "",

                payment_model: "" as PaymentModel,
            });

            isInitialLoad.current = false;
            return;
        }

        if (
            mode === "edit" &&
            customer &&
            isInitialLoad.current
        ) {
            reset({
                customer_type: customer.customer_type,
                customer_name: customer.customer_name,
                contact_number:
                    customer.contact_number ?? "",
                email_address:
                    customer.email_address ?? "",

                delivery_address_line_1:
                    customer.delivery_address_line_1 ??
                    "",

                delivery_address_line_2:
                    customer.delivery_address_line_2 ??
                    "",

                city_town:
                    customer.city_town ?? "",

                state_province:
                    customer.state_province ?? "",

                postal_code:
                    customer.postal_code ?? "",

                delivery_area_route:
                    customer.delivery_area_route ??
                    "",

                landmark:
                    customer.landmark ?? "",

                payment_model:
                    customer.payment_model ??
                    ("" as PaymentModel),
            });

            isInitialLoad.current = false;
        }
    }, [customer, mode, reset]);

    const submitHandler = async (
        data: CustomerFormValues
    ) => {
        try {
            setSubmitting(true);

            if (mode === "edit") {
                await onSubmit({
                    customer_name: data.customer_name,
                    contact_number:
                        data.contact_number,
                    delivery_address_line_1:
                        data.delivery_address_line_1,
                    delivery_address_line_2:
                        data.delivery_address_line_2 ||
                        undefined,
                    city_town: data.city_town,
                    state_province:
                        data.state_province,
                    postal_code:
                        data.postal_code,
                    delivery_area_route:
                        data.delivery_area_route ||
                        undefined,
                    landmark:
                        data.landmark || undefined,
                    payment_model:
                        data.payment_model,
                });

                return;
            }

            await onSubmit({
                customer_type:
                    data.customer_type,
                customer_name:
                    data.customer_name,
                contact_number:
                    data.contact_number,
                email_address:
                    data.email_address,
                delivery_address_line_1:
                    data.delivery_address_line_1,
                delivery_address_line_2:
                    data.delivery_address_line_2 ||
                    undefined,
                city_town:
                    data.city_town,
                state_province:
                    data.state_province,
                postal_code:
                    data.postal_code,
                delivery_area_route:
                    data.delivery_area_route ||
                    undefined,
                landmark:
                    data.landmark || undefined,
                payment_model:
                    data.payment_model,
            });
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Unable to save customer."
                )
            );
        } finally {
            setSubmitting(false);
        }
    };

    const isEdit = mode === "edit";

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-6"
        >    <div className="grid gap-4 md:grid-cols-2">
                <Dropdown
                    label="Customer Type"
                    required
                    disabled={isEdit}
                    error={errors.customer_type?.message}
                    {...register("customer_type", {
                        required: "Customer type is required.",
                    })}
                >
                    <option value="">
                        Select Customer Type
                    </option>

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
                    label="Payment Model"
                    required
                    error={errors.payment_model?.message}
                    {...register("payment_model", {
                        required: "Payment model is required.",
                    })}
                >
                    <option value="">
                        Select Payment Model
                    </option>

                    {Object.values(PAYMENT_MODEL).map((model) => (
                        <option
                            key={model}
                            value={model}
                        >
                            {model}
                        </option>
                    ))}
                </Dropdown>
            </div>

            <TextField
                label="Customer Name"
                required
                error={errors.customer_name?.message}
                {...register("customer_name", {
                    required: "Customer name is required.",
                })}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label="Contact Number"
                    required
                    placeholder="03XXXXXXXXX"
                    error={errors.contact_number?.message}
                    {...register("contact_number", {
                        required: "Contact number is required.",
                    })}
                />

                <TextField
                    label="Email Address"
                    type="email"
                    required={!isEdit}
                    disabled={isEdit}
                    error={errors.email_address?.message}
                    {...register("email_address", {
                        required: !isEdit
                            ? "Email address is required."
                            : false,
                    })}
                />
            </div>

            <TextArea
                label="Delivery Address Line 1"
                required
                rows={3}
                error={
                    errors.delivery_address_line_1?.message
                }
                {...register(
                    "delivery_address_line_1",
                    {
                        required:
                            "Address Line 1 is required.",
                    }
                )}
            />

            <TextArea
                label="Delivery Address Line 2"
                rows={3}
                error={
                    errors.delivery_address_line_2?.message
                }
                {...register(
                    "delivery_address_line_2"
                )}
            />

            <div className="grid gap-4 md:grid-cols-3">
                <TextField
                    label="City / Town"
                    required
                    error={errors.city_town?.message}
                    {...register("city_town", {
                        required: "City is required.",
                    })}
                />

                <TextField
                    label="State / Province"
                    required
                    error={errors.state_province?.message}
                    {...register("state_province", {
                        required:
                            "State/Province is required.",
                    })}
                />

                <TextField
                    label="Postal Code"
                    required
                    error={errors.postal_code?.message}
                    {...register("postal_code", {
                        required:
                            "Postal code is required.",
                    })}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextField
                    label="Delivery Area / Route"
                    error={
                        errors.delivery_area_route?.message
                    }
                    {...register("delivery_area_route")}
                />

                <TextField
                    label="Landmark"
                    error={errors.landmark?.message}
                    {...register("landmark")}
                />
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
                        ? "Update Customer"
                        : "Create Customer"}
            </button>
        </form>
    );
}