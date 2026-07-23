export interface TemperatureLog {
    logId: number;
    storageFacilityId: number;
    recordingDateTime: string;
    temperatureReading: number;
    recordingType: string;
    operator: number | null;
    alertTriggered: boolean;
    remarks?: string | null;
    createdDate: string;

    // Joined fields
    facilityName?: string;
    operatorName?: string | null;
}

export interface CreateTemperatureLogRequest {
    storageFacilityId: number;
    recordingDateTime: string;
    temperatureReading: number;
    remarks?: string | null;
}
// specific to backend
export interface CreateTemperatureLogEntity {
    storageFacilityId: number;
    recordingDateTime: string;
    temperatureReading: number;
    recordingType: string; // will be set by service to "Manual"
    operator: number | null;
    alertTriggered: boolean;
    remarks?: string | null;
}

export interface TemperatureLogFilters {
    page?: number;
    limit?: number;
    search?: string;
    storageFacilityId?: number;
    alertTriggered?: boolean;
    recordingType?: string;
}

export interface PaginatedTemperatureLogs {
    data: TemperatureLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
