import { Request, Response } from "express";
import { ApiResponse } from "@/common/utils/ApiResponse";
import * as service from "@/modules/clients/clients.service";

export async function list(req: Request, res: Response) {
  const { page, limit, search } = req.query as unknown as { page: number; limit: number; search?: string };
  const { items, meta } = await service.listClients({ page, limit, search });
  return ApiResponse.success(res, items, "Clients fetched", 200, meta);
}

export async function getById(req: Request, res: Response) {
  const client = await service.getClientById(req.params.id);
  return ApiResponse.success(res, client, "Client fetched");
}

export async function create(req: Request, res: Response) {
  const client = await service.createClient(req.body, req.user!.sub);
  return ApiResponse.created(res, client, "Client created");
}

export async function update(req: Request, res: Response) {
  const client = await service.updateClient(req.params.id, req.body, req.user!.sub);
  return ApiResponse.success(res, client, "Client updated");
}
