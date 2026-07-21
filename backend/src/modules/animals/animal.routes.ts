import { Router } from "express";

import { animalController } from "./animal.controller.js";
import {
  createAnimalValidator,
  updateAnimalValidator,
  relocateAnimalValidator,
  deactivateAnimalValidator,
  getAnimalByIdValidator,
  getAnimalsValidator,
} from "./animal.validator.js";

import { requireAuth } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();


// Register animal
router.post(
  "/",
  requireAuth,
  requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
  createAnimalValidator,
  animalController.create
);


// Get paginated animals
router.get(
  "/",
  requireAuth,
  requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
  getAnimalsValidator,
  animalController.list
);
// get sheds for animal creation dropwdown

router.get("/sheds", requireAuth, requireRole([ROLES.OWNER, ROLES.FARM_WORKER]), animalController.getSheds)

router.get(
    "/parent",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
    animalController.getParents
);

// Get animal profile
router.get(
  "/:id",
  requireAuth,
  requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
  getAnimalByIdValidator,
  animalController.getById
);


// Update animal profile
router.put(
  "/:id",
  requireAuth,
  requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
  updateAnimalValidator,
  animalController.update
);


// Relocate animal
router.patch(
  "/:id/relocate",
  requireAuth,
  requireRole([ROLES.OWNER, ROLES.FARM_WORKER]),
  relocateAnimalValidator,
  animalController.relocate
);


// Mark animal as Sold/Deceased
router.patch(
  "/:id/deactivate",
  requireAuth,
  requireRole([ROLES.OWNER]),
  deactivateAnimalValidator,
  animalController.deactivate
);


export default router;