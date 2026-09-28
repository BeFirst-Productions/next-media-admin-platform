/**
 * Types shared between apps/api and apps/web.
 * Keep this the single source of truth for enums/DTO shapes that
 * cross the API boundary, so frontend and backend never drift.
 */

// ─── Roles ───────────────────────────────────────────────────────────────────

export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES_STAFF",
  "MARKETING_TEAM",
] as const;
export type Role = (typeof ROLES)[number];

// ─── User Status ─────────────────────────────────────────────────────────────

export const USER_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED", "INVITED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

// ─── CRM Modules & Actions ───────────────────────────────────────────────────

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
  "departments",
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
  "manage_authority",
] as const;
export type CrmAction = (typeof CRM_ACTIONS)[number];

export type PermissionString = `${CrmModule}:${CrmAction}`;

// ─── Proposal Statuses ───────────────────────────────────────────────────────

export const PROPOSAL_STATUSES = [
  "DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "SENT_TO_CLIENT",
  "CLIENT_ACCEPTED", "CONTRACT_CREATED", "REJECTED", "CANCELLED", "EXPIRED",
] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

// ─── Department DTO ──────────────────────────────────────────────────────────

export interface DepartmentDto {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  /** Number of users in this department (included when using count expand) */
  _count?: { users: number };
}

// ─── User DTOs ────────────────────────────────────────────────────────────────

export interface UserDto {
  id: string;
  /** Display ID shown in UI, e.g. "USR-1001" */
  employeeId: string;
  name: string;
  email: string;
  role: Role;
  status?: UserStatus;
  phone?: string | null;
  avatarUrl?: string | null;
  /** Resolved department object (name + id) */
  department?: { id: string; name: string } | null;
  departmentId?: string | null;
  joiningDate?: string | null;
  /** Sales target in AED (base currency) */
  salesTarget?: string | number | null;
  /** Commission percentage e.g. 10 = 10% */
  commissionPercentage?: string | number | null;
  permissions?: string[];
  settings?: Record<string, unknown>;
  /** Whether this user has been granted temporary Users-module authority */
  canManageUsers?: boolean;
  manageUsersExpiresAt?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  permissions?: string[];
  settings?: Record<string, unknown>;
  phone?: string;
  departmentId?: string;
  /** ISO-8601 date string */
  joiningDate?: string;
  salesTarget?: number;
  commissionPercentage?: number;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  status?: UserStatus;
  permissions?: string[];
  settings?: Record<string, unknown>;
  phone?: string;
  departmentId?: string | null;
  joiningDate?: string;
  salesTarget?: number | null;
  commissionPercentage?: number | null;
}

export interface UpdatePermissionsPayload {
  permissions: string[];
}

export interface GrantAuthorityPayload {
  /** ISO-8601 datetime; omit for indefinite grant */
  expiresAt?: string;
}

// ─── User Stats DTO ──────────────────────────────────────────────────────────

export interface UserStatsDto {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  departmentCount: number;
  roleCount: number;
}

// ─── Department Payloads ─────────────────────────────────────────────────────

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
}

export interface UpdateDepartmentPayload {
  name?: string;
  description?: string | null;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponseData {
  user: UserDto;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── API Envelope ─────────────────────────────────────────────────────────────

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

// ─── Lead & Client Enums & DTOs ─────────────────────────────────────────────

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "APPROVED",
  "CONTRACT_SIGNED",
  "CLIENT",
  "ACTIVE_PROJECT",
  "COMPLETED",
  "LOST",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const CONVERSION_STATUSES = ["PENDING", "CONVERTED", "REJECTED", "ON_HOLD"] as const;
export type ConversionStatus = (typeof CONVERSION_STATUSES)[number];

export const CONTACT_METHODS = ["CALL", "WHATSAPP", "EMAIL", "IN_PERSON_MEETING", "OTHER"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const CLIENT_STATUSES = ["ACTIVE", "INACTIVE", "ONBOARDING", "SUSPENDED"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export interface LeadDto {
  id: string;
  customLeadId?: string | null;
  date: string;
  companyName: string;
  contactPerson: string;
  designation?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  location?: string | null;
  googleMapsLink?: string | null;
  industry?: string | null;
  decisionMakerAvailable?: boolean;

  // Digital Audit
  hasWebsite?: boolean;
  websiteUrl?: string | null;
  websiteScore?: number | null;
  websiteIssues?: string | null;
  instagramUrl?: string | null;
  instagramFollowers?: number | null;
  instagramPosts?: number | null;
  instagramLastPostDate?: string | null;
  instagramScore?: number | null;
  facebookUrl?: string | null;
  linkedInUrl?: string | null;
  hasGoogleBusiness?: boolean;
  googleRating?: number | null;
  googleReviews?: number | null;
  socialMediaIssues?: string | null;

  // Sales
  servicesRequired?: string | null;
  recommendedPackageId?: string | null;
  recommendedPackage?: { id: string; name: string; price: number | string } | null;
  value?: number | string | null;
  status: LeadStatus;
  conversionStatus: ConversionStatus;
  firstContactDate?: string | null;
  contactMethod?: ContactMethod | null;
  response?: string | null;
  followUpDate?: string | null;
  meetingDate?: string | null;
  proposalSent?: boolean;
  proposalValue?: number | string | null;
  remarks?: string | null;
  additionalNotes?: string | null;

  sourceId?: string | null;
  source?: { id: string; name: string } | null;
  researchExecutiveId?: string | null;
  researchExecutive?: { id: string; name: string; email: string } | null;
  assignedStaffId?: string | null;
  assignedStaff?: { id: string; name: string; email?: string } | null;
  createdById: string;
  createdBy?: { id: string; name: string };

  convertedAt?: string | null;
  client?: ClientDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  customLeadId?: string;
  date?: string;
  companyName: string;
  contactPerson: string;
  designation?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  googleMapsLink?: string;
  industry?: string;
  decisionMakerAvailable?: boolean;

  hasWebsite?: boolean;
  websiteUrl?: string;
  websiteScore?: number;
  websiteIssues?: string;
  instagramUrl?: string;
  instagramFollowers?: number;
  instagramPosts?: number;
  instagramLastPostDate?: string;
  instagramScore?: number;
  facebookUrl?: string;
  linkedInUrl?: string;
  hasGoogleBusiness?: boolean;
  googleRating?: number;
  googleReviews?: number;
  socialMediaIssues?: string;

  servicesRequired?: string;
  recommendedPackageId?: string;
  value?: number;
  status?: LeadStatus;
  conversionStatus?: ConversionStatus;
  firstContactDate?: string;
  contactMethod?: ContactMethod;
  response?: string;
  followUpDate?: string;
  meetingDate?: string;
  proposalSent?: boolean;
  proposalValue?: number;
  remarks?: string;
  additionalNotes?: string;

  sourceId?: string;
  researchExecutiveId?: string;
  assignedStaffId?: string;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export interface ConvertLeadToClientPayload {
  billingAddress?: string;
  notes?: string;
  conversionValue?: number;
}

export interface ClientContactDto {
  id: string;
  clientId: string;
  name: string;
  designation?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface ClientDto {
  id: string;
  customClientId?: string | null;
  leadId?: string | null;
  companyName: string;
  industry?: string | null;
  location?: string | null;
  googleMapsLink?: string | null;
  contactPerson?: string | null;
  designation?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  billingAddress?: string | null;
  clientStatus: ClientStatus;
  conversionValue?: number | string | null;
  notes?: string | null;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;

  lead?: LeadDto | null;
  contacts?: ClientContactDto[];
}

// ─── Commission Slab & Monthly Progression DTOs ─────────────────────────────

export interface CommissionSlabDto {
  id: string;
  slabNumber: number;
  name: string;
  monthlySalesTarget: number | string;
  commissionRate: number | string;
  commissionAtTarget: number | string;
  achievementBonus: number | string;
  basicSalary: number | string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffMonthlyCommissionProgressDto {
  id: string;
  staffId: string;
  year: number;
  month: number;
  currentSlabId?: string | null;
  totalAchievedSales: number | string;
  slab1Achieved: boolean;
  slab1AchievedAt?: string | null;
  slab2Achieved: boolean;
  slab2AchievedAt?: string | null;
  slab3Achieved: boolean;
  slab3AchievedAt?: string | null;
  earnedCommission: number | string;
  earnedBonus: number | string;
  basicSalary: number | string;
  totalPayout: number | string;
  status: string;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
  currentSlab?: CommissionSlabDto | null;
  staff?: { id: string; name: string; email: string; employeeId?: string };
}


