import { Router } from "express";

import {
    runDeliveryPlanning,
    runTemperatureSimulation,
} from "./cron.controller.js";

const router = Router();

router.get(
    "/deliveries",
    runDeliveryPlanning
);

router.get(
    "/temperature-logs",
    runTemperatureSimulation
);

export default router;