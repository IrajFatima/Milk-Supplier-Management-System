import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Spinner from "../../../components/Spinner";
import TextArea from "../../../components/TextArea";
import TextField from "../../../components/TextField";

import type {
    SystemConfiguration,
    UpdateSystemConfigurationRequest,
} from "../../../types/systemConfiguration.types";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface SystemConfigurationFormProps {
    systemConfiguration: SystemConfiguration;
    onSubmit: (
        data: UpdateSystemConfigurationRequest
    ) => Promise<void>;
}

type SystemConfigurationFormValues = {
    configKey: string;
    configValue: string;
    description: string;
};

export default function SystemConfigurationForm({
    systemConfiguration,
    onSubmit,
}: SystemConfigurationFormProps) {
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SystemConfigurationFormValues>({
        defaultValues: {
            configKey: "",
            configValue: "",
            description: "",
        },
    });

    useEffect(() => {
        reset({
            configKey: systemConfiguration.configKey,
            configValue: systemConfiguration.configValue,
            description: systemConfiguration.description ?? "",
        });
    }, [reset, systemConfiguration]);

    const submitHandler = async (
        data: SystemConfigurationFormValues
    ) => {
        try {
            setSubmitting(true);

            await onSubmit({
                configValue: data.configValue,
                description: data.description || undefined,
            });
        } catch (error: unknown) {
            toast.error(
                getApiErrorMessage(
                    error,
                    "Unable to update system configuration."
                )
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-6"
        >
            <TextField
                label="Config Key"
                disabled
                {...register("configKey")}
            />

            <TextArea
                label="Config Value"
                required
                rows={4}
                error={errors.configValue?.message}
                {...register("configValue", {
                    required: "Config value is required.",
                    validate: (value) =>
                        validateConfigValue(
                            value,
                            systemConfiguration.dataType
                        ),
                })}
            />

            <TextArea
                label="Description"
                rows={3}
                error={errors.description?.message}
                {...register("description")}
            />

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
                    : "Update Configuration"}
            </button>
        </form>
    );
}

function validateConfigValue(
    value: string,
    dataType: string
): true | string {
    const trimmed = value.trim();

    switch (dataType) {
        case "TEXT":
        case "LONG_TEXT":
        case "SECRET":
            return true;

        case "NUMBER":
            return /^-?\d+$/.test(trimmed)
                || "Please enter a valid whole number.";

        case "DECIMAL":
            return /^-?\d+(\.\d+)?$/.test(trimmed)
                || "Please enter a valid decimal number.";

        case "BOOLEAN":
            return /^(true|false)$/i.test(trimmed)
                || 'Value must be either "true" or "false".';

        case "DATE":
            return !Number.isNaN(Date.parse(trimmed))
                && /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
                || "Please enter a valid date (YYYY-MM-DD).";

        case "TIME":
            return /^([01]\d|2[0-3]):([0-5]\d)$/.test(trimmed)
                || "Please enter a valid time (HH:mm).";

        case "DATETIME":
            return !Number.isNaN(Date.parse(trimmed))
                || "Please enter a valid date and time.";

        case "EMAIL":
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
                || "Please enter a valid email address.";

        case "PHONE":
            return /^\+?[0-9\s\-()]{7,20}$/.test(trimmed)
                || "Please enter a valid phone number.";

        case "URL":
            try {
                new URL(trimmed);
                return true;
            } catch {
                return "Please enter a valid URL.";
            }

        case "JSON":
            try {
                JSON.parse(trimmed);
                return true;
            } catch {
                return "Please enter valid JSON.";
            }

        case "LIST":
            return trimmed.length > 0
                || "Please enter one or more values.";

        default:
            return true;
    }
}