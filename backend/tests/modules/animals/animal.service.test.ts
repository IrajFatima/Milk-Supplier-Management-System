import { beforeEach, describe, expect, it, vi } from "vitest";

import { animalService } from "../../../src/modules/animals/animal.service.js";
import { animalRepository } from "../../../src/modules/animals/animal.repository.js";
import { AppError } from "../../../src/shared/errors/AppError.js";
import { ANIMAL_STATUS } from "../../../src/shared/constants/animal.js";

vi.mock("../../../src/modules/animals/animal.repository.js", () => ({
    animalRepository: {
        findByTagId: vi.fn(),
        existsById: vi.fn(),
        getAvailableShed: vi.fn(),
        create: vi.fn(),

        findById: vi.fn(),
        list: vi.fn(),
        update: vi.fn(),
        relocate: vi.fn(),

        deactivate: vi.fn(),
        reactivate: vi.fn(),
        changeStatus: vi.fn(),

        getSheds: vi.fn(),
        getParents: vi.fn(),
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
});

const activeShed = {
    shedId: 1,
    status: "Active",
    capacity: 10,
    current_occupancy: 2,
};

const animal = {
    animalId: 1,
    tagId: "A-001",
    species: "Cow",
    breed: "Jersey",
    shedId: 1,
    operationalStatus: ANIMAL_STATUS.LACTATING,
};

it("creates an animal", async () => {
    vi.mocked(animalRepository.findByTagId).mockResolvedValue(null);
    vi.mocked(animalRepository.getAvailableShed).mockResolvedValue(activeShed as any);
    vi.mocked(animalRepository.create).mockResolvedValue(animal as any);

    const payload = {
        tagId: "A-001",
        species: "Cow",
        breed: "Jersey",
        shedId: 1,
    };

    const result = await animalService.create(payload as any);

    expect(result).toEqual(animal);
    expect(animalRepository.create).toHaveBeenCalledWith(payload);
});

it("throws if tag already exists", async () => {
    vi.mocked(animalRepository.findByTagId).mockResolvedValue(animal as any);

    await expect(
        animalService.create({ tagId: "A-001" } as any)
    ).rejects.toThrow(AppError);
});

it("throws for invalid breed", async () => {
    vi.mocked(animalRepository.findByTagId).mockResolvedValue(null);

    await expect(
        animalService.create({
            tagId: "A-001",
            species: "Cow",
            breed: "Random",
        } as any)
    ).rejects.toThrow("Invalid breed");
});

it("throws if shed is full", async () => {
    vi.mocked(animalRepository.findByTagId).mockResolvedValue(null);

    vi.mocked(animalRepository.getAvailableShed).mockResolvedValue({
        ...activeShed,
        current_occupancy: 10,
    } as any);

    await expect(
        animalService.create({
            tagId: "A-001",
            species: "Cow",
            breed: "Jersey",
            shedId: 1,
        } as any)
    ).rejects.toThrow("Shed is already full.");
});

it("returns an animal by id", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(animal as any);

    const result = await animalService.getById(1);

    expect(result).toEqual(animal);
});

it("throws if animal does not exist", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(null);

    await expect(animalService.getById(1)).rejects.toThrow(
        "Animal not found."
    );
});

it("returns paginated animals", async () => {
    const response = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
    };

    vi.mocked(animalRepository.list).mockResolvedValue(response as any);

    const result = await animalService.list({} as any);

    expect(result).toEqual(response);
});

it("updates an animal", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(animal as any);
    vi.mocked(animalRepository.update).mockResolvedValue(animal as any);

    await animalService.update(1, {} as any);

    expect(animalRepository.update).toHaveBeenCalled();
});

it("throws when updating missing animal", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(null);

    await expect(
        animalService.update(1, {} as any)
    ).rejects.toThrow("Animal not found.");
});

it("relocates an animal", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(animal as any);
    vi.mocked(animalRepository.getAvailableShed).mockResolvedValue(activeShed as any);
    vi.mocked(animalRepository.relocate).mockResolvedValue(animal as any);

    await animalService.relocate(1, { shedId: 2 });

    expect(animalRepository.relocate).toHaveBeenCalledWith(1, 2);
});

it("throws when relocating to same shed", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(animal as any);

    await expect(
        animalService.relocate(1, { shedId: 1 })
    ).rejects.toThrow("Animal is already assigned to this shed.");
});

it("deactivates an animal", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(animal as any);

    await animalService.deactivate(1, {
        status: ANIMAL_STATUS.SOLD,
    });

    expect(animalRepository.deactivate).toHaveBeenCalled();
});

it("throws if animal is already inactive", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue({
        ...animal,
        operationalStatus: ANIMAL_STATUS.SOLD,
    } as any);

    await expect(
        animalService.deactivate(1, {
            status: ANIMAL_STATUS.SOLD,
        })
    ).rejects.toThrow("Animal is already inactive.");
});

it("reactivates an animal", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue({
        ...animal,
        operationalStatus: ANIMAL_STATUS.SOLD,
    } as any);

    vi.mocked(animalRepository.getAvailableShed).mockResolvedValue(activeShed as any);

    await animalService.reactivate(1, {
        operationalStatus: ANIMAL_STATUS.LACTATING,
        shedId: 1,
    });

    expect(animalRepository.reactivate).toHaveBeenCalled();
});

it("throws if animal is already active", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(animal as any);

    await expect(
        animalService.reactivate(1, {
            operationalStatus: ANIMAL_STATUS.LACTATING,
            shedId: 1,
        })
    ).rejects.toThrow("Only sold or deceased animals can be reactivated.");
});

it("changes animal status", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(animal as any);

    await animalService.changeStatus(1, {
        operationalStatus: ANIMAL_STATUS.PREGNANT,
    });

    expect(animalRepository.changeStatus).toHaveBeenCalled();
});

it("throws when changing to same status", async () => {
    vi.mocked(animalRepository.findById).mockResolvedValue(animal as any);

    await expect(
        animalService.changeStatus(1, {
            operationalStatus: ANIMAL_STATUS.LACTATING,
        })
    ).rejects.toThrow("Animal already has this status.");
});

it("returns sheds", async () => {
    vi.mocked(animalRepository.getSheds).mockResolvedValue([]);

    const result = await animalService.getSheds();

    expect(result).toEqual([]);
});


it("returns parent animals", async () => {
    vi.mocked(animalRepository.getParents).mockResolvedValue([]);

    const result = await animalService.getParents();

    expect(result).toEqual([]);
});

