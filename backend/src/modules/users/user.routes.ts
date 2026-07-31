import { Router } from "express";

import { userController } from "./user.controller.js";
import {
    createUserValidator,
    updateUserValidator,
    getUserByIdValidator,
    getUsersValidator,
    activateUserValidator,
    deactivateUserValidator,
} from "./user.validator.js";

import { requireAuth } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();

router.post(
    "/",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    createUserValidator,
    userController.create
);

router.get(
    "/",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    getUsersValidator,
    userController.list
);
router.get(
    "/roles",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    userController.getRoles
);

router.get(
    "/:id",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    getUserByIdValidator,
    userController.getById
);

router.put(
    "/:id",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    updateUserValidator,
    userController.update
);

router.patch(
    "/:id/activate",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    activateUserValidator,
    userController.activate
);

router.patch(
    "/:id/deactivate",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.SYSTEM_ADMINISTRATOR]),
    deactivateUserValidator,
    userController.deactivate
);

export default router;