// src/modules/deliveries/delivery.routes.ts

import { Router } from "express";
import { deliveryController } from "./delivery.controller.js";
import {
    assignDeliveryValidator,
    getDeliveriesValidator,
    getDeliveryByIdValidator,
    updateDeliveryStatusValidator,
} from "./delivery.validator.js";
import { requireAuth } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();

// Get paginated deliveries
router.get(
    "/",
    requireAuth,
    requireRole([
        ROLES.OWNER,
    ]),
    getDeliveriesValidator,
    deliveryController.list
);

// Get delivery staff dropdown
router.get(
    "/staff",
    requireAuth,
    requireRole([
        ROLES.OWNER,
    ]),
    deliveryController.getDeliveryStaff
);

router.get(
    "/my",
    requireAuth,
    requireRole([ROLES.DELIVERY_STAFF]),
    getDeliveriesValidator,
    deliveryController.getMyDeliveries
);

router.get(
    "/my/:id",
    requireAuth,
    requireRole([ROLES.DELIVERY_STAFF]),
    getDeliveryByIdValidator,
    deliveryController.getMyDeliveryById
);

router.get(
    "/:id",
    requireAuth,
    requireRole([
        ROLES.OWNER,
    ]),
    getDeliveryByIdValidator,
    deliveryController.getById
);

router.patch(
    "/:id/assign",
    requireAuth,
    requireRole([
        ROLES.OWNER,
    ]),
    assignDeliveryValidator,
    deliveryController.assign
);

router.patch(
    "/:id/status",
    requireAuth,
    requireRole([ROLES.DELIVERY_STAFF]),
    updateDeliveryStatusValidator,
    deliveryController.updateStatus
);

export default router;