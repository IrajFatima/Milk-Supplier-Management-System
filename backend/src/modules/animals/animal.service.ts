import { animalRepository } from "./animal.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { Shed } from "../../shared/types/animal.types.js";
import {
    Animal,
    AnimalFilters,
    CreateAnimalRequest,
    UpdateAnimalRequest,
    RelocateAnimalRequest,
    DeactivateAnimalRequest,
    PaginatedAnimals,
    ParentAnimal,
    ReactivateAnimalRequest,
    ChangeAnimalStatusRequest
} from "../../shared/types/animal.types.js";
import { ANIMAL_BREEDS } from "../../shared/constants/animalBreed.js";
import { ANIMAL_STATUS } from "../../shared/constants/animalStatus.js";

export class AnimalService {
    async create(payload: CreateAnimalRequest): Promise<Animal> {
        const existingAnimal = await animalRepository.findByTagId(payload.tagId);

        if (existingAnimal) {
            throw new AppError(409, "Tag ID already exists.");
        }

        const validBreeds = ANIMAL_BREEDS[payload.species];

        if (!validBreeds.includes(payload.breed as never)) {
            throw new AppError(
                400,
                `Invalid breed for selected species '${payload.species}'.`
            );
        }

        if (payload.parentAnimal) {
            const parentExists = await animalRepository.existsById(
                payload.parentAnimal
            );

            if (!parentExists) {
                throw new AppError(404, "Parent animal not found.");
            }
        }

        const shed = await animalRepository.getAvailableShed(payload.shedId);

        if (!shed)
            throw new AppError(404, "Shed not found.");

        if (shed.status !== "Active")
            throw new AppError(400, "Shed is inactive.");

        if (shed.current_occupancy >= shed.capacity)
            throw new AppError(400, "Shed is already full.");

        return await animalRepository.create(payload);
    }

    async getById(animalId: number): Promise<Animal> {
        const animal = await animalRepository.findById(animalId);

        if (!animal) {
            throw new AppError(404, "Animal not found.");
        }

        return animal;
    }

    async list(filters: AnimalFilters): Promise<PaginatedAnimals> {

        return await animalRepository.list(filters);
    }

    async update(
        animalId: number,
        payload: UpdateAnimalRequest
    ): Promise<Animal> {
        const animal = await animalRepository.findById(animalId);

        if (!animal) {
            throw new AppError(404, "Animal not found.");
        }

        return await animalRepository.update(animalId, payload);
    }

    async relocate(
        animalId: number,
        payload: RelocateAnimalRequest
    ): Promise<Animal> {
        const animal = await animalRepository.findById(animalId);

        if (!animal) {
            throw new AppError(404, "Animal not found.");
        }
        if (animal.shedId === payload.shedId) {
            throw new AppError(
                400,
                "Animal is already assigned to this shed."
            );
        }

        const shed = await animalRepository.getAvailableShed(payload.shedId);

        if (!shed)
            throw new AppError(404, "Shed not found.");

        if (shed.status !== "Active")
            throw new AppError(400, "Shed is inactive.");

        if (shed.current_occupancy >= shed.capacity)
            throw new AppError(400, "Shed is already full.");

        return await animalRepository.relocate(animalId, payload.shedId);
    }

    async deactivate(
        animalId: number,
        payload: DeactivateAnimalRequest
    ): Promise<void> {
        const animal = await animalRepository.findById(animalId);

        if (!animal) {
            throw new AppError(404, "Animal not found.");
        }
        if (
            animal.operationalStatus === ANIMAL_STATUS.SOLD ||
            animal.operationalStatus === ANIMAL_STATUS.DECEASED
        ) {
            throw new AppError(
                400,
                "Animal is already inactive."
            );
        }

        if (
            payload.status !== ANIMAL_STATUS.SOLD &&
            payload.status !== ANIMAL_STATUS.DECEASED
        ) {
            throw new AppError(
                400,
                "Animal can only be marked as Sold or Deceased."
            );
        }

        await animalRepository.deactivate(animalId, payload.status);
    }
    async reactivate(
        animalId: number,
        payload: ReactivateAnimalRequest
    ): Promise<void> {

        const animal = await animalRepository.findById(animalId);

        if (!animal) {
            throw new AppError(404, "Animal not found.");
        }

        if (
            animal.operationalStatus !== ANIMAL_STATUS.SOLD &&
            animal.operationalStatus !== ANIMAL_STATUS.DECEASED
        ) {
            throw new AppError(
                400,
                "Only sold or deceased animals can be reactivated."
            );
        }

        if (
            payload.operationalStatus === ANIMAL_STATUS.SOLD ||
            payload.operationalStatus === ANIMAL_STATUS.DECEASED
        ) {
            throw new AppError(
                400,
                "Please select a valid active status."
            );
        }

        const shed = await animalRepository.getAvailableShed(payload.shedId);

        if (!shed) {
            throw new AppError(404, "Shed not found.");
        }

        if (shed.status !== "Active") {
            throw new AppError(400, "Shed is inactive.");
        }

        if (shed.current_occupancy >= shed.capacity) {
            throw new AppError(400, "Shed is already full.");
        }

        await animalRepository.reactivate(
            animalId,
            payload.operationalStatus,
            payload.shedId
        );
    }

    async changeStatus(
        animalId: number,
        payload: ChangeAnimalStatusRequest
    ): Promise<void> {

        const animal = await animalRepository.findById(animalId);

        if (!animal) {
            throw new AppError(404, "Animal not found.");
        }

        if (
            animal.operationalStatus === ANIMAL_STATUS.SOLD ||
            animal.operationalStatus === ANIMAL_STATUS.DECEASED
        ) {
            throw new AppError(
                400,
                "Inactive animals cannot have their status changed."
            );
        }

        if (
            payload.operationalStatus === ANIMAL_STATUS.SOLD ||
            payload.operationalStatus === ANIMAL_STATUS.DECEASED
        ) {
            throw new AppError(
                400,
                "Use the deactivate endpoint to mark an animal as Sold or Deceased."
            );
        }

        if (animal.operationalStatus === payload.operationalStatus) {
            throw new AppError(
                400,
                "Animal already has this status."
            );
        }

        await animalRepository.changeStatus(
            animalId,
            payload.operationalStatus
        );
    }
    async getSheds(): Promise<Shed[]> {
        return await animalRepository.getSheds();
    }
    async getParents(): Promise<ParentAnimal[]> {
        return await animalRepository.getParents();
    }
}

export const animalService = new AnimalService();