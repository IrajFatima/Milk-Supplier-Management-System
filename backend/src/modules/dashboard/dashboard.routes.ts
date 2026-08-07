import { Router } from "express";
import { dashboardController } from "./dashboard.controller.js";
import { requireAuth } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();

router.get(
    "/owner",
    requireAuth,
    requireRole([ROLES.OWNER]),
    dashboardController.getOwnerDashboard
);

router.get(
    "/farm-worker",
    requireAuth,
    requireRole([ROLES.FARM_WORKER]),
    dashboardController.getFarmWorkerDashboard
);

router.get(
    "/delivery-staff",
    requireAuth,
    requireRole([ROLES.DELIVERY_STAFF]),
    dashboardController.getDeliveryStaffDashboard
);

router.get(
    "/accountant",
    requireAuth,
    requireRole([ROLES.ACCOUNTANT]),
    dashboardController.getAccountantDashboard
);

router.get(
    "/system-administrator",
    requireAuth,
    requireRole([ROLES.SYSTEM_ADMINISTRATOR]),
    dashboardController.getSystemAdministratorDashboard
);

export default router;