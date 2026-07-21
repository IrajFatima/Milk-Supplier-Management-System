// src/services/animal.service.ts

import api from "./api";
import type {
  Animal,
  AnimalFilters,
  CreateAnimalRequest,
  DeactivateAnimalRequest,
  PaginatedAnimals,
  ParentAnimal,
  RelocateAnimalRequest,
  ShedDropdown,
  UpdateAnimalRequest,
  ReactivateAnimalRequest,
  ChangeAnimalStatusRequest
} from "../types/animal.types";

export const animalService = {
  async getAnimals(filters: AnimalFilters): Promise<PaginatedAnimals> {
    const response = await api.get("/animals", {
      params: filters,
    });

    return response.data.data;
  },

  async getAnimal(id: number): Promise<Animal> {
    const response = await api.get(`/animals/${id}`);

    return response.data.data.animal;
  },

  async createAnimal(data: CreateAnimalRequest): Promise<Animal> {
    const response = await api.post("/animals", data);

    return response.data.data;
  },

  async updateAnimal(
    id: number,
    data: UpdateAnimalRequest
  ): Promise<Animal> {
    const response = await api.put(`/animals/${id}`, data);

    return response.data.data;
  },

  async relocateAnimal(
    id: number,
    data: RelocateAnimalRequest
  ): Promise<void> {
    await api.patch(`/animals/${id}/relocate`, data);
  },

  async deactivateAnimal(
    id: number,
    data: DeactivateAnimalRequest
  ): Promise<void> {
    await api.patch(`/animals/${id}/deactivate`, data);
  },
  async reactivateAnimal(
    id: number,
    data: ReactivateAnimalRequest
  ): Promise<void> {
    await api.patch(`/animals/${id}/reactivate`, data);
  },
  async changeAnimalStatus(
    id: number,
    data: ChangeAnimalStatusRequest
  ): Promise<void> {
    await api.patch(`/animals/${id}/status`, data);
  },

  async getSheds(): Promise<ShedDropdown[]> {
    const response = await api.get("/animals/sheds");

    return response.data.data.sheds;
  },

  async getParentAnimals(): Promise<ParentAnimal[]> {
    const response = await api.get("/animals/parent");

    return response.data.data.parents;
  },
};
