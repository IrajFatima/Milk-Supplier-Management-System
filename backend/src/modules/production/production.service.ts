import { productionRepository } from "./production.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import {
    Production,
    CreateProductionRequest,
    UpdateProductionRequest,
    ProductionFilters,
    PaginatedProduction,
    ProductionAnimal,
    StorageFacility
} from "../../shared/types/production.types.js";

export class ProductionService {

    private async validateProduction(
        animalId: number,
        productionDate: string,
        productionShift: string,
        quantityProduced: number,
        fatPercentage: number,
        snfPercentage: number,
        milkTemperature: number,
        excludeProductionId?: number
    ): Promise<void> {

        // Check animal exists
        const animal = await productionRepository.findAnimalById(animalId);

        if (!animal) {
            throw new AppError(404, "Selected animal does not exist.");
        }

        // Female only
        if (animal.gender !== "Female") {
            throw new AppError(
                400,
                "Milk production can only be recorded for female animals."
            );
        }

        // Lactating only
        if (animal.operationalStatus !== "Lactating") {
            throw new AppError(
                400,
                `Milk production can only be recorded for animals in Lactating status. This animal is currently ${animal.operationalStatus}.`
            );
        }

        // Future date restriction
        const production = new Date(productionDate);
        const today = new Date();

        production.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (production > today) {
            throw new AppError(
                400,
                "Production date cannot be in the future."
            );
        }

        // Before registration
        const registration = new Date(animal.registrationDate);
        registration.setHours(0, 0, 0, 0);

        if (production < registration) {
            throw new AppError(
                400,
                "Production date cannot be earlier than the animal's registration date."
            );
        }

        // Quantity validation
        if (quantityProduced <= 0) {
            throw new AppError(
                400,
                "Quantity produced must be greater than zero liters."
            );
        }

        if (quantityProduced > 40) {
            throw new AppError(
                400,
                "Quantity produced exceeds the maximum allowed limit of 40 liters per shift."
            );
        }

        // Fat %
        if (fatPercentage < 3 || fatPercentage > 9) {
            throw new AppError(
                400,
                "Fat percentage must be between 3% and 9%."
            );
        }

        // SNF %
        if (snfPercentage < 8 || snfPercentage > 11) {
            throw new AppError(
                400,
                "SNF percentage must be between 8% and 11%."
            );
        }

        // Temperature
        if (milkTemperature < 2 || milkTemperature > 6) {
            throw new AppError(
                400,
                "Milk temperature must be between 2°C and 6°C."
            );
        }

        // Duplicate production
        const duplicate = await productionRepository.findDuplicateProduction(
            animalId,
            productionDate,
            productionShift,
            excludeProductionId
        );

        if (duplicate) {
            throw new AppError(
                409,
                `Production record already exists for this animal on ${productionDate} ${productionShift}.`
            );
        }
    }

    async create(payload: CreateProductionRequest): Promise<Production> {

        await this.validateProduction(
            payload.animalId,
            payload.productionDate,
            payload.productionShift,
            payload.quantityProduced,
            payload.fatPercentage,
            payload.snfPercentage,
            payload.milkTemperature
        );

        return await productionRepository.create(payload);
    }

    async getById(productionId: number): Promise<Production> {
        const production = await productionRepository.findById(productionId);

        if (!production) {
            throw new AppError(404, "Production record not found.");
        }
        if (production.status === "Voided") {
            throw new AppError(
                400,
                "Voided production records cannot be updated."
            );
        }

        return production;
    }

    async list(filters: ProductionFilters): Promise<PaginatedProduction> {
        return await productionRepository.findAll(filters);
    }

    async update(
        productionId: number,
        payload: UpdateProductionRequest
    ): Promise<Production> {

        if (Object.keys(payload).length === 0) {
            throw new AppError(
                400,
                "At least one field is required for update."
            );
        }

        const production = await productionRepository.findById(productionId);

        if (!production) {
            throw new AppError(404, "Production record not found.");
        }

        if (production.status === "Voided") {
            throw new AppError(
                400,
                "Voided production records cannot be updated."
            );
        }

        await this.validateProduction(
            production.animalId,
            payload.productionDate ?? production.productionDate,
            payload.productionShift ?? production.productionShift,
            payload.quantityProduced ?? production.quantityProduced,
            payload.fatPercentage ?? production.fatPercentage,
            payload.snfPercentage ?? production.snfPercentage,
            payload.milkTemperature ?? production.milkTemperature,
            productionId
        );

        return await productionRepository.update(
            productionId,
            payload
        ) as Production;
    }

    async void(productionId: number): Promise<void> {

        const production = await productionRepository.findById(productionId);

        if (!production) {
            throw new AppError(404, "Production record not found.");
        }

        if (production.status === "Voided") {
            throw new AppError(400, "Production record is already voided.");
        }

        await productionRepository.void(productionId);
    }

    async getAnimals(): Promise<ProductionAnimal[]> {
        return await productionRepository.getAnimals();
    }

    async getStorageFacilities(): Promise<StorageFacility[]> {
        return await productionRepository.getStorageFacilities();
    }
}

export const productionService = new ProductionService();