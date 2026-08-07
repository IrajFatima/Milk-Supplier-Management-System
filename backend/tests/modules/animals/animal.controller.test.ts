import { beforeEach, describe, expect, it, vi } from "vitest";
import { validationResult } from "express-validator";

import { animalController } from "../../../src/modules/animals/animal.controller.js";
import { animalService } from "../../../src/modules/animals/animal.service.js";
import { ANIMAL_STATUS } from "../../../src/shared/constants/animal.js";

vi.mock("express-validator", () => ({
    validationResult: vi.fn(),
}));

vi.mock("../../../src/modules/animals/animal.service.js", () => ({
    animalService: {
        create: vi.fn(),
        getById: vi.fn(),
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

describe("animalController", () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {},
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        next = vi.fn();

        vi.clearAllMocks();

        vi.mocked(validationResult).mockReturnValue({
            isEmpty: () => true,
            array: () => [],
        } as any);
    });

    it("creates an animal", async () => {
        vi.mocked(animalService.create).mockResolvedValue({ animalId: 1 } as any);

        await animalController.create(req, res, next);

        expect(animalService.create).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Animal registered successfully.",
            data: {
                animal: { animalId: 1 },
            },
        });
    });

    it("returns animal by id", async () => {
        req.params.id = "1";

        vi.mocked(animalService.getById).mockResolvedValue({ animalId: 1 } as any);

        await animalController.getById(req, res, next);

        expect(animalService.getById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("returns paginated animals", async () => {
        vi.mocked(animalService.list).mockResolvedValue({
            data: [],
            total: 0,
            page: 1,
            limit: 20,
        } as any);

        await animalController.list(req, res, next);

        expect(animalService.list).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("updates an animal", async () => {
        req.params.id = "1";

        vi.mocked(animalService.update).mockResolvedValue({ animalId: 1 } as any);

        await animalController.update(req, res, next);

        expect(animalService.update).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("relocates an animal", async () => {
        req.params.id = "1";

        vi.mocked(animalService.relocate).mockResolvedValue({ animalId: 1 } as any);

        await animalController.relocate(req, res, next);

        expect(animalService.relocate).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("deactivates an animal", async () => {
        req.params.id = "1";
        req.body = { status: ANIMAL_STATUS.SOLD };

        await animalController.deactivate(req, res, next);

        expect(animalService.deactivate).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("reactivates an animal", async () => {
        req.params.id = "1";
        req.body = {
            operationalStatus: ANIMAL_STATUS.LACTATING,
            shedId: 1,
        };

        await animalController.reactivate(req, res, next);

        expect(animalService.reactivate).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("changes animal status", async () => {
        req.params.id = "1";
        req.body = {
            operationalStatus: ANIMAL_STATUS.PREGNANT,
        };

        await animalController.changeStatus(req, res, next);

        expect(animalService.changeStatus).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("returns sheds", async () => {
        vi.mocked(animalService.getSheds).mockResolvedValue([]);

        await animalController.getSheds(req, res, next);

        expect(animalService.getSheds).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                sheds: [],
            },
        });
    });

    it("returns parent animals", async () => {
        vi.mocked(animalService.getParents).mockResolvedValue([]);

        await animalController.getParents(req, res, next);

        expect(animalService.getParents).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: {
                parents: [],
            },
        });
    });

    it("passes service errors to next", async () => {
        const error = new Error("Service failed");

        vi.mocked(animalService.create).mockRejectedValue(error);

        await animalController.create(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});