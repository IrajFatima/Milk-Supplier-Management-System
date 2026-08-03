import type { SystemConfiguration } from "../../../types/systemConfiguration.types";

interface SystemConfigurationDetailsProps {
    systemConfiguration: SystemConfiguration;
}

export default function SystemConfigurationDetails({
    systemConfiguration,
}: SystemConfigurationDetailsProps) {
    return (
        <div
            className="
                grid
                gap-6
                rounded-xl
                border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                p-6
                md:grid-cols-2
            "
        >
            <DetailItem
                label="Config Key"
                value={systemConfiguration.configKey}
            />

            <DetailItem
                label="Config Value"
                value={systemConfiguration.configValue}
            />

            <DetailItem
                label="Description"
                value={systemConfiguration.description ?? "-"}
            />

            <DetailItem
                label="Data Type"
                value={systemConfiguration.dataType}
            />

            <DetailItem
                label="Category"
                value={systemConfiguration.category ?? "-"}
            />

            <DetailItem
                label="Is Encrypted"
                value={systemConfiguration.isEncrypted ? "Yes" : "No"}
            />

            <DetailItem
                label="Updated At"
                value={
                    systemConfiguration.updatedAt
                        ? new Date(systemConfiguration.updatedAt).toLocaleString()
                        : "-"
                }
            />

            <DetailItem
                label="Updated By"
                value={
                    systemConfiguration.updatedByName
                        ? systemConfiguration.updatedByName
                        : "-"
                }
            />

            <DetailItem
                label="Created At"
                value={
                    systemConfiguration.createdAt
                        ? new Date(systemConfiguration.createdAt).toLocaleString()
                        : "-"
                }
            />
        </div>
    );
}

interface DetailItemProps {
    label: string;
    value: string;
}

function DetailItem({
    label,
    value,
}: DetailItemProps) {
    return (
        <div>
            <p className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]">
                {label}
            </p>

            <p className="text-[var(--color-text)]">
                {value}
            </p>
        </div>
    );
}
