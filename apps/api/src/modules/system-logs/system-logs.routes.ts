import { Router } from "express";
import { authenticate } from "@/common/middleware/authenticate";
import { requireRole } from "@/common/middleware/authorize";
import { ApiResponse } from "@/common/utils/ApiResponse";
import { prisma } from "@/lib/prisma";

const router = Router();
router.use(authenticate, requireRole("SUPER_ADMIN"));

router.get("/", async (_req, res) => {
  const logs = await prisma.systemLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return ApiResponse.success(res, logs, "System logs fetched");
});

export default router;
