import { Router } from "express";
import { systemConfigurationController } from "./systemConfiguration.controller.js";
import {
    getSystemConfigurationByKeyValidator,
    getSystemConfigurationsValidator,
    updateSystemConfigurationValidator,
} from "./systemConfiguration.validation.js";
import { requireAuth } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();


router.get(
    "/",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    getSystemConfigurationsValidator,
    systemConfigurationController.list
);

router.get(
    "/:configKey",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    getSystemConfigurationByKeyValidator,
    systemConfigurationController.getByConfigKey
);

router.put(
    "/:configKey",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    updateSystemConfigurationValidator,
    systemConfigurationController.update
);

export default router;
