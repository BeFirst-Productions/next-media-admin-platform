import { Router } from "express";
import { categories, packages, addons } from "@/modules/services/services.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { validate } from "@/common/middleware/validate";
import { PERMISSIONS } from "@/common/constants/roles";
import {
  createAddonSchema, createCategorySchema, createPackageSchema, idParamSchema,
  updateAddonSchema, updateCategorySchema, updatePackageSchema,
} from "@/modules/services/services.validation";

// Mounted three times at /service-categories, /packages, /addons (see routes/index.ts)

export const categoryRouter = Router();
categoryRouter.get("/", authenticate, categories.list);
categoryRouter.post("/", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(createCategorySchema), categories.create);
categoryRouter.patch("/:id", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(updateCategorySchema), categories.update);

export const packageRouter = Router();
packageRouter.get("/", authenticate, packages.list);
packageRouter.get("/:id", authenticate, validate(idParamSchema), packages.getById);
packageRouter.post("/", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(createPackageSchema), packages.create);
packageRouter.patch("/:id", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(updatePackageSchema), packages.update);

export const addonRouter = Router();
addonRouter.get("/", authenticate, addons.list);
addonRouter.post("/", authenticate, authorize(PERMISSIONS.ADDONS_MANAGE), validate(createAddonSchema), addons.create);
addonRouter.patch("/:id", authenticate, authorize(PERMISSIONS.ADDONS_MANAGE), validate(updateAddonSchema), addons.update);
