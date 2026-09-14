import { Router } from "express";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { validate } from "@/common/middleware/validate";
import { PERMISSIONS } from "@/common/constants/roles";
import { ApiResponse } from "@/common/utils/ApiResponse";
import { prisma } from "@/lib/prisma";
import { buildPaginationMeta, paginationSchema, toSkipTake } from "@/common/utils/pagination";
import { z } from "zod";

const router = Router();
router.use(authenticate, authorize(PERMISSIONS.AUDIT_VIEW));

const listSchema = z.object({ query: paginationSchema.extend({ module: z.string().optional() }) });

router.get("/", validate(listSchema), async (req, res) => {
  const { page, limit, module } = req.query as unknown as { page: number; limit: number; module?: string };
  const where = module ? { module } : {};
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } } }, ...toSkipTake(page, limit) }),
    prisma.auditLog.count({ where }),
  ]);
  return ApiResponse.success(res, items, "Audit logs fetched", 200, buildPaginationMeta(total, page, limit));
});

export default router;
