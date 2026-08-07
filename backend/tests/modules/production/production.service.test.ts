import { beforeEach, describe, expect, it, vi } from "vitest";
import { productionService } from "../../../src/modules/production/production.service.js";
import { productionRepository } from "../../../src/modules/production/production.repository.js";
import { animalRepository } from "../../../src/modules/animals/animal.repository.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock("../../../src/modules/production/production.repository.js", () => ({
    productionRepository: {
        findDuplicateProduction: vi.fn(),
        findStorageFacilityById: vi.fn(),
        create: vi.fn(),
        findById: vi.fn(),
        findAll: vi.fn(),
        getStorageFacilities: vi.fn(),
        getAnimals: vi.fn(),
        getInventoryByFacilityPackageAndMilkType: vi.fn(),
        getFacilityInventory: vi.fn(),
        createInventory: vi.fn(),
        incrementInventory: vi.fn(),
        decrementInventory: vi.fn(),
        void: vi.fn(),
        findMilkTypeByName: vi.fn(),
    },
}));

vi.mock("../../../src/modules/animals/animal.repository.js", () => ({
    animalRepository: {
        findById: vi.fn(),
    },
}));

vi.mock("../../../src/config/database.js", () => ({
    pool: {
        connect: vi.fn(),
    },
}));

describe("productionService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates production records", async () => {
        const client: any = {
            query: vi.fn(),
            release: vi.fn(),
        };

        vi.mocked(
            (await import("../../../src/config/database.js")).pool.connect
        ).mockResolvedValue(client);

        vi.mocked(animalRepository.findById).mockResolvedValue({
            gender: "Female",
            operationalStatus: "Lactating",
            registrationDate: "2024-01-01",
            species: "Cow",
        } as any);

        vi.mocked(
            productionRepository.findDuplicateProduction
        ).mockResolvedValue(false);

        vi.mocked(
            productionRepository.findStorageFacilityById
        ).mockResolvedValue({
            totalCapacity: 100,
        } as any);

        vi.mocked(
            productionRepository.findMilkTypeByName
        ).mockResolvedValue({
            milkTypeId: 1,
        } as any);

        vi.mocked(productionRepository.create).mockResolvedValue(1);

        vi.mocked(productionRepository.findById).mockResolvedValue({
            productionId: 1,
        } as any);

        await expect(
            productionService.create({
                animalId: 1,
                productionDate: "2024-01-01",
                productionShift: "Morning",
                quantityProduced: 1,
                fatPercentage: 4,
                snfPercentage: 9,
                milkTemperature: 4,
                qualityStatus: "Failed",
                facilityId: 1,
                recordedBy: 1,
            } as any)
        ).resolves.toEqual({
            productionId: 1,
        });
    });

    it("rejects future production dates", async () => {
        vi.mocked(animalRepository.findById).mockResolvedValue({
            gender: "Female",
            operationalStatus: "Lactating",
            registrationDate: "2020-01-01",
            species: "Cow",
        } as any);

        vi.mocked(
            productionRepository.findDuplicateProduction
        ).mockResolvedValue(false);

        await expect(
            productionService.create({
                animalId: 1,
                productionDate: "2999-01-01",
                productionShift: "Morning",
                quantityProduced: 1,
                fatPercentage: 4,
                snfPercentage: 9,
                milkTemperature: 4,
                qualityStatus: "Failed",
                facilityId: 1,
                recordedBy: 1,
            } as any)
        ).rejects.toBeInstanceOf(AppError);
    });
});