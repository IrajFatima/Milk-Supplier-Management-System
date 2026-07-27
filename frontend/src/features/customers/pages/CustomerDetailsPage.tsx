import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

import CustomerDetails from "../components/CustomerDetails";

import Spinner from "../../../components/Spinner";

import { customerService } from "../../../services/customer.service";

import { useAuth } from "../../../hooks/useAuth";

import { ROLES } from "../../../constants/roles";
import { CUSTOMER_ACCOUNT_STATUS } from "../../../constants/customer";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import type { Customer } from "../../../types/customer.types";

export default function CustomerDetailsPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const { user } = useAuth();

    const [customer, setCustomer] =
        useState<Customer | null>(null);

    const [loading, setLoading] = useState(true);

    const canEdit =
        (user?.role === ROLES.OWNER ||
            user?.role === ROLES.ACCOUNTANT) &&
        customer?.account_status !==
            CUSTOMER_ACCOUNT_STATUS.SUSPENDED;

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
                        "Failed to load customer details."
                    )
                );
            } finally {
                setLoading(false);
            }
        }

        loadCustomer();
    }, [id]);

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
            <div className="flex items-center justify-between">
                <h1
                    className="text-2xl font-bold"
                    style={{
                        color: "var(--color-text)",
                    }}
                >
                    Customer Details
                </h1>

                {canEdit && (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/customers/${customer.customer_id}/edit`
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-md
                            bg-[var(--color-primary)]
                            px-4
                            py-2
                            text-white
                            transition
                            hover:bg-[var(--color-primary-hover)]
                        "
                    >
                        <FiEdit size={18} />
                        Edit
                    </button>
                )}
            </div>

            <CustomerDetails customer={customer} />
        </div>
    );
}