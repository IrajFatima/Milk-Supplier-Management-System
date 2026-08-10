import { describe, it, expect, vi, beforeEach } from "vitest";
import { animalService } from "../../src/services/animal.service";

const apiMock = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
}));

vi.mock("../../src/services/api", () => ({
    default: apiMock,
}));

describe("animalService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("gets paginated animals with filters", async () => {
        const paginated = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
        };
        apiMock.get.mockResolvedValue({ data: { data: paginated } });

        const result = await animalService.getAnimals({
            page: 1,
            limit: 10,
            search: "tag",
        });

        expect(apiMock.get).toHaveBeenCalledWith("/animals", {
            params: { page: 1, limit: 10, search: "tag" },
        });
        expect(result).toEqual(paginated);
    });

    it("gets a single animal", async () => {
        const animal = { animalId: 5, tagId: "123" };
        apiMock.get.mockResolvedValue({ data: { data: { animal } } });

        const result = await animalService.getAnimal(5);

        expect(apiMock.get).toHaveBeenCalledWith("/animals/5");
        expect(result).toEqual(animal);
    });

    it("creates an animal", async () => {
        const payload = {
            tagId: "123456789012345",
            name: "Bessie",
        };
        apiMock.post.mockResolvedValue({ data: { data: { animalId: 1 } } });

        const result = await animalService.createAnimal(payload as never);

        expect(apiMock.post).toHaveBeenCalledWith("/animals", payload);
        expect(result).toEqual({ animalId: 1 });
    });

    it("updates an animal", async () => {
        apiMock.put.mockResolvedValue({ data: { data: { animalId: 5 } } });

        const result = await animalService.updateAnimal(5, { name: "New" });

        expect(apiMock.put).toHaveBeenCalledWith("/animals/5", { name: "New" });
        expect(result).toEqual({ animalId: 5 });
    });

    it("relocates an animal", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });

        await animalService.relocateAnimal(5, { shedId: 2 });

        expect(apiMock.patch).toHaveBeenCalledWith("/animals/5/relocate", {
            shedId: 2,
        });
    });

    it("deactivates an animal", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });

        await animalService.deactivateAnimal(5, { status: "Sold" });

        expect(apiMock.patch).toHaveBeenCalledWith("/animals/5/deactivate", {
            status: "Sold",
        });
    });

    it("reactivates an animal", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });

        await animalService.reactivateAnimal(5, {
            operationalStatus: "Lactating",
            shedId: 2,
        });

        expect(apiMock.patch).toHaveBeenCalledWith("/animals/5/reactivate", {
            operationalStatus: "Lactating",
            shedId: 2,
        });
    });

    it("changes an animal status", async () => {
        apiMock.patch.mockResolvedValue({ data: {} });

        await animalService.changeAnimalStatus(5, {
            operationalStatus: "Lactating",
        });

        expect(apiMock.patch).toHaveBeenCalledWith("/animals/5/status", {
            operationalStatus: "Lactating",
        });
    });

    it("gets sheds", async () => {
        const sheds = [{ shedId: 1, shedName: "Shed A" }];
        apiMock.get.mockResolvedValue({ data: { data: { sheds } } });

        const result = await animalService.getSheds();

        expect(apiMock.get).toHaveBeenCalledWith("/animals/sheds");
        expect(result).toEqual(sheds);
    });

    it("gets parent animals", async () => {
        const parents = [{ animalId: 1, tagId: "T1" }];
        apiMock.get.mockResolvedValue({ data: { data: { parents } } });

        const result = await animalService.getParentAnimals();

        expect(apiMock.get).toHaveBeenCalledWith("/animals/parent");
        expect(result).toEqual(parents);
    });
});
