import { Router } from "express";

import { temperatureLogsController } from "./temperature-logs.controller.js";
import {
    createTemperatureLogValidator,
    getTemperatureLogsValidator,
    getTemperatureLogByIdValidator
} from "./temperature-logs.validator.js";

import { requireAuth } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();

// Create manual temperature log
router.post(
    "/",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
    createTemperatureLogValidator,
    temperatureLogsController.create
);

// List paginated temperature logs
router.get(
    "/",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER, ROLES.ACCOUNTANT]),
    getTemperatureLogsValidator,
    temperatureLogsController.list
);

// Get single temperature log
router.get(
    "/:id",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER, ROLES.ACCOUNTANT]),
    getTemperatureLogByIdValidator,
    temperatureLogsController.getById
);

export default router;
