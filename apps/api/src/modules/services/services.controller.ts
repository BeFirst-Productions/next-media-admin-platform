import { Request, Response } from "express";
import { ApiResponse } from "@/common/utils/ApiResponse";
import * as service from "@/modules/services/services.service";

export const categories = {
  list: async (_req: Request, res: Response) => ApiResponse.success(res, await service.listCategories(), "Categories fetched"),
  create: async (req: Request, res: Response) => ApiResponse.created(res, await service.createCategory(req.body, req.user!.sub), "Category created"),
  update: async (req: Request, res: Response) => ApiResponse.success(res, await service.updateCategory(req.params.id, req.body, req.user!.sub), "Category updated"),
};

export const packages = {
  list: async (req: Request, res: Response) => ApiResponse.success(res, await service.listPackages(req.query.categoryId as string | undefined), "Packages fetched"),
  getById: async (req: Request, res: Response) => ApiResponse.success(res, await service.getPackageById(req.params.id), "Package fetched"),
  create: async (req: Request, res: Response) => ApiResponse.created(res, await service.createPackage(req.body, req.user!.sub), "Package created"),
  update: async (req: Request, res: Response) => ApiResponse.success(res, await service.updatePackage(req.params.id, req.body, req.user!.sub), "Package updated"),
};

export const addons = {
  list: async (_req: Request, res: Response) => ApiResponse.success(res, await service.listAddons(), "Add-ons fetched"),
  create: async (req: Request, res: Response) => ApiResponse.created(res, await service.createAddon(req.body, req.user!.sub), "Add-on created"),
  update: async (req: Request, res: Response) => ApiResponse.success(res, await service.updateAddon(req.params.id, req.body, req.user!.sub), "Add-on updated"),
};
