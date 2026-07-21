import type { AnimalStatus } from "../constants/animalStatus.js";
import type { AnimalSpecies } from "../constants/animalSpecies.js";
import type { AnimalGender } from "../constants/animalGender.js";
import type { AcquisitionSource } from "../constants/acquisitionSource.js";

export interface Animal {
  animalId: number;
  tagId: string;
  name: string | null;
  species: AnimalSpecies;
  breed: string;
  gender: AnimalGender;
  dateOfBirth: Date;
  acquisitionSource: AcquisitionSource;
  purchaseInformation: string | null;
  parentAnimal: number | null;
  parentAnimalName?: string | null;
  currentWeight: number | null;
  operationalStatus: AnimalStatus;
  shedName?: string | null;
  shedId: number | null;
  registrationDate: Date;
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
  status: Extract<AnimalStatus, "Sold" | "Deceased">;
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
  registrationDate: Date;
  dateOfBirth: Date;
}

export interface PaginatedAnimals {
  data: AnimalListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface Shed {
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