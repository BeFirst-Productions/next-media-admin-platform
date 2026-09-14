import { Router } from "express";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { PERMISSIONS } from "@/common/constants/roles";
import { ApiResponse } from "@/common/utils/ApiResponse";

/**
 * Phase 5+ module (see project roadmap / README "Development Order").
 * Route shape and RBAC gate are wired up now so the frontend and other
 * modules (e.g. proposals -> contracts) can be built against a stable
 * contract, even before the full service/controller layer lands.
 */
const router = Router();
router.use(authenticate, authorize(PERMISSIONS.SETTINGS_MANAGE));

router.get("/", (_req, res) => ApiResponse.success(res, [], "settings module scaffolded — list endpoint pending implementation"));

export default router;
