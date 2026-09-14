import { Router } from "express";
import * as controller from "@/modules/notifications/notifications.controller";
import { authenticate } from "@/common/middleware/authenticate";

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.patch("/:id/read", controller.markRead);
router.patch("/read-all", controller.markAllRead);

export default router;
