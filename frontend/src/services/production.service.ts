import api from "./api";
import type {
  Production,
  CreateProductionRequest,
  UpdateProductionRequest,
  ProductionFilters,
  PaginatedProduction,
  ProductionAnimal,
  StorageFacility,
} from "../types/production.types";

export const productionService = {
  async getProductions(filters: ProductionFilters): Promise<PaginatedProduction> {
    const response = await api.get("/production", { params: filters });

    return response.data.data;
  },

  async getProductionById(id: number): Promise<Production> {
    const response = await api.get(`/production/${id}`);

    return response.data.data.production;
  },

  async createProduction(
    payload: CreateProductionRequest
  ): Promise<Production> {
    const response = await api.post("/production", payload);

    return response.data.data.production ?? response.data.data;
  },

  async updateProduction(
    id: number,
    payload: UpdateProductionRequest
  ): Promise<Production> {
    const response = await api.put(`/production/${id}`, payload);

    return response.data.data.production ?? response.data.data;
  },

  async voidProduction(id: number): Promise<void> {
    await api.patch(`/production/${id}/void`);
  },

  async getProductionAnimals(): Promise<ProductionAnimal[]> {
    const response = await api.get("/production/animals");

    return response.data.data.animals;
  },

  async getStorageFacilities(): Promise<StorageFacility[]> {
    const response = await api.get("/production/storage-facilities");

    return response.data.data.storageFacilities;
  },
};
