import { z } from "zod";
import { paginationSchema } from "@/common/utils/pagination";

export const listUsersSchema = z.object({
  query: paginationSchema.extend({
    role: z.enum(["SUPER_ADMIN", "SALES_STAFF"]).optional(),
    status: z.enum(["ACTIVE", "SUSPENDED", "INVITED"]).optional(),
    search: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    phone: z.string().optional(),
    status: z.enum(["ACTIVE", "SUSPENDED", "INVITED"]).optional(),
    role: z.enum(["SUPER_ADMIN", "SALES_STAFF"]).optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
