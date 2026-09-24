import { z } from "zod";
import { paginationSchema } from "@/common/utils/pagination";

export const listUsersSchema = z.object({
  query: paginationSchema.extend({
    role: z.enum(["SUPER_ADMIN", "ADMIN", "SALES_STAFF", "MARKETING_TEAM"]).optional(),
    status: z.enum(["ACTIVE", "SUSPENDED", "INVITED"]).optional(),
    search: z.string().optional(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "SALES_STAFF", "MARKETING_TEAM"]),
    permissions: z.array(z.string()).optional(),
    settings: z.record(z.unknown()).optional(),
    phone: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    phone: z.string().optional(),
    status: z.enum(["ACTIVE", "SUSPENDED", "INVITED"]).optional(),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "SALES_STAFF", "MARKETING_TEAM"]).optional(),
    permissions: z.array(z.string()).optional(),
    settings: z.record(z.unknown()).optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
