// src/features/customers/pages/EditCustomerPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CustomerForm from "../components/CustomerForm";

import Spinner from "../../../components/Spinner";

import { customerService } from "../../../services/customer.service";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import type {
    Customer,
    UpdateCustomerRequest,
} from "../../../types/customer.types";

export default function EditCustomerPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [customer, setCustomer] =
        useState<Customer | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCustomer() {
            if (!id) return;

            try {
                const response =
                    await customerService.getCustomer(
                        Number(id)
                    );

                setCustomer(response);
            } catch (error: unknown) {
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load customer."
                    )
                );
            } finally {
                setLoading(false);
            }
        }

        loadCustomer();
    }, [id]);

    async function handleUpdate(
        data: UpdateCustomerRequest
    ) {
        if (!id) return;

        try {
            await customerService.updateCustomer(
                Number(id),
                data
            );

            toast.success(
                "Customer updated successfully."
            );

            navigate(`/customers/${id}`);
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to update customer."
                )
            );

            throw new Error(
                "Customer update failed.",
                {
                    cause: error,
                }
            );
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner />
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center text-[var(--color-text-secondary)]">
                Customer not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1
                className="text-2xl font-bold"
                style={{
                    color: "var(--color-text)",
                }}
            >
                Edit Customer
            </h1>

            <div
                className="
                    rounded-xl
                    border
                    border-[var(--color-border)]
                    bg-[var(--color-surface)]
                    p-6
                "
            >
                <CustomerForm
                    customer={customer}
                    mode="edit"
                    onSubmit={handleUpdate}
                />
            </div>
        </div>
    );
}