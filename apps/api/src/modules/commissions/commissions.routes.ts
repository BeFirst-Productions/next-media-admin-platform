import { Router } from "express";
import * as controller from "@/modules/commissions/commissions.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { PERMISSIONS } from "@/common/constants/roles";

const router = Router();
router.use(authenticate);

router.get("/slabs", controller.getSlabs);
router.get("/my-progress", controller.getMyProgress);
router.get("/my-dashboard", controller.getMyDashboard);
router.get("/my-report-list", controller.getMyReportList);
router.get("/monthly-overview", authorize(PERMISSIONS.COMMISSIONS_MANAGE), controller.getMonthlyOverview);

export default router;
