import { z } from "zod";
import { paginationSchema } from "@/common/utils/pagination";

// ─── Shared ───────────────────────────────────────────────────────────────────

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const ROLES = ["SUPER_ADMIN", "ADMIN", "SALES_STAFF", "MARKETING_TEAM"] as const;
const STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED", "INVITED"] as const;

// ─── List Users ───────────────────────────────────────────────────────────────

export const listUsersSchema = z.object({
  query: paginationSchema.extend({
    role: z.enum(ROLES).optional(),
    status: z.enum(STATUSES).optional(),
    departmentId: z.string().uuid().optional(),
    search: z.string().optional(),
  }),
});

// ─── Create User ──────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(ROLES),
    permissions: z.array(z.string()).optional(),
    settings: z.record(z.unknown()).optional(),
    phone: z.string().optional(),
    departmentId: z.string().uuid().optional(),
    joiningDate: z.string().datetime({ offset: true }).optional(),
    salesTarget: z.number().nonnegative().optional(),
    commissionPercentage: z.number().min(0).max(100).optional(),
  }),
});

// ─── Update User ──────────────────────────────────────────────────────────────

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(ROLES).optional(),
    status: z.enum(STATUSES).optional(),
    permissions: z.array(z.string()).optional(),
    settings: z.record(z.unknown()).optional(),
    phone: z.string().optional(),
    departmentId: z.string().uuid().optional().nullable(),
    joiningDate: z.string().datetime({ offset: true }).optional(),
    salesTarget: z.number().nonnegative().optional().nullable(),
    commissionPercentage: z.number().min(0).max(100).optional().nullable(),
  }),
});

// ─── Update Permissions ───────────────────────────────────────────────────────

export const updatePermissionsSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    permissions: z.array(z.string()),
  }),
});

// ─── Grant Temporary Authority ────────────────────────────────────────────────

export const grantAuthoritySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    /// ISO-8601 datetime; omit for indefinite grant
    expiresAt: z.string().datetime({ offset: true }).optional(),
  }),
});

// ─── Departments ──────────────────────────────────────────────────────────────

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    description: z.string().max(300).optional(),
  }),
});

export const updateDepartmentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    description: z.string().max(300).optional().nullable(),
  }),
});
