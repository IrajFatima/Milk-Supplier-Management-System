export interface SystemConfiguration {
    configKey: string;
    configValue: string;
    description: string | null;
    dataType: string;
    isEncrypted: boolean;
    updatedAt: string | null;
    updatedBy: number | null;
    updatedByName?: string | null;
    createdAt: string | null;
    category: string | null;
}

export interface UpdateSystemConfigurationRequest {
    configValue: string;
    description?: string;
}

export interface SystemConfigurationFilters {
    page: number;
    limit: number;
    search?: string;
}

export interface SystemConfigurationListItem {
    configKey: string;
    configValue: string;
    description: string | null;
    dataType: string;
    isEncrypted: boolean;
    updatedAt: string | null;
    category: string | null;
}

export interface PaginatedSystemConfigurations {
    data: SystemConfigurationListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
