import { Prisma, Role, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/common/errors/AppError";
import { buildPaginationMeta, toSkipTake } from "@/common/utils/pagination";
import { recordAuditLog } from "@/modules/audit/audit.service";
import { hashPassword } from "@/common/utils/password";
import { ROLE_DEFAULT_PERMISSIONS, RoleName } from "@/common/constants/roles";

// ─── Safe select (never expose passwordHash) ────────────────────────────────

const SAFE_SELECT = {
  id: true,
  employeeId: true,
  name: true,
  email: true,
  role: true,
  status: true,
  phone: true,
  avatarUrl: true,
  departmentId: true,
  department: { select: { id: true, name: true } },
  joiningDate: true,
  salesTarget: true,
  commissionPercentage: true,
  permissions: true,
  settings: true,
  canManageUsers: true,
  manageUsersExpiresAt: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

// ─── Generate a sequential USR-XXXX employee ID ──────────────────────────────

async function generateEmployeeId(): Promise<string> {
  // Count total users (including soft-deleted) for a monotonic counter
  const count = await prisma.user.count();
  const padded = String(count + 1).padStart(4, "0");
  return `USR-${padded}`;
}

// ─── List Users ───────────────────────────────────────────────────────────────

export async function listUsers(params: {
  page: number;
  limit: number;
  role?: Role;
  status?: UserStatus;
  departmentId?: string;
  search?: string;
}) {
  const { page, limit, role, status, departmentId, search } = params;

  const where: Prisma.UserWhereInput = {
    // Super Admin accounts are never exposed in list results
    role: role ? role : { not: "SUPER_ADMIN" },
    ...(status ? { status } : {}),
    ...(departmentId ? { departmentId } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { employeeId: { contains: search, mode: "insensitive" } },
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

// ─── Get User Stats (dashboard cards) ────────────────────────────────────────

export async function getUserStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, active, inactive, newThisMonth, departmentCount, roleCount] =
    await Promise.all([
      prisma.user.count({ where: { role: { not: "SUPER_ADMIN" } } }),
      prisma.user.count({ where: { status: "ACTIVE", role: { not: "SUPER_ADMIN" } } }),
      prisma.user.count({ where: { status: "INACTIVE", role: { not: "SUPER_ADMIN" } } }),
      prisma.user.count({
        where: {
          createdAt: { gte: startOfMonth },
          role: { not: "SUPER_ADMIN" },
        },
      }),
      prisma.department.count(),
      prisma.user.groupBy({ by: ["role"] }).then((r) => r.length),
    ]);

  return { total, active, inactive, newThisMonth, departmentCount, roleCount };
}

// ─── Get Single User ──────────────────────────────────────────────────────────

export async function getUserById(id: string, requestorRole?: RoleName) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: SAFE_SELECT,
  });

  if (!user) throw new NotFoundError("User");

  // Only Super Admin can view Super Admin accounts
  if (user.role === "SUPER_ADMIN" && requestorRole !== "SUPER_ADMIN") {
    throw new ForbiddenError("Access to Super Admin details is restricted");
  }

  return user;
}

// ─── Create User ──────────────────────────────────────────────────────────────

export async function createUser(
  data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    permissions?: string[];
    settings?: Record<string, unknown>;
    phone?: string;
    departmentId?: string;
    joiningDate?: string;
    salesTarget?: number;
    commissionPercentage?: number;
  },
  actorId: string,
) {
  // Duplicate email check
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ConflictError("A user with this email address already exists");
  }

  // Validate department exists if supplied
  if (data.departmentId) {
    const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!dept) throw new NotFoundError("Department");
  }

  const roleName = data.role as RoleName;
  const permissions =
    data.permissions && data.permissions.length > 0
      ? data.permissions
      : ROLE_DEFAULT_PERMISSIONS[roleName] ?? [];

  const [passwordHash, employeeId] = await Promise.all([
    hashPassword(data.password),
    generateEmployeeId(),
  ]);

  const created = await prisma.user.create({
    data: {
      employeeId,
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      permissions,
      settings: (data.settings ?? {}) as Prisma.InputJsonValue,
      phone: data.phone,
      departmentId: data.departmentId,
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : undefined,
      salesTarget: data.salesTarget,
      commissionPercentage: data.commissionPercentage,
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

// ─── Update User ──────────────────────────────────────────────────────────────

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
    status?: UserStatus;
    permissions?: string[];
    settings?: Record<string, unknown>;
    phone?: string;
    departmentId?: string;
    joiningDate?: string;
    salesTarget?: number;
    commissionPercentage?: number;
  },
  actorId: string,
) {
  const before = await prisma.user.findUnique({ where: { id }, select: SAFE_SELECT });
  if (!before) throw new NotFoundError("User");

  // Validate department exists if supplied
  if (data.departmentId) {
    const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!dept) throw new NotFoundError("Department");
  }

  const updateData: Prisma.UserUpdateInput = {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.email !== undefined && { email: data.email }),
    ...(data.role !== undefined && { role: data.role }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.permissions !== undefined && { permissions: data.permissions }),
    ...(data.settings !== undefined && { settings: data.settings as Prisma.InputJsonValue }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
    ...(data.joiningDate !== undefined && { joiningDate: new Date(data.joiningDate) }),
    ...(data.salesTarget !== undefined && { salesTarget: data.salesTarget }),
    ...(data.commissionPercentage !== undefined && { commissionPercentage: data.commissionPercentage }),
  };

  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: SAFE_SELECT,
  });

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

// ─── Delete User (hard delete — Super Admin only) ─────────────────────────────

export async function deleteUser(id: string, actorId: string) {
  const target = await prisma.user.findUnique({ where: { id }, select: SAFE_SELECT });
  if (!target) throw new NotFoundError("User");

  // Super Admin accounts can never be deleted
  if (target.role === "SUPER_ADMIN") {
    throw new ForbiddenError("Super Admin accounts cannot be deleted");
  }

  await prisma.user.delete({ where: { id } });

  await recordAuditLog({
    userId: actorId,
    action: "DELETE",
    module: "users",
    recordId: id,
    oldValues: target,
  });

  return { deleted: true };
}

// ─── Suspend User ─────────────────────────────────────────────────────────────

export async function suspendUser(id: string, actorId: string) {
  return updateUser(id, { status: "SUSPENDED" }, actorId);
}

// ─── Toggle Temporary User-Module Authority ───────────────────────────────────
// Super Admin (or a user who holds users:manage_authority) can grant another
// user temporary ability to manage the Users module.

export async function grantTemporaryAuthority(
  targetUserId: string,
  actorId: string,
  expiresAt?: string,
) {
  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, canManageUsers: true },
  });
  if (!target) throw new NotFoundError("User");
  if (target.role === "SUPER_ADMIN") {
    throw new ForbiddenError("Super Admin already has full authority");
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      canManageUsers: true,
      manageUsersExpiresAt: expiresAt ? new Date(expiresAt) : null,
    },
    select: SAFE_SELECT,
  });

  await recordAuditLog({
    userId: actorId,
    action: "GRANT_AUTHORITY",
    module: "users",
    recordId: targetUserId,
    newValues: { canManageUsers: true, manageUsersExpiresAt: expiresAt ?? null },
  });

  return updated;
}

export async function revokeTemporaryAuthority(targetUserId: string, actorId: string) {
  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true },
  });
  if (!target) throw new NotFoundError("User");

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { canManageUsers: false, manageUsersExpiresAt: null },
    select: SAFE_SELECT,
  });

  await recordAuditLog({
    userId: actorId,
    action: "REVOKE_AUTHORITY",
    module: "users",
    recordId: targetUserId,
    newValues: { canManageUsers: false },
  });

  return updated;
}

// ─── Update Permissions for a User ───────────────────────────────────────────

export async function updateUserPermissions(
  targetUserId: string,
  permissions: string[],
  actorId: string,
) {
  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, permissions: true },
  });
  if (!target) throw new NotFoundError("User");
  if (target.role === "SUPER_ADMIN") {
    throw new ForbiddenError("Super Admin permissions cannot be modified");
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { permissions },
    select: SAFE_SELECT,
  });

  await recordAuditLog({
    userId: actorId,
    action: "UPDATE_PERMISSIONS",
    module: "users",
    recordId: targetUserId,
    oldValues: { permissions: target.permissions },
    newValues: { permissions },
  });

  return updated;
}

// ─── Department CRUD ─────────────────────────────────────────────────────────

export async function listDepartments() {
  return prisma.department.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true } } },
  });
}

export async function createDepartment(data: { name: string; description?: string }, actorId: string) {
  const existing = await prisma.department.findUnique({ where: { name: data.name } });
  if (existing) throw new ConflictError("A department with this name already exists");

  const dept = await prisma.department.create({ data });

  await recordAuditLog({
    userId: actorId,
    action: "CREATE",
    module: "departments",
    recordId: dept.id,
    newValues: dept,
  });

  return dept;
}

export async function updateDepartment(
  id: string,
  data: { name?: string; description?: string },
  actorId: string,
) {
  const before = await prisma.department.findUnique({ where: { id } });
  if (!before) throw new NotFoundError("Department");

  const updated = await prisma.department.update({ where: { id }, data });

  await recordAuditLog({
    userId: actorId,
    action: "UPDATE",
    module: "departments",
    recordId: id,
    oldValues: before,
    newValues: updated,
  });

  return updated;
}

export async function deleteDepartment(id: string, actorId: string) {
  const dept = await prisma.department.findUnique({ where: { id } });
  if (!dept) throw new NotFoundError("Department");

  await prisma.department.delete({ where: { id } });

  await recordAuditLog({
    userId: actorId,
    action: "DELETE",
    module: "departments",
    recordId: id,
    oldValues: dept,
  });

  return { deleted: true };
}
