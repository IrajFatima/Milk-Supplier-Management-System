import type { AnimalStatus } from "../constants/animalStatus";
import type { AnimalSpecies } from "../constants/animalSpecies";
import type { AnimalGender } from "../constants/animalGender";
import type { AcquisitionSource } from "../constants/acquisitionSource";

export interface Animal {
    animalId: number;
    tagId: string;
    name: string | null;
    species: AnimalSpecies;
    breed: string;
    gender: AnimalGender;
    dateOfBirth: string;
    acquisitionSource: AcquisitionSource;
    purchaseInformation: string | null;
    parentAnimal: number | null;
    parentAnimalName?: string | null;
    currentWeight: number | null;
    operationalStatus: AnimalStatus;
    shedId: number | null;
    shedName?: string | null;
    registrationDate: string;
}

export interface CreateAnimalRequest {
    tagId: string;
    name?: string;
    species: AnimalSpecies;
    breed: string;
    gender: AnimalGender;
    dateOfBirth: string;
    acquisitionSource: AcquisitionSource;
    purchaseInformation?: string;
    parentAnimal?: number;
    currentWeight?: number;
    operationalStatus: AnimalStatus;
    shedId: number;
}

export interface UpdateAnimalRequest {
    name?: string;
    currentWeight?: number;
}

export interface RelocateAnimalRequest {
    shedId: number;
}

export interface DeactivateAnimalRequest {
    status: "Sold" | "Deceased";
}

export interface AnimalFilters {
    page: number;
    limit: number;
    search?: string;
    species?: AnimalSpecies;
    gender?: AnimalGender;
    status?: AnimalStatus;
    shedId?: number;
}

export interface AnimalListItem {
    animalId: number;
    tagId: string;
    name: string | null;
    species: AnimalSpecies;
    breed: string;
    gender: AnimalGender;
    operationalStatus: AnimalStatus;
    shedId: number | null;
    shedName: string | null;
    registrationDate: string;
    dateOfBirth: string;
}

export interface PaginatedAnimals {
    data: AnimalListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface ShedDropdown {
    shedId: number;
    shedName: string;
    shedType: string | null;
    locationArea: string | null;
    capacity: number;
    currentOccupancy: number;
    availableCapacity: number;
    status: string;
    remarks: string | null;
}
export interface ParentAnimal {
    animalId: number;
    tagId: string;
    name: string | null;
    gender: string;
}