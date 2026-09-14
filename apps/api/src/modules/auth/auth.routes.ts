import { Router } from "express";
import * as controller from "@/modules/auth/auth.controller";
import { validate } from "@/common/middleware/validate";
import { authenticate } from "@/common/middleware/authenticate";
import { authRateLimiter } from "@/common/middleware/rateLimiter";
import { loginSchema, refreshSchema, registerSchema } from "@/modules/auth/auth.validation";

const router = Router();

// Only a Super Admin should normally create accounts in production;
// left open + rate-limited here for initial bootstrap / seeding convenience.
router.post("/register", authRateLimiter, validate(registerSchema), controller.register);
router.post("/login", authRateLimiter, validate(loginSchema), controller.login);
router.post("/refresh", authRateLimiter, validate(refreshSchema), controller.refresh);
router.post("/logout", controller.logout);
router.get("/me", authenticate, controller.me);

export default router;
