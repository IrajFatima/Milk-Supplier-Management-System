import { beforeEach, describe, expect, it, vi } from "vitest";
import { productionController } from "../../../src/modules/production/production.controller.js";
import { productionService } from "../../../src/modules/production/production.service.js";
import { AppError } from "../../../src/shared/errors/AppError.js";

vi.mock("../../../src/modules/production/production.service.js", () => ({
    productionService: {
        create: vi.fn(),
        getById: vi.fn(),
        list: vi.fn(),
        update: vi.fn(),
        void: vi.fn(),
        getAnimals: vi.fn(),
        getStorageFacilities: vi.fn(),
    },
}));

describe("productionController", () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            params: {},
            query: {},
            body: {},
            user: {
                employeeId: 1,
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        next = vi.fn();
    });

    it("creates production", async () => {
        vi.mocked(productionService.create).mockResolvedValue({
            productionId: 1,
        } as any);

        await productionController.create(req, res, next);

        expect(productionService.create).toHaveBeenCalledWith({
            ...req.body,
            recordedBy: 1,
        });

        expect(res.status).toHaveBeenCalledWith(201);
    });

    it("gets production by id", async () => {
        req.params.id = "5";

        vi.mocked(productionService.getById).mockResolvedValue({
            productionId: 5,
        } as any);

        await productionController.getById(req, res, next);

        expect(productionService.getById).toHaveBeenCalledWith(5);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("lists production", async () => {
        vi.mocked(productionService.list).mockResolvedValue({
            data: [],
            total: 0,
            page: 1,
            limit: 20,
        } as any);

        await productionController.list(req, res, next);

        expect(productionService.list).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("updates production", async () => {
        req.params.id = "10";

        vi.mocked(productionService.update).mockResolvedValue({
            productionId: 10,
        } as any);

        await productionController.update(req, res, next);

        expect(productionService.update).toHaveBeenCalledWith(
            10,
            req.body
        );

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("voids production", async () => {
        req.params.id = "3";

        vi.mocked(productionService.void).mockResolvedValue();

        await productionController.void(req, res, next);

        expect(productionService.void).toHaveBeenCalledWith(3);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("gets animals", async () => {
        vi.mocked(productionService.getAnimals).mockResolvedValue([]);

        await productionController.getAnimals(req, res, next);

        expect(productionService.getAnimals).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("gets storage facilities", async () => {
        vi.mocked(productionService.getStorageFacilities).mockResolvedValue([]);

        await productionController.getStorageFacilities(req, res, next);

        expect(productionService.getStorageFacilities).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("passes service errors to next()", async () => {
        const error = new AppError(400, "Failed");

        vi.mocked(productionService.create).mockRejectedValue(error);

        await productionController.create(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});