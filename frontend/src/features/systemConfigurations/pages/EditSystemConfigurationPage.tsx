import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Spinner from "../../../components/Spinner";
import SystemConfigurationForm from "../components/SystemConfigurationForm";

import { systemConfigurationService } from "../../../services/systemConfiguration.service";
import type {
    SystemConfiguration,
    UpdateSystemConfigurationRequest,
} from "../../../types/systemConfiguration.types";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

export default function EditSystemConfigurationPage() {
    const navigate = useNavigate();
    const { configKey } = useParams<{ configKey: string }>();

    const [systemConfiguration, setSystemConfiguration] =
        useState<SystemConfiguration | null>(null);
    const [loading, setLoading] = useState(true);

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
                toast.error(
                    getApiErrorMessage(
                        error,
                        "Failed to load system configuration."
                    )
                );
            } finally {
                setLoading(false);
            }
        }

        loadSystemConfiguration();
    }, [configKey]);

    async function handleUpdate(
        data: UpdateSystemConfigurationRequest
    ) {
        if (!configKey) return;

        try {
            await systemConfigurationService.updateSystemConfiguration(
                decodeURIComponent(configKey),
                data
            );

            toast.success("System configuration updated successfully.");
            navigate(`/systemConfigurations/${configKey}`);
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Failed to update system configuration."
                )
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

    if (!systemConfiguration) {
        return (
            <div className="text-center text-[var(--color-text-secondary)]">
                System configuration not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1
                className="text-2xl font-bold"
                style={{ color: "var(--color-text)" }}
            >
                Edit System Configuration
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
                <SystemConfigurationForm
                    systemConfiguration={systemConfiguration}
                    onSubmit={handleUpdate}
                />
            </div>
        </div>
    );
}