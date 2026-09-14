/**
 * Types shared between apps/api and apps/web (once scaffolded).
 * Keep this the single source of truth for enums/DTO shapes that
 * cross the API boundary, so frontend and backend never drift.
 */

export const ROLES = ["SUPER_ADMIN", "SALES_STAFF"] as const;
export type Role = (typeof ROLES)[number];

export const PROPOSAL_STATUSES = [
  "DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "SENT_TO_CLIENT",
  "CLIENT_ACCEPTED", "CONTRACT_CREATED", "REJECTED", "CANCELLED", "EXPIRED",
] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

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
