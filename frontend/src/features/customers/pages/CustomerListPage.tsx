import { useCallback, useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Pagination from "../../../components/Pagination";

import CustomerFilters from "../components/CustomerFilters";
import CustomerSearchBar from "../components/CustomerSearchBar";
import CustomerTable from "../components/CustomerTable";
import ChangeCustomerStatusModal from "../components/ChangeCustomerStatusModal";

import { customerService } from "../../../services/customer.service";

import { useAuth } from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";

import { ROLES } from "../../../constants/roles";

import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import type {
    CustomerFilters as CustomerFiltersType,
    CustomerListItem,
} from "../../../types/customer.types";

export default function CustomerListPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const latestRequest = useRef(0);

    const [customers, setCustomers] = useState<CustomerListItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search);

    const [filters, setFilters] = useState<CustomerFiltersType>({
        page: 1,
        limit: 10,
    });

    const [totalPages, setTotalPages] = useState(1);

    const [changeCustomerStatusId, setChangeCustomerStatusId] =
        useState<number | null>(null);

    const role = user?.role;

    const canCreate =
        role === ROLES.OWNER ||
        role === ROLES.ACCOUNTANT;

    const canEdit =
        role === ROLES.OWNER ||
        role === ROLES.ACCOUNTANT;

    const canChangeStatus =
        role === ROLES.OWNER;

    const loadCustomers = useCallback(async () => {
        const requestId = ++latestRequest.current;

        try {
            setLoading(true);

            const response = await customerService.getCustomers({
                ...filters,
                search: debouncedSearch || undefined,
            });

            if (requestId !== latestRequest.current) {
                return;
            }

            setCustomers(response.data);
            setTotalPages(response.totalPages);
        } catch (error: unknown) {
            if (requestId !== latestRequest.current) {
                return;
            }

            toast.error(
                getApiErrorMessage(error, "Failed to load customers.")
            );
        } finally {
            if (requestId === latestRequest.current) {
                setLoading(false);
            }
        }
    }, [filters, debouncedSearch]);

    useEffect(() => {
        async function fetchCustomers() {
            await loadCustomers();
        }

        fetchCustomers();
    }, [loadCustomers]);

    const handleFilterChange = (
        updatedFilters: CustomerFiltersType
    ) => {
        setFilters(updatedFilters);
    };

    const handlePageChange = (page: number) => {
        setFilters((previous) => ({
            ...previous,
            page,
        }));
    };

    return (
        <>
            <div className="space-y-6">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <h1
                        className="text-2xl font-bold"
                        style={{
                            color: "var(--color-text)",
                        }}
                    >
                        Customer Management
                    </h1>

                    {canCreate && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/customers/create")
                            }
                            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-white transition"
                            style={{
                                background: "var(--color-primary)",
                            }}
                        >
                            <FiPlus size={18} />
                            Add Customer
                        </button>
                    )}
                </div>

                <CustomerSearchBar
                    value={search}
                    onChange={(value) => {
                        setSearch(value);

                        setFilters((previous) => ({
                            ...previous,
                            page: 1,
                        }));
                    }}
                />

                <CustomerFilters
                    filters={filters}
                    onChange={handleFilterChange}
                />

                <CustomerTable
                    customers={customers}
                    loading={loading}
                    canEdit={canEdit}
                    canChangeStatus={canChangeStatus}
                    onView={(id) =>
                        navigate(`/customers/${id}`)
                    }
                    onEdit={(id) =>
                        navigate(`/customers/${id}/edit`)
                    }
                    onChangeStatus={(id) =>
                        setChangeCustomerStatusId(id)
                    }
                />

                <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <ChangeCustomerStatusModal
                isOpen={changeCustomerStatusId !== null}
                customerId={changeCustomerStatusId}
                onClose={() =>
                    setChangeCustomerStatusId(null)
                }
                onSuccess={loadCustomers}
            />
        </>
    );
}