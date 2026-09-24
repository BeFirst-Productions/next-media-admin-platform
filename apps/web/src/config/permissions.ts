import type { Role, CrmModule, CrmAction } from "@next-digital-crm/shared-types";
import type { UserSession } from "@/types/auth.types";

export interface ActionDefinition {
  id: CrmAction;
  label: string;
  description: string;
}

export interface ModuleDefinition {
  id: CrmModule;
  label: string;
  description: string;
  actions: readonly CrmAction[];
}

export const MODULE_DEFINITIONS: readonly ModuleDefinition[] = [
  {
    id: "leads",
    label: "Leads & Prospects",
    description: "Inbound qualifications, lead assignments, contact records",
    actions: ["list", "create", "edit", "delete", "export"] as const,
  },
  {
    id: "clients",
    label: "Client Accounts",
    description: "Brand directory, contacts, service agreements, account status",
    actions: ["list", "create", "edit", "delete", "export"] as const,
  },
  {
    id: "proposals",
    label: "Proposals & Quotes",
    description: "Custom deal scopes, price quotes, package items, client sign-offs",
    actions: ["list", "create", "edit", "delete", "approve", "export"] as const,
  },
  {
    id: "contracts",
    label: "Master Contracts",
    description: "Executed service contracts and SLA terms",
    actions: ["list", "create", "edit", "delete", "export"] as const,
  },
  {
    id: "invoices",
    label: "Invoices & Billing",
    description: "Milestone invoices, tax rates, billing schedules, PDF receipts",
    actions: ["list", "create", "edit", "delete", "export"] as const,
  },
  {
    id: "payments",
    label: "Payment Transactions",
    description: "Bank transfers, card receipts, invoice reconciliation",
    actions: ["list", "create", "edit", "delete", "export"] as const,
  },
  {
    id: "commissions",
    label: "Staff Commissions",
    description: "Sales commissions, deal attribution, payout verification",
    actions: ["list", "create", "edit", "delete"] as const,
  },
  {
    id: "targets",
    label: "Sales Quotas & Targets",
    description: "Monthly revenue quotas and performance pacing",
    actions: ["list", "create", "edit", "delete"] as const,
  },
  {
    id: "marketing",
    label: "Marketing Campaigns",
    description: "Inbound channels, marketing campaigns, acquisition metrics",
    actions: ["list", "create", "edit", "delete", "analytics"] as const,
  },
  {
    id: "services",
    label: "Service Catalog",
    description: "Digital media retainers, package tiers, custom add-ons",
    actions: ["list", "create", "edit", "delete"] as const,
  },
  {
    id: "reports",
    label: "Financial Analytics",
    description: "Company P&L, pipeline velocity, revenue forecasting",
    actions: ["list", "export"] as const,
  },
  {
    id: "users",
    label: "User Governance",
    description: "Staff accounts, role assignments, action permissions",
    actions: ["list", "create", "edit", "delete"] as const,
  },
  {
    id: "audit",
    label: "Security Audit Logs",
    description: "Immutable compliance trails of every mutation and login",
    actions: ["list", "export"] as const,
  },
  {
    id: "settings",
    label: "Platform Settings",
    description: "Tax rates, payment gateways, company brand settings",
    actions: ["list", "edit"] as const,
  },
] as const;

export const ALL_ACTION_PERMISSIONS = MODULE_DEFINITIONS.flatMap((module) =>
  module.actions.map((action) => `${module.id}:${action}`),
);

/** Default permissions template assigned when selecting a role */
export const ROLE_DEFAULT_TEMPLATES: Record<Role, readonly string[]> = {
  SUPER_ADMIN: ALL_ACTION_PERMISSIONS,

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
 * Universal Permission Checker:
 * - Super Admin always returns true (total control, full authority in every module & action).
 * - For all other roles, checks the user's customized permissions or role default template.
 */
export function hasPermission(
  user: UserSession | null | undefined,
  requiredPermission: string,
): boolean {
  if (!user) return false;

  // Super Admin universal override
  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  // Check custom individual permissions
  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return user.permissions.includes(requiredPermission);
  }

  // Fallback to role defaults
  return ROLE_DEFAULT_TEMPLATES[user.role]?.includes(requiredPermission) ?? false;
}

export function isSuperAdmin(role: Role | undefined | null): boolean {
  return role === "SUPER_ADMIN";
}

export function isAdmin(role: Role | undefined | null): boolean {
  return role === "ADMIN";
}

export function isSalesStaff(role: Role | undefined | null): boolean {
  return role === "SALES_STAFF";
}

export function isMarketingTeam(role: Role | undefined | null): boolean {
  return role === "MARKETING_TEAM";
}
