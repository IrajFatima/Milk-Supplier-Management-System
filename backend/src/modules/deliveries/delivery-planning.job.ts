// src/modules/deliveries/delivery-planning.job.ts

import cron, { ScheduledTask } from "node-cron";

import { orderRepository } from "../orders/order.repository.js";
import { deliveryService } from "./delivery.service.js";
import { deliveryRepository } from "./delivery.repository.js";

export class DeliveryPlanningJob {
    private task: ScheduledTask | null = null;

    start(): void {
        // Runs every 5 minutes
        this.task = cron.schedule("*/5 * * * *", async () => {
            try {
                console.log(
                    "[Delivery Planning] Checking whether deliveries should be generated..."
                );

                const cutoff =
                    await deliveryRepository.getDeliveryPlanningCutoffTime();

                if (!cutoff) {
                    console.warn(
                        "[Delivery Planning] Delivery cutoff time not configured."
                    );
                    return;
                }

                const now = new Date();

                const [hours, minutes] = cutoff
                    .split(":")
                    .map(Number);

                const cutoffTime = new Date(now);

                cutoffTime.setHours(hours, minutes, 0, 0);

                // Wait until cutoff time
                if (now < cutoffTime) {
                    return;
                }

                // Tomorrow
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const deliveryDate =
                    `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")
                    }-${String(tomorrow.getDate()).padStart(2, "0")
                    }`;

                const created =
                    await deliveryService.generateDeliveriesForDate(
                        deliveryDate
                    );

                console.log(
                    `[Delivery Planning] ${created} deliveries generated for ${deliveryDate}.`
                );
            } catch (error) {
                console.error(
                    "[Delivery Planning] Failed:",
                    error
                );
            }
        });

        console.log(
            "[Delivery Planning] Scheduler started."
        );
    }

    stop(): void {
        this.task?.stop();
        this.task = null;

        console.log(
            "[Delivery Planning] Scheduler stopped."
        );
    }
}

export const deliveryPlanningJob =
    new DeliveryPlanningJob();