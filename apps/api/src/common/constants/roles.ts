export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SALES_STAFF: "SALES_STAFF",
  MARKETING_TEAM: "MARKETING_TEAM",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

/**
 * Modular action permissions formatted as <module>:<action>.
 * Super Admin has unrestricted authority across all of them.
 */
export const PERMISSIONS = {
  // Leads Module
  LEADS_LIST: "leads:list",
  LEADS_CREATE: "leads:create",
  LEADS_EDIT: "leads:edit",
  LEADS_DELETE: "leads:delete",
  LEADS_EXPORT: "leads:export",

  // Clients Module
  CLIENTS_LIST: "clients:list",
  CLIENTS_CREATE: "clients:create",
  CLIENTS_EDIT: "clients:edit",
  CLIENTS_DELETE: "clients:delete",
  CLIENTS_EXPORT: "clients:export",

  // Proposals Module
  PROPOSALS_LIST: "proposals:list",
  PROPOSALS_CREATE: "proposals:create",
  PROPOSALS_EDIT: "proposals:edit",
  PROPOSALS_DELETE: "proposals:delete",
  PROPOSALS_APPROVE: "proposals:approve",
  PROPOSALS_EXPORT: "proposals:export",

  // Contracts Module
  CONTRACTS_LIST: "contracts:list",
  CONTRACTS_CREATE: "contracts:create",
  CONTRACTS_EDIT: "contracts:edit",
  CONTRACTS_DELETE: "contracts:delete",
  CONTRACTS_EXPORT: "contracts:export",

  // Invoices & Billing
  INVOICES_LIST: "invoices:list",
  INVOICES_CREATE: "invoices:create",
  INVOICES_EDIT: "invoices:edit",
  INVOICES_DELETE: "invoices:delete",
  INVOICES_EXPORT: "invoices:export",

  // Payments
  PAYMENTS_LIST: "payments:list",
  PAYMENTS_CREATE: "payments:create",
  PAYMENTS_EDIT: "payments:edit",
  PAYMENTS_DELETE: "payments:delete",
  PAYMENTS_EXPORT: "payments:export",

  // Commissions
  COMMISSIONS_LIST: "commissions:list",
  COMMISSIONS_CREATE: "commissions:create",
  COMMISSIONS_EDIT: "commissions:edit",
  COMMISSIONS_DELETE: "commissions:delete",

  // Sales Targets
  TARGETS_LIST: "targets:list",
  TARGETS_CREATE: "targets:create",
  TARGETS_EDIT: "targets:edit",
  TARGETS_DELETE: "targets:delete",

  // Marketing Module
  MARKETING_LIST: "marketing:list",
  MARKETING_CREATE: "marketing:create",
  MARKETING_EDIT: "marketing:edit",
  MARKETING_DELETE: "marketing:delete",
  MARKETING_ANALYTICS: "marketing:analytics",

  // Service Catalog
  SERVICES_LIST: "services:list",
  SERVICES_CREATE: "services:create",
  SERVICES_EDIT: "services:edit",
  SERVICES_DELETE: "services:delete",

  // Reports & Analytics
  REPORTS_LIST: "reports:list",
  REPORTS_EXPORT: "reports:export",

  // User Management
  USERS_LIST: "users:list",
  USERS_CREATE: "users:create",
  USERS_EDIT: "users:edit",
  USERS_DELETE: "users:delete",

  // Compliance & Audit
  AUDIT_LIST: "audit:list",
  AUDIT_EXPORT: "audit:export",

  // Settings & Backups
  SETTINGS_LIST: "settings:list",
  SETTINGS_EDIT: "settings:edit",
  BACKUPS_MANAGE: "backups:manage",

  // Legacy mappings for backwards-compatible route references
  USERS_MANAGE: "users:list",
  LEADS_VIEW_ALL: "leads:list",
  LEADS_VIEW_OWN: "leads:list",
  LEADS_MANAGE: "leads:edit",
  CLIENTS_MANAGE: "clients:edit",
  PACKAGES_MANAGE: "services:edit",
  ADDONS_MANAGE: "services:edit",
  PROPOSALS_VIEW_ALL: "proposals:list",
  PROPOSALS_VIEW_OWN: "proposals:list",
  CONTRACTS_MANAGE: "contracts:edit",
  INVOICES_MANAGE: "invoices:edit",
  PAYMENTS_MANAGE: "payments:edit",
  COMMISSIONS_MANAGE: "commissions:edit",
  COMMISSIONS_VIEW_OWN: "commissions:list",
  TARGETS_MANAGE: "targets:edit",
  REPORTS_VIEW_ALL: "reports:list",
  REPORTS_VIEW_OWN: "reports:list",
  SETTINGS_MANAGE: "settings:edit",
  AUDIT_VIEW: "audit:list",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Array.from(
  new Set(
    Object.values(PERMISSIONS).filter((p) => p.includes(":")),
  ),
);

/** Default permission templates assigned upon creating users of that role */
export const ROLE_DEFAULT_PERMISSIONS: Record<RoleName, string[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS,

  ADMIN: [
    "leads:list", "leads:create", "leads:edit", "leads:delete", "leads:export",
    "clients:list", "clients:create", "clients:edit", "clients:delete", "clients:export",
    "proposals:list", "proposals:create", "proposals:edit", "proposals:approve", "proposals:export",
    "contracts:list", "contracts:create", "contracts:edit", "contracts:export",
    "invoices:list", "invoices:create", "invoices:edit", "invoices:export",
    "payments:list", "payments:create", "payments:edit", "payments:export",
    "commissions:list", "commissions:edit",
    "targets:list", "targets:edit",
    "services:list", "services:create", "services:edit",
    "reports:list", "reports:export",
    "marketing:list", "marketing:analytics",
  ],

  SALES_STAFF: [
    "leads:list", "leads:create", "leads:edit",
    "clients:list", "clients:create", "clients:edit",
    "proposals:list", "proposals:create", "proposals:edit",
    "invoices:list",
    "commissions:list",
    "targets:list",
    "services:list",
  ],

  MARKETING_TEAM: [
    "marketing:list", "marketing:create", "marketing:edit", "marketing:delete", "marketing:analytics",
    "leads:list", "leads:create",
    "services:list",
    "reports:list",
  ],
};

/**
 * Granular permission check:
 * 1. SUPER_ADMIN is total controller: always returns true!
 * 2. Checks individual custom permissions if assigned.
 * 3. Falls back to role default template.
 */
export function hasPermission(
  userOrRole: RoleName | { role: RoleName; permissions?: string[] },
  permission: string,
): boolean {
  const role: RoleName = typeof userOrRole === "string" ? userOrRole : userOrRole.role;

  // Universal override: Super Admin has full authority in every module and action
  if (role === "SUPER_ADMIN") {
    return true;
  }

  // If specific permissions are stored on the user object, check them directly
  if (typeof userOrRole === "object" && Array.isArray(userOrRole.permissions) && userOrRole.permissions.length > 0) {
    return userOrRole.permissions.includes(permission);
  }

  // Fallback to role default template
  return ROLE_DEFAULT_PERMISSIONS[role]?.includes(permission) ?? false;
}
