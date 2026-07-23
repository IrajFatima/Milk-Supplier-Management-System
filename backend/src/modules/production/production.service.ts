import { productionRepository } from "./production.repository.js";
import { pool } from "../../config/database.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { PoolClient } from "pg";
import {
    Production,
    CreateProductionRequest,
    UpdateProductionRequest,
    ProductionFilters,
    PaginatedProduction,
    ProductionAnimal,
    StorageFacility,
    MilkInventory
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

        const client: PoolClient = await pool.connect();

        try {
            await client.query("BEGIN");

            const facility =
                await productionRepository.findStorageFacilityById(
                    payload.facilityId,
                    client
                );

            if (!facility) {
                throw new AppError(
                    404,
                    "Selected storage facility does not exist."
                );
            }
            // Insert production within transaction (returns id when client provided)
            const productionId = await productionRepository.create(payload, client) as number;

            // Inventory integration only when Passed
            if (payload.qualityStatus === "Passed") {
                await this.integrateInventory(
                    client,
                    payload
                );
            }

            await client.query("COMMIT");

            const production = await productionRepository.findById(productionId);

            if (!production) throw new AppError(500, "Failed to retrieve created production.");

            return production;

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    // Inventory integration extracted for clarity and reduced complexity of create()
    private async integrateInventory(
        client: PoolClient,
        payload: CreateProductionRequest
    ): Promise<void> {
        // Validate facility
        const facility = await productionRepository.findStorageFacilityById(payload.facilityId, client);

        if (!facility) {
            throw new AppError(404, "Selected storage facility does not exist.");
        }

        const totalCapacity = Number(facility.totalCapacity ?? 0);

        // Current inventory quantity
        const currentInventory = await productionRepository.getFacilityInventory(payload.facilityId, client);

        const availableCapacity = totalCapacity - Number(currentInventory);

        if (payload.quantityProduced > availableCapacity) {
            throw new AppError(400, "Insufficient storage capacity for this production quantity.");
        }

        // Inventory row for Bulk package
        const existingInventory = await productionRepository.getInventoryByFacilityAndPackage(payload.facilityId, "Bulk", client);

        if (existingInventory) {
            await productionRepository.incrementInventory(
                existingInventory.inventoryId,
                payload.quantityProduced,
                payload.recordedBy,
                client
            );
        } else {
            await productionRepository.createInventory(
                payload.facilityId,
                "Bulk",
                payload.qualityStatus,
                payload.quantityProduced,
                totalCapacity,
                payload.recordedBy,
                client
            );
        }
    }

    async getById(productionId: number): Promise<Production> {
        const production = await productionRepository.findById(productionId);

        if (!production) {
            throw new AppError(404, "Production record not found.");
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
        if (production.qualityStatus === "Passed") {

            if (
                payload.quantityProduced !== undefined ||
                payload.productionDate !== undefined ||
                payload.productionShift !== undefined ||
                payload.qualityStatus !== undefined
            ) {
                throw new AppError(
                    400,
                    "Production records that have already been added to inventory only allow updating fat percentage, SNF percentage, and milk temperature."
                );
            }

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

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            if (production.qualityStatus === "Passed") {

                const inventory =
                    await productionRepository.getInventoryByFacilityAndPackage(
                        production.facilityId,
                        "Bulk",
                        client
                    );

                if (inventory) {

                    if (inventory.availableQuantity < production.quantityProduced) {
                        throw new AppError(
                            400,
                            "Inventory quantity is inconsistent. Cannot void production."
                        );
                    }

                    await productionRepository.decrementInventory(
                        inventory.inventoryId,
                        production.quantityProduced,
                        production.recordedBy,
                        client
                    );
                }
            }

            await productionRepository.void(productionId);

            await client.query("COMMIT");

        } catch (error) {

            await client.query("ROLLBACK");
            throw error;

        } finally {
            client.release();
        }
    }

    async getAnimals(): Promise<ProductionAnimal[]> {
        return await productionRepository.getAnimals();
    }

    async getStorageFacilities(): Promise<StorageFacility[]> {
        return await productionRepository.getStorageFacilities();
    }
}

export const productionService = new ProductionService();