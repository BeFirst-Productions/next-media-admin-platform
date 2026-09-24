import { Request, Response } from "express";
import { Role } from "@prisma/client";
import { ApiResponse } from "@/common/utils/ApiResponse";
import * as service from "@/modules/users/users.service";

export async function list(req: Request, res: Response) {
  const { page, limit, role, status, search } = req.query as unknown as {
    page: number;
    limit: number;
    role?: Role;
    status?: "ACTIVE" | "SUSPENDED" | "INVITED";
    search?: string;
  };
  const { items, meta } = await service.listUsers({ page, limit, role, status, search });
  return ApiResponse.success(res, items, "Users fetched", 200, meta);
}

export async function getById(req: Request, res: Response) {
  const user = await service.getUserById(req.params.id);
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

export async function deactivate(req: Request, res: Response) {
  const user = await service.deactivateUser(req.params.id, req.user!.sub);
  return ApiResponse.success(res, user, "User deactivated");
}
