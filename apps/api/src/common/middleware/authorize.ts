import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "@/common/errors/AppError";
import { hasPermission, Permission, RoleName } from "@/common/constants/roles";

/**
 * RBAC gate. Usage:
 *   router.get("/", authenticate, authorize(PERMISSIONS.LEADS_VIEW_ALL), controller.list)
 *
 * This enforces authorization at the API layer (never trust the frontend
 * to hide a menu item) — every protected route re-checks the role/permission
 * server-side regardless of what the client sends or shows.
 */
export function authorize(...required: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const role = req.user.role as RoleName;
    const allowed = required.every((permission) => hasPermission(role, permission));

    if (!allowed) {
      throw new ForbiddenError();
    }

    return next();
  };
}

/** Simpler role-only gate, for cases where a whole module is admin-only. */
export function requireRole(...roles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    if (!roles.includes(req.user.role as RoleName)) {
      throw new ForbiddenError();
    }
    return next();
  };
}
