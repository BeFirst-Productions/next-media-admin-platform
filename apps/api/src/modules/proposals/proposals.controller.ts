import { Request, Response } from "express";
import { ApiResponse } from "@/common/utils/ApiResponse";
import * as service from "@/modules/proposals/proposals.service";

export async function list(req: Request, res: Response) {
  const q = req.query as unknown as { page: number; limit: number; status?: never };
  const { items, meta } = await service.listProposals({ ...q, actorId: req.user!.sub, actorRole: req.user!.role });
  return ApiResponse.success(res, items, "Proposals fetched", 200, meta);
}

export async function getById(req: Request, res: Response) {
  const proposal = await service.getProposalById(req.params.id, req.user!.sub, req.user!.role);
  return ApiResponse.success(res, proposal, "Proposal fetched");
}

export async function create(req: Request, res: Response) {
  const proposal = await service.createProposal(req.body, req.user!.sub);
  return ApiResponse.created(res, proposal, "Proposal created");
}

export async function updateItems(req: Request, res: Response) {
  const { items, discount, taxRatePercent } = req.body;
  const proposal = await service.recalculateProposalItems(req.params.id, items, discount, taxRatePercent, req.user!.sub);
  return ApiResponse.success(res, proposal, "Proposal items updated & recalculated");
}

export const submit = (req: Request, res: Response) => transition(req, res, "SUBMITTED");
export const review = (req: Request, res: Response) => transition(req, res, "UNDER_REVIEW");
export const approve = (req: Request, res: Response) => transition(req, res, "APPROVED");
export const reject = (req: Request, res: Response) => transition(req, res, "REJECTED");
export const sendToClient = (req: Request, res: Response) => transition(req, res, "SENT_TO_CLIENT");
export const clientAccept = (req: Request, res: Response) => transition(req, res, "CLIENT_ACCEPTED");
export const cancel = (req: Request, res: Response) => transition(req, res, "CANCELLED");

async function transition(req: Request, res: Response, toStatus: Parameters<typeof service.transitionProposal>[1]) {
  const proposal = await service.transitionProposal(req.params.id, toStatus, req.user!.sub, req.body?.note);
  return ApiResponse.success(res, proposal, `Proposal moved to ${toStatus}`);
}
