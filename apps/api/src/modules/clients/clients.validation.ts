import { z } from "zod";
import { paginationSchema } from "@/common/utils/pagination";

export const createClientSchema = z.object({
  body: z.object({
    leadId: z.string().uuid().optional(),
    companyName: z.string().min(2),
    industry: z.string().optional(),
    location: z.string().optional(),
    billingAddress: z.string().optional(),
    contacts: z
      .array(
        z.object({
          name: z.string().min(2),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          isPrimary: z.boolean().default(false),
        }),
      )
      .optional(),
  }),
});

export const updateClientSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createClientSchema.shape.body.partial(),
});

export const listClientsSchema = z.object({
  query: paginationSchema.extend({ search: z.string().optional() }),
});

export const idParamSchema = z.object({ params: z.object({ id: z.string().uuid() }) });
