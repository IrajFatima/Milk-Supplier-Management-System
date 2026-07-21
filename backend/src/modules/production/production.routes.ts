import { Router } from "express";

import { productionController } from "./production.controller.js";
import {
    createProductionValidator,
    updateProductionValidator,
    voidProductionValidator,
    getProductionByIdValidator,
    getProductionValidator,
} from "./production.validator.js";

import { requireAuth } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();

// Record milk production
router.post(
    "/",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
    createProductionValidator,
    productionController.create
);

// Get paginated production records
router.get(
    "/",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER, ROLES.ACCOUNTANT]),
    getProductionValidator,
    productionController.list
);

// Get animals for dropdown
router.get(
    "/animals",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
    productionController.getAnimals
);

// Get storage facilities for dropdown
router.get(
    "/storage-facilities",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
    productionController.getStorageFacilities
);

// Get production record
router.get(
    "/:id",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER, ROLES.ACCOUNTANT]),
    getProductionByIdValidator,
    productionController.getById
);

// Update production record
router.put(
    "/:id",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
    updateProductionValidator,
    productionController.update
);

// Void production record
router.patch(
    "/:id/void",
    requireAuth,
    requireRole([ROLES.OWNER]),
    voidProductionValidator,
    productionController.void
);

export default router;