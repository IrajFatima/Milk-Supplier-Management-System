import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import { ROLES } from "../../../constants/roles";
import { useAuth } from "../../../hooks/useAuth";
import { systemConfigurationService } from "../../../services/systemConfiguration.service";
import type { SystemConfiguration } from "../../../types/systemConfiguration.types";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import SystemConfigurationDetails from "../components/SystemConfigurationDetails";

export default function SystemConfigurationDetailsPage() {
    const navigate = useNavigate();
    const { configKey } = useParams();
    const { user } = useAuth();
    const [systemConfiguration, setSystemConfiguration] =
        useState<SystemConfiguration | null>(null);
    const [loading, setLoading] = useState(true);

    const canEdit =
        user?.role === ROLES.OWNER ||
        user?.role === ROLES.SYSTEM_ADMINISTRATOR;

    useEffect(() => {
        async function loadSystemConfiguration() {
            if (!configKey) return;

            try {
                const response =
                    await systemConfigurationService.getSystemConfiguration(
                        decodeURIComponent(configKey)
                    );
                setSystemConfiguration(response);
            } catch (error: unknown) {
                toast.error(getApiErrorMessage(error, "Failed to load system configuration details."));
            } finally {
                setLoading(false);
            }
        }

        loadSystemConfiguration();
    }, [configKey]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner />
            </div>
        );
    }

    if (!systemConfiguration) {
        return (
            <div className="text-center text-[var(--color-text-secondary)]">
                System configuration not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1
                    className="text-2xl font-bold"
                    style={{ color: "var(--color-text)" }}
                >
                    System Configuration Details
                </h1>

                {canEdit && (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/system-configurations/${encodeURIComponent(systemConfiguration.configKey)}/edit`
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

            <SystemConfigurationDetails systemConfiguration={systemConfiguration} />
        </div>
    );
}
