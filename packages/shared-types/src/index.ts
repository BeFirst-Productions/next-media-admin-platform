/**
 * Types shared between apps/api and apps/web (once scaffolded).
 * Keep this the single source of truth for enums/DTO shapes that
 * cross the API boundary, so frontend and backend never drift.
 */

export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES_STAFF",
  "MARKETING_TEAM",
] as const;
export type Role = (typeof ROLES)[number];

export const CRM_MODULES = [
  "leads",
  "clients",
  "proposals",
  "contracts",
  "invoices",
  "payments",
  "commissions",
  "targets",
  "marketing",
  "services",
  "reports",
  "users",
  "audit",
  "settings",
] as const;
export type CrmModule = (typeof CRM_MODULES)[number];

export const CRM_ACTIONS = [
  "list",
  "create",
  "edit",
  "delete",
  "export",
  "approve",
  "analytics",
] as const;
export type CrmAction = (typeof CRM_ACTIONS)[number];

export type PermissionString = `${CrmModule}:${CrmAction}`;

export const PROPOSAL_STATUSES = [
  "DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "SENT_TO_CLIENT",
  "CLIENT_ACCEPTED", "CONTRACT_CREATED", "REJECTED", "CANCELLED", "EXPIRED",
] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: string;
  permissions?: string[];
  settings?: Record<string, unknown>;
  createdAt?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  permissions: string[];
  settings?: Record<string, unknown>;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  status?: "ACTIVE" | "SUSPENDED" | "INVITED";
  permissions?: string[];
  settings?: Record<string, unknown>;
}

export interface AuthResponseData {
  user: UserDto;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  details?: unknown;
  requestId?: string;
  timestamp: string;
}

