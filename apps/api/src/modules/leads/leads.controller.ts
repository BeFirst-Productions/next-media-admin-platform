import { Request, Response } from "express";
import { ApiResponse } from "@/common/utils/ApiResponse";
import * as service from "@/modules/leads/leads.service";

export async function list(req: Request, res: Response) {
  const q = req.query as unknown as {
    page: number;
    limit: number;
    status?: string;
    conversionStatus?: string;
    assignedStaffId?: string;
    researchExecutiveId?: string;
    industry?: string;
    search?: string;
  };
  const { items, meta } = await service.listLeads({
    ...q,
    actorId: req.user!.sub,
    actorRole: req.user!.role,
  });
  return ApiResponse.success(res, items, "Leads fetched", 200, meta);
}

export async function getById(req: Request, res: Response) {
  const lead = await service.getLeadById(req.params.id);
  return ApiResponse.success(res, lead, "Lead fetched");
}

export async function create(req: Request, res: Response) {
  const lead = await service.createLead(req.body, req.user!.sub);
  return ApiResponse.created(res, lead, "Lead created");
}

export async function update(req: Request, res: Response) {
  const lead = await service.updateLead(req.params.id, req.body, req.user!.sub);
  return ApiResponse.success(res, lead, "Lead updated");
}

export async function convert(req: Request, res: Response) {
  const client = await service.convertLeadToClient(req.params.id, req.body, req.user!.sub);
  return ApiResponse.created(res, client, "Lead successfully converted to Client");
}

export async function assign(req: Request, res: Response) {
  const lead = await service.assignLead(req.params.id, req.body.staffId, req.user!.sub);
  return ApiResponse.success(res, lead, "Lead assigned");
}

export async function addNote(req: Request, res: Response) {
  const note = await service.addLeadNote(req.params.id, req.body.note, req.user!.sub);
  return ApiResponse.created(res, note, "Note added");
}

export async function remove(req: Request, res: Response) {
  await service.deleteLead(req.params.id, req.user!.sub);
  return ApiResponse.noContent(res);
}
