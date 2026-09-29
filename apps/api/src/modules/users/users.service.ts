import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ConflictError, NotFoundError } from "@/common/errors/AppError";
import { buildPaginationMeta, toSkipTake } from "@/common/utils/pagination";
import { recordAuditLog } from "@/modules/audit/audit.service";
import { hashPassword } from "@/common/utils/password";
import { ROLE_DEFAULT_PERMISSIONS, RoleName } from "@/common/constants/roles";

const SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  phone: true,
  avatarUrl: true,
  permissions: true,
  settings: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export async function listUsers(params: {
  page: number;
  limit: number;
  role?: Role;
  status?: "ACTIVE" | "SUSPENDED" | "INVITED";
  search?: string;
}) {
  const { page, limit, role, status, search } = params;
  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: SAFE_SELECT,
      orderBy: { createdAt: "desc" },
      ...toSkipTake(page, limit),
    }),
    prisma.user.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(total, page, limit) };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, select: SAFE_SELECT });
  if (!user) throw new NotFoundError("User");
  return user;
}

export async function createUser(
  data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    permissions?: string[];
    settings?: Record<string, unknown>;
    phone?: string;
  },
  actorId: string,
) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ConflictError("A user with this email address already exists");
  }

  const roleName = data.role as RoleName;
  const permissions =
    data.permissions && data.permissions.length > 0
      ? data.permissions
      : ROLE_DEFAULT_PERMISSIONS[roleName] ?? [];

  const passwordHash = await hashPassword(data.password);
  const created = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      permissions,
      settings: (data.settings ?? {}) as Prisma.InputJsonValue,
      phone: data.phone,
    },
    select: SAFE_SELECT,
  });

  await recordAuditLog({
    userId: actorId,
    action: "CREATE",
    module: "users",
    recordId: created.id,
    newValues: created,
  });

  return created;
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
