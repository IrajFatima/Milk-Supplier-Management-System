export interface TemperatureLog {
    logId: number;
    storageFacilityId: number;
    temperatureReading: number;
    recordingDateTime: string; // ISO8601
    recordingType: 'Manual' | 'Automated Sensor';
    alertTriggered: boolean;

    // joined/display fields
    facilityName?: string;
    operatorName?: string;
    operator: number | null;
    remarks?: string | null;
}

export interface CreateTemperatureLogRequest {
    storageFacilityId: number;
    recordingDateTime: string; // ISO8601
    temperatureReading: number;
    remarks?: string;
}

export interface TemperatureLogFilters {
    page?: number;
    limit?: number;
    search?: string;
    storageFacilityId?: number;
    alertTriggered?: boolean | string; // allow 'true'/'false' in query
    recordingType?: 'Manual' | 'Automated Sensor' | string;
}

export interface PaginatedTemperatureLogs {
    data: TemperatureLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
