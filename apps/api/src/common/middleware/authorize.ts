import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "@/common/errors/AppError";
import { hasPermission, RoleName } from "@/common/constants/roles";

/**
 * RBAC gate. Usage:
 *   router.get("/", authenticate, authorize(PERMISSIONS.LEADS_LIST), controller.list)
 *
 * Enforces modular action-level authorization:
 * - SUPER_ADMIN has full authority in every module and action (unconditional bypass).
 * - Other roles check individual user permissions or role defaults.
 */
export function authorize(...required: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const role = req.user.role as RoleName;

    // Super Admin has total authority everywhere
    if (role === "SUPER_ADMIN") {
      return next();
    }

    const userWithPerms = {
      role,
      permissions: (req.user as { permissions?: string[] }).permissions,
    };

    const allowed = required.every((permission) => hasPermission(userWithPerms, permission));

    if (!allowed) {
      throw new ForbiddenError("Insufficient permissions to perform this action");
    }

    return next();
  };
}

/** Role-only gate, with Super Admin automatic bypass. */
export function requireRole(...roles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const role = req.user.role as RoleName;

    if (role === "SUPER_ADMIN") {
      return next();
    }

    if (!roles.includes(role)) {
      throw new ForbiddenError("Access restricted to authorized roles");
    }

    return next();
  };
}
