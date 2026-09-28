import { Request, Response } from "express";
import { Role, UserStatus } from "@prisma/client";
import { ApiResponse } from "@/common/utils/ApiResponse";
import * as service from "@/modules/users/users.service";
import { RoleName } from "@/common/constants/roles";

// ─── Users ───────────────────────────────────────────────────────────────────

export async function stats(_req: Request, res: Response) {
  const data = await service.getUserStats();
  return ApiResponse.success(res, data, "User stats fetched");
}

export async function list(req: Request, res: Response) {
  const { page, limit, role, status, departmentId, search } = req.query as unknown as {
    page: number;
    limit: number;
    role?: Role;
    status?: UserStatus;
    departmentId?: string;
    search?: string;
  };
  const { items, meta } = await service.listUsers({
    page,
    limit,
    role,
    status,
    departmentId,
    search,
  });
  return ApiResponse.success(res, items, "Users fetched", 200, meta);
}

export async function getById(req: Request, res: Response) {
  const requestorRole = req.user!.role as RoleName;
  const user = await service.getUserById(req.params.id, requestorRole);
  return ApiResponse.success(res, user, "User fetched");
}

export async function create(req: Request, res: Response) {
  const user = await service.createUser(req.body, req.user!.sub);
  return ApiResponse.created(res, user, "User created successfully");
}

export async function update(req: Request, res: Response) {
  const user = await service.updateUser(req.params.id, req.body, req.user!.sub);
  return ApiResponse.success(res, user, "User updated");
}

export async function remove(req: Request, res: Response) {
  const result = await service.deleteUser(req.params.id, req.user!.sub);
  return ApiResponse.success(res, result, "User deleted");
}

export async function suspend(req: Request, res: Response) {
  const user = await service.suspendUser(req.params.id, req.user!.sub);
  return ApiResponse.success(res, user, "User suspended");
}

// ─── Permissions ──────────────────────────────────────────────────────────────

export async function updatePermissions(req: Request, res: Response) {
  const { permissions } = req.body as { permissions: string[] };
  const user = await service.updateUserPermissions(req.params.id, permissions, req.user!.sub);
  return ApiResponse.success(res, user, "User permissions updated");
}

// ─── Temporary Authority ──────────────────────────────────────────────────────

export async function grantAuthority(req: Request, res: Response) {
  const { expiresAt } = req.body as { expiresAt?: string };
  const user = await service.grantTemporaryAuthority(req.params.id, req.user!.sub, expiresAt);
  return ApiResponse.success(res, user, "Temporary user-module authority granted");
}

export async function revokeAuthority(req: Request, res: Response) {
  const user = await service.revokeTemporaryAuthority(req.params.id, req.user!.sub);
  return ApiResponse.success(res, user, "Temporary user-module authority revoked");
}

// ─── Departments ──────────────────────────────────────────────────────────────

export async function listDepartments(_req: Request, res: Response) {
  const departments = await service.listDepartments();
  return ApiResponse.success(res, departments, "Departments fetched");
}

export async function createDepartment(req: Request, res: Response) {
  const dept = await service.createDepartment(req.body, req.user!.sub);
  return ApiResponse.created(res, dept, "Department created");
}

export async function updateDepartment(req: Request, res: Response) {
  const dept = await service.updateDepartment(req.params.id, req.body, req.user!.sub);
  return ApiResponse.success(res, dept, "Department updated");
}

export async function deleteDepartment(req: Request, res: Response) {
  const result = await service.deleteDepartment(req.params.id, req.user!.sub);
  return ApiResponse.success(res, result, "Department deleted");
}
