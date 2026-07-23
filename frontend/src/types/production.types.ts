export interface Production {
    productionId: number;
    animalId: number;
    status: "Active" | "Voided";
    productionDate: string;
    productionShift: string;
    quantityProduced: number;
    fatPercentage: number;
    snfPercentage: number;
    milkTemperature: number;
    qualityStatus: string;
    recordedBy: number;
    facilityId: number;
    facilityName?: string;
    // Joined fields
    animalTagId?: string;
    animalName?: string;
    recordedByName?: string;
}

export interface CreateProductionRequest {
    animalId: number;
    productionDate: string;
    productionShift: string;
    quantityProduced: number;
    fatPercentage: number;
    snfPercentage: number;
    milkTemperature: number;
    qualityStatus: string;
    recordedBy?: number;
    facilityId: number;
}

export interface UpdateProductionRequest {
    productionDate?: string;
    productionShift?: string;
    quantityProduced?: number;
    fatPercentage?: number;
    snfPercentage?: number;
    milkTemperature?: number;
    qualityStatus?: string;
}

export interface ProductionFilters {
    page?: number;
    limit?: number;
    search?: string;
    animalId?: number;
    productionDate?: string;
    productionShift?: string;
    qualityStatus?: string;
    status?: string;
}

export interface PaginatedProduction {
    data: Production[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductionAnimal {
    animalId: number;
    tagId: string;
    name: string | null;
}

export interface StorageFacility {
    facilityId: number;
    facilityName: string;
    operationalStatus?: string;
    totalCapacity?: number;
}

export interface MilkInventory {
    inventoryId: number;
    facilityId: number;
    packageType: string;
    qualityStatus: string;
    availableQuantity: number;
    storageCapacity: number;
    responsibleEmployee: number;
    lastUpdatedDate: string;
}