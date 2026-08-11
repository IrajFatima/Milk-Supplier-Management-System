import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { deliveryPlanningJob } from "../deliveries/delivery-planning.job.js";
import { temperatureSimulatorJob } from "../temperature-logs/temperature-simulator.job.js";
import { env } from "../../config/env.js";

const getCronSecret = (): string => {
    const secret = env.cronSecret;

    if (!secret) {
        throw new Error(
            "CRON_SECRET is not configured."
        );
    }

    return secret;
};

const verifyCronRequest = (
    req: Request
): boolean => {
    const authorization =
        req.headers.authorization;

    return (
        authorization ===
        `Bearer ${getCronSecret()}`
    );
};

export const runDeliveryPlanning = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!verifyCronRequest(req)) {
            res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });

            return;
        }

        await deliveryPlanningJob.execute();

        res.status(200).json({
            success: true,
            message:
                "Delivery planning job completed.",
        });
    } catch (error) {
        next(error);
    }
};

export const runTemperatureSimulation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!verifyCronRequest(req)) {
            res.status(401).json({
                success: false,
                message: "Unauthorized.",
            });

            return;
        }

        await temperatureSimulatorJob.execute();

        res.status(200).json({
            success: true,
            message:
                "Temperature simulation job completed.",
        });
    } catch (error) {
        next(error);
    }
};