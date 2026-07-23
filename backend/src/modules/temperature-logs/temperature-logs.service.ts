import { temperatureLogsRepository } from "./temperature-logs.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import {
    TemperatureLog,
    CreateTemperatureLogRequest,
    TemperatureLogFilters,
    PaginatedTemperatureLogs,
    CreateTemperatureLogEntity
} from "../../shared/types/temperature.types.js";

export class TemperatureLogsService {

    private async validateStorageFacilityExistsAndActive(facilityId: number): Promise<void> {
        const facility = await temperatureLogsRepository.findStorageFacility(facilityId);

        if (!facility) {
            throw new AppError(404, "Selected storage facility does not exist.");
        }

        if (facility.operationalStatus !== "Active") {
            throw new AppError(400, "Selected storage facility is not active.");
        }
    }

    private validateTemperatureBounds(temperature: number): void {
        if (typeof temperature !== "number" || Number.isNaN(temperature)) {
            throw new AppError(400, "Temperature must be a numeric value.");
        }

        // Updated bounds to match MVP defaults (2°C - 6°C)
        if (temperature < 2 || temperature > 6) {
            throw new AppError(400, "Temperature must be between 2°C and 6°C.");
        }
    }

    async create(payload: CreateTemperatureLogRequest, operatorId: number | null): Promise<TemperatureLog> {

        const toCreate: CreateTemperatureLogEntity = {
            storageFacilityId: payload.storageFacilityId,
            recordingDateTime: payload.recordingDateTime,
            temperatureReading: payload.temperatureReading,
            recordingType: "Manual",
            operator: operatorId,
            // Compute alert for manual creation (keeps previous behavior)
            alertTriggered: payload.temperatureReading > 4.5,
            remarks: payload.remarks ?? null
        };

        return await this.persistLogEntity(toCreate);
    }

    // New: create an automated temperature log via service so business rules remain centralized
    async createAutomated(payload: CreateTemperatureLogEntity): Promise<TemperatureLog> {
        // Ensure recordingType is set to Automated Sensor
        const toCreate: CreateTemperatureLogEntity = {
            ...payload,
            recordingType: "Automated Sensor"
        };

        return await this.persistLogEntity(toCreate);
    }

    // Private helper extracted to remove duplicated validation and persistence logic
    private async persistLogEntity(payload: CreateTemperatureLogEntity): Promise<TemperatureLog> {
        await this.validateStorageFacilityExistsAndActive(payload.storageFacilityId);

        this.validateTemperatureBounds(payload.temperatureReading);

        payload.alertTriggered ??= payload.temperatureReading > 4.5;

        return await temperatureLogsRepository.create(payload);
    }

    async getById(id: number): Promise<TemperatureLog> {
        const log = await temperatureLogsRepository.findById(id);

        if (!log) throw new AppError(404, "Temperature log not found.");

        return log;
    }

    async list(filters: TemperatureLogFilters): Promise<PaginatedTemperatureLogs> {
        return await temperatureLogsRepository.findAll(filters);
    }
}

export const temperatureLogsService = new TemperatureLogsService();
