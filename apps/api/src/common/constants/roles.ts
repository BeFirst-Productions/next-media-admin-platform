export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  SALES_STAFF: "SALES_STAFF",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

/**
 * Fine-grained permission strings, grouped by module.
 * RBAC in this system works in two layers:
 *   1. Role  -> coarse gate (SUPER_ADMIN vs SALES_STAFF)
 *   2. Permission -> fine-grained gate per route, so a future
 *      "Manager" or "Finance" role can be added without rewriting routes.
 */
export const PERMISSIONS = {
  USERS_MANAGE: "users:manage",
  LEADS_VIEW_ALL: "leads:view_all",
  LEADS_VIEW_OWN: "leads:view_own",
  LEADS_MANAGE: "leads:manage",
  CLIENTS_MANAGE: "clients:manage",
  PACKAGES_MANAGE: "packages:manage",
  ADDONS_MANAGE: "addons:manage",
  PROPOSALS_CREATE: "proposals:create",
  PROPOSALS_VIEW_ALL: "proposals:view_all",
  PROPOSALS_VIEW_OWN: "proposals:view_own",
  PROPOSALS_APPROVE: "proposals:approve",
  CONTRACTS_MANAGE: "contracts:manage",
  INVOICES_MANAGE: "invoices:manage",
  PAYMENTS_MANAGE: "payments:manage",
  COMMISSIONS_MANAGE: "commissions:manage",
  COMMISSIONS_VIEW_OWN: "commissions:view_own",
  TARGETS_MANAGE: "targets:manage",
  REPORTS_VIEW_ALL: "reports:view_all",
  REPORTS_VIEW_OWN: "reports:view_own",
  SETTINGS_MANAGE: "settings:manage",
  AUDIT_VIEW: "audit:view",
  BACKUPS_MANAGE: "backups:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Static role -> permissions map. Kept in code (not DB) for v1 simplicity;
 *  the `role_permissions` table can replace this later without touching callers,
 *  since everything goes through `hasPermission()`. */
export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  SALES_STAFF: [
    PERMISSIONS.LEADS_VIEW_OWN,
    PERMISSIONS.LEADS_MANAGE,
    PERMISSIONS.CLIENTS_MANAGE,
    PERMISSIONS.PROPOSALS_CREATE,
    PERMISSIONS.PROPOSALS_VIEW_OWN,
    PERMISSIONS.INVOICES_MANAGE,
    PERMISSIONS.REPORTS_VIEW_OWN,
    PERMISSIONS.COMMISSIONS_VIEW_OWN,
  ],
};

export function hasPermission(role: RoleName, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
