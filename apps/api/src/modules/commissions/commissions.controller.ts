import { Request, Response } from "express";
import { ApiResponse } from "@/common/utils/ApiResponse";
import * as service from "@/modules/commissions/commissions.service";

export async function getSlabs(_req: Request, res: Response) {
  const slabs = await service.getCommissionSlabs();
  return ApiResponse.success(res, slabs, "Commission slabs fetched successfully");
}

export async function getMyProgress(req: Request, res: Response) {
  const year = req.query.year ? parseInt(req.query.year as string) : undefined;
  const month = req.query.month ? parseInt(req.query.month as string) : undefined;
  
  const result = await service.getStaffMonthlyProgress(req.user!.sub, year, month);
  return ApiResponse.success(res, result, "My commission progress fetched successfully");
}

export async function getMonthlyOverview(req: Request, res: Response) {
  const year = req.query.year ? parseInt(req.query.year as string) : undefined;
  const month = req.query.month ? parseInt(req.query.month as string) : undefined;

  const result = await service.listMonthlyCommissionOverview(year, month);
  return ApiResponse.success(res, result, "Monthly commission overview fetched successfully");
}

export async function getMyDashboard(req: Request, res: Response) {
  const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string };
  const dashboard = await service.getStaffCommissionDashboard({
    staffId: req.user!.sub,
    dateFrom,
    dateTo,
  });
  return ApiResponse.success(res, dashboard, "Commission report dashboard fetched successfully");
}

export async function getMyReportList(req: Request, res: Response) {
  const { dateFrom, dateTo, categoryId, packageId, status, search, page, limit } = req.query as {
    dateFrom?: string;
    dateTo?: string;
    categoryId?: string;
    packageId?: string;
    status?: string;
    search?: string;
    page?: string;
    limit?: string;
  };

  const { items, meta } = await service.getStaffCommissionReportList({
    staffId: req.user!.sub,
    dateFrom,
    dateTo,
    categoryId,
    packageId,
    status,
    search,
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 10,
  });

  return ApiResponse.success(res, items, "Commission details table fetched successfully", 200, meta);
}

