import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import { ROLES } from "../../../constants/roles";
import { useAuth } from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import { systemConfigurationService } from "../../../services/systemConfiguration.service";
import type {
    SystemConfigurationFilters,
    SystemConfigurationListItem,
} from "../../../types/systemConfiguration.types";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import SystemConfigurationSearchBar from "../components/SystemConfigurationSearchBar";
import SystemConfigurationTable from "../components/SystemConfigurationTable";

export default function SystemConfigurationListPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const latestRequest = useRef(0);

    const [systemConfigurations, setSystemConfigurations] = useState<
        SystemConfigurationListItem[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const debouncedSearch = useDebounce(search);

    const [filters, setFilters] = useState<SystemConfigurationFilters>({
        page: 1,
        limit: 10,
    });

    const role = user?.role;
    const canEdit =
        role === ROLES.OWNER ||
        role === ROLES.SYSTEM_ADMINISTRATOR;

    const loadSystemConfigurations = useCallback(async () => {
        const requestId = ++latestRequest.current;

        try {
            setLoading(true);

            const response =
                await systemConfigurationService.getSystemConfigurations({
                    ...filters,
                    search: debouncedSearch || undefined,
                });

            if (requestId !== latestRequest.current) {
                return;
            }

            setSystemConfigurations(response.data);
            setTotalPages(response.totalPages);
        } catch (error: unknown) {
            if (requestId !== latestRequest.current) {
                return;
            }

            toast.error(getApiErrorMessage(error, "Failed to load system configurations."));
        } finally {
            if (requestId === latestRequest.current) {
                setLoading(false);
            }
        }
    }, [debouncedSearch, filters]);

    useEffect(() => {
        async function fetchSystemConfigurations() {
            await loadSystemConfigurations();
        }

        fetchSystemConfigurations();
    }, [loadSystemConfigurations]);

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
                        style={{ color: "var(--color-text)" }}
                    >
                        System Configurations
                    </h1>
                </div>

                <SystemConfigurationSearchBar
                    value={search}
                    onChange={(value) => {
                        setSearch(value);
                        setFilters((previous) => ({
                            ...previous,
                            page: 1,
                        }));
                    }}
                />

                <SystemConfigurationTable
                    systemConfigurations={systemConfigurations}
                    loading={loading}
                    canEdit={canEdit}
                    onView={(configKey) =>
                        navigate(`/system-configurations/${encodeURIComponent(configKey)}`)
                    }
                    onEdit={(configKey) =>
                        navigate(
                            `/system-configurations/${encodeURIComponent(configKey)}/edit`
                        )
                    }
                />

                <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

        </>
    );
}
