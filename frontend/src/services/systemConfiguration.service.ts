import api from "./api";
import type {
    PaginatedSystemConfigurations,
    SystemConfiguration,
    SystemConfigurationFilters,
    UpdateSystemConfigurationRequest,
} from "../types/systemConfiguration.types";

export const systemConfigurationService = {
    async getSystemConfigurations(
        filters: SystemConfigurationFilters
    ): Promise<PaginatedSystemConfigurations> {
        const response = await api.get("/system-configurations", {
            params: filters,
        });

        return response.data.data;
    },

    async getSystemConfiguration(configKey: string): Promise<SystemConfiguration> {
        const response = await api.get(
            `/system-configurations/${encodeURIComponent(configKey)}`
        );

        return response.data.data.systemConfiguration;
    },

    async updateSystemConfiguration(
        configKey: string,
        data: UpdateSystemConfigurationRequest
    ): Promise<SystemConfiguration> {
        const response = await api.put(
            `/system-configurations/${encodeURIComponent(configKey)}`,
            data
        );

        return response.data.data.systemConfiguration;
    },

};
