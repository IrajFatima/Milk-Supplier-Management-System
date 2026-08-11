import { deliveryService } from "./delivery.service.js";
import { deliveryRepository } from "./delivery.repository.js";

const BUSINESS_TIME_ZONE = "Asia/Karachi";

export class DeliveryPlanningJob {
    async execute(): Promise<void> {
        console.log(
            "[Delivery Planning] Running scheduled delivery tasks..."
        );

        // Mark overdue deliveries as failed
        const failed =
            await deliveryService.markExpiredDeliveriesAsFailed();

        if (failed > 0) {
            console.log(
                `[Delivery Planning] ${failed} overdue deliveries marked as Failed.`
            );
        }

        // Get configured delivery planning cutoff time
        const cutoff =
            await deliveryRepository.getDeliveryPlanningCutoffTime();

        if (!cutoff) {
            console.warn(
                "[Delivery Planning] Delivery cutoff time not configured."
            );
            return;
        }

        const now = new Date();

        if (!this.isAfterCutoff(now, cutoff)) {
            console.log(
                `[Delivery Planning] Cutoff ${cutoff} has not been reached yet.`
            );
            return;
        }

        const deliveryDate = this.getTomorrowDate(now);

        const created =
            await deliveryService.generateDeliveriesForDate(
                deliveryDate
            );

        console.log(
            `[Delivery Planning] ${created} deliveries generated for ${deliveryDate}.`
        );
    }

    private isAfterCutoff(
        date: Date,
        cutoff: string
    ): boolean {
        const [hours, minutes] = cutoff
            .split(":")
            .map(Number);

        if (
            Number.isNaN(hours) ||
            Number.isNaN(minutes) ||
            hours < 0 ||
            hours > 23 ||
            minutes < 0 ||
            minutes > 59
        ) {
            throw new Error(
                `Invalid delivery cutoff time: ${cutoff}`
            );
        }

        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: BUSINESS_TIME_ZONE,
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        });

        const parts = formatter.formatToParts(date);

        const currentHour = Number(
            parts.find(
                (part) => part.type === "hour"
            )?.value
        );

        const currentMinute = Number(
            parts.find(
                (part) => part.type === "minute"
            )?.value
        );

        const currentMinutes =
            currentHour * 60 + currentMinute;

        const cutoffMinutes =
            hours * 60 + minutes;

        return currentMinutes >= cutoffMinutes;
    }

    private getTomorrowDate(date: Date): string {
        const formatter = new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: BUSINESS_TIME_ZONE,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }
        );

        const parts = formatter.formatToParts(date);

        const year = parts.find(
            (part) => part.type === "year"
        )?.value;

        const month = parts.find(
            (part) => part.type === "month"
        )?.value;

        const day = parts.find(
            (part) => part.type === "day"
        )?.value;

        if (!year || !month || !day) {
            throw new Error(
                "Unable to determine business date."
            );
        }

        const currentDate = new Date(
            `${year}-${month}-${day}T00:00:00Z`
        );

        currentDate.setUTCDate(
            currentDate.getUTCDate() + 1
        );

        return `${currentDate.getUTCFullYear()}-${String(
            currentDate.getUTCMonth() + 1
        ).padStart(2, "0")}-${String(
            currentDate.getUTCDate()
        ).padStart(2, "0")}`;
    }
}

export const deliveryPlanningJob =
    new DeliveryPlanningJob();