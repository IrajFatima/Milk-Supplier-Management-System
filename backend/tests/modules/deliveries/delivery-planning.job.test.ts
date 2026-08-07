import { beforeEach, describe, expect, it, vi } from "vitest";
import cron from "node-cron";

import { deliveryPlanningJob } from "../../../src/modules/deliveries/delivery-planning.job.js";
import { deliveryService } from "../../../src/modules/deliveries/delivery.service.js";
import { deliveryRepository } from "../../../src/modules/deliveries/delivery.repository.js";

let scheduledTask: any;
let scheduledCallback: (() => Promise<void>) | undefined;

vi.mock("node-cron", () => ({
    default: {
        schedule: vi.fn((_, callback) => {
            scheduledCallback = callback;

            scheduledTask = {
                stop: vi.fn(),
            };

            return scheduledTask;
        }),
    },
}));

vi.mock("../../../src/modules/deliveries/delivery.service.js", () => ({
    deliveryService: {
        markExpiredDeliveriesAsFailed: vi.fn(),
        generateDeliveriesForDate: vi.fn(),
    },
}));

vi.mock("../../../src/modules/deliveries/delivery.repository.js", () => ({
    deliveryRepository: {
        getDeliveryPlanningCutoffTime: vi.fn(),
    },
}));

describe("deliveryPlanningJob", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(console, "log").mockImplementation(() => {});
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("starts the scheduler", () => {
        deliveryPlanningJob.start();

        expect(cron.schedule).toHaveBeenCalledWith(
            "*/5 * * * *",
            expect.any(Function)
        );
    });

    it("stops the scheduler", () => {
        deliveryPlanningJob.start();

        deliveryPlanningJob.stop();

        expect(scheduledTask.stop).toHaveBeenCalled();
    });

    it("generates deliveries after cutoff time", async () => {
        vi.useFakeTimers();

        vi.setSystemTime(new Date("2026-08-07T19:00:00"));

        vi.mocked(
            deliveryService.markExpiredDeliveriesAsFailed
        ).mockResolvedValue(0);

        vi.mocked(
            deliveryRepository.getDeliveryPlanningCutoffTime
        ).mockResolvedValue("18:00");

        vi.mocked(
            deliveryService.generateDeliveriesForDate
        ).mockResolvedValue(5);

        deliveryPlanningJob.start();

        await scheduledCallback!();

        expect(
            deliveryService.generateDeliveriesForDate
        ).toHaveBeenCalledWith("2026-08-08");

        vi.useRealTimers();
    });

    it("does not generate deliveries before cutoff time", async () => {
        vi.useFakeTimers();

        vi.setSystemTime(new Date("2026-08-07T17:00:00"));

        vi.mocked(
            deliveryService.markExpiredDeliveriesAsFailed
        ).mockResolvedValue(0);

        vi.mocked(
            deliveryRepository.getDeliveryPlanningCutoffTime
        ).mockResolvedValue("18:00");

        deliveryPlanningJob.start();

        await scheduledCallback!();

        expect(
            deliveryService.generateDeliveriesForDate
        ).not.toHaveBeenCalled();

        vi.useRealTimers();
    });
});