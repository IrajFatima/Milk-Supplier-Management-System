import { Router } from "express";

import { authController } from "./auth.controller.js";
import { validateLogin,validateChangePassword } from "./auth.validator.js";
import { requireAuth } from "../../middleware/authenticate.js";

const router = Router();

router.post("/login", validateLogin, authController.login);

router.post("/logout", requireAuth, authController.logout);

router.get("/me", requireAuth, authController.getCurrentUser);

router.patch("/change-password",requireAuth,validateChangePassword,authController.changePassword);

export default router;