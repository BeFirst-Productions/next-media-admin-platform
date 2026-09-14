import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/common/errors/AppError";
import { buildPaginationMeta, toSkipTake } from "@/common/utils/pagination";
import { recordAuditLog } from "@/modules/audit/audit.service";

const SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  phone: true,
  avatarUrl: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export async function listUsers(params: {
  page: number;
  limit: number;
  role?: "SUPER_ADMIN" | "SALES_STAFF";
  status?: "ACTIVE" | "SUSPENDED" | "INVITED";
  search?: string;
}) {
  const { page, limit, role, status, search } = params;
  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, select: SAFE_SELECT, orderBy: { createdAt: "desc" }, ...toSkipTake(page, limit) }),
    prisma.user.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(total, page, limit) };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, select: SAFE_SELECT });
  if (!user) throw new NotFoundError("User");
  return user;
}

export async function updateUser(id: string, data: Prisma.UserUpdateInput, actorId: string) {
  const before = await getUserById(id);
  const updated = await prisma.user.update({ where: { id }, data, select: SAFE_SELECT });

  await recordAuditLog({
    userId: actorId,
    action: "UPDATE",
    module: "users",
    recordId: id,
    oldValues: before,
    newValues: updated,
  });

  return updated;
}

export async function deactivateUser(id: string, actorId: string) {
  return updateUser(id, { status: "SUSPENDED" }, actorId);
}
