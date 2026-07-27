import { Router } from "express";

import { customerController } from "./customer.controller.js";
import {
  createCustomerValidator,
  changeCustomerStatusValidator,
  getCustomerByIdValidator,
  getCustomersValidator,
  updateCustomerValidator,
} from "./customer.validator.js";

import { requireAuth } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
  createCustomerValidator,
  customerController.create
);

router.get(
  "/",
  requireAuth,
  requireRole([
    ROLES.OWNER,
    ROLES.ACCOUNTANT,
    ROLES.DELIVERY_STAFF,
  ]),
  getCustomersValidator,
  customerController.list
);

router.put(
  "/:id",
  requireAuth,
  requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
  updateCustomerValidator,
  customerController.update
);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole([ROLES.OWNER]),
  changeCustomerStatusValidator,
  customerController.changeStatus
);

router.get(
  "/:id",
  requireAuth,
  requireRole([
    ROLES.OWNER,
    ROLES.ACCOUNTANT,
    ROLES.DELIVERY_STAFF,
  ]),
  getCustomerByIdValidator,
  customerController.getById
);

export default router;
