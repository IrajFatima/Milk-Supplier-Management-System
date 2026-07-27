import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CustomerForm from "../components/CustomerForm";

import { customerService } from "../../../services/customer.service";

import type { CreateCustomerRequest } from "../../../types/customer.types";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

export default function CreateCustomerPage() {
    const navigate = useNavigate();

    async function handleCreate(
        data: CreateCustomerRequest
    ) {
        try {
            await customerService.createCustomer(data);

            toast.success(
                "Customer created successfully."
            );

            navigate("/customers");
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to create customer."
                )
            );

            throw new Error(
                "Customer creation failed.", { cause: error }
            );
        }
    }

    return (
        <div className="space-y-6">
            <h1
                className="text-2xl font-bold"
                style={{
                    color: "var(--color-text)",
                }}
            >
                Add Customer
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
                    mode="create"
                    onSubmit={handleCreate}
                />
            </div>
        </div>
    );
}