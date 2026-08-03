import { AppError } from "../../shared/errors/AppError.js";
import { ROLES, type Role } from "../../shared/constants/roles.js";
import { systemConfigurationRepository } from "./systemConfiguration.repository.js";
import { encrypt, decrypt } from "../../shared/utils/encryption.js";
import type {
    PaginatedSystemConfigurations,
    SystemConfiguration,
    SystemConfigurationFilters,
    UpdateSystemConfigurationRequest,
} from "../../shared/types/systemConfiguration.types.js";

export class SystemConfigurationService {

    async getByConfigKey(
        configKey: string,
    ): Promise<SystemConfiguration> {

        const configuration = await systemConfigurationRepository.findByConfigKey(configKey);

        if (!configuration) {
            throw new AppError(404, "System configuration not found.");
        }

        if (
            configuration.isEncrypted
        ) {
            configuration.configValue = decrypt(configuration.configValue);
        }

        return configuration
    }

    async list(
        filters: SystemConfigurationFilters,
    ): Promise<PaginatedSystemConfigurations> {

        const configurations =
            await systemConfigurationRepository.list(filters);

        configurations.data = configurations.data.map((config) => ({
            ...config,
            configValue: config.isEncrypted
                ? "••••••••••"
                : config.configValue,
        }));
        
        return configurations;
    }

    async update(
        configKey: string,
        payload: UpdateSystemConfigurationRequest,
        userId: number,
    ): Promise<SystemConfiguration> {

        const configuration =
            await systemConfigurationRepository.findByConfigKey(configKey);

        if (!configuration) {
            throw new AppError(404, "System configuration not found.");
        }

        const payloadToSave = {
            ...payload,
            configValue: configuration.isEncrypted
                ? encrypt(payload.configValue)
                : payload.configValue,
        };

        return await systemConfigurationRepository.update(
            configKey,
            payloadToSave,
            userId
        );
    }

}

export const systemConfigurationService = new SystemConfigurationService();
