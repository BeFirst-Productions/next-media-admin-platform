import { z } from "zod";
import { paginationSchema } from "@/common/utils/pagination";

const CLIENT_STATUSES = ["ACTIVE", "INACTIVE", "ONBOARDING", "SUSPENDED"] as const;

export const createClientSchema = z.object({
  body: z.object({
    customClientId: z.string().optional(),
    leadId: z.string().uuid().optional().or(z.literal("")),
    companyName: z.string().min(1, "Company name is required"),
    industry: z.string().optional(),
    location: z.string().optional(),
    googleMapsLink: z.string().optional(),
    contactPerson: z.string().optional(),
    designation: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    billingAddress: z.string().optional(),
    clientStatus: z.enum(CLIENT_STATUSES).optional(),
    conversionValue: z.coerce.number().nonnegative().optional(),
    notes: z.string().optional(),
    contacts: z
      .array(
        z.object({
          name: z.string().min(1),
          designation: z.string().optional(),
          email: z.string().email().optional().or(z.literal("")),
          phone: z.string().optional(),
          whatsapp: z.string().optional(),
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
  query: paginationSchema.extend({
    search: z.string().optional(),
    status: z.enum(CLIENT_STATUSES).optional(),
  }),
});

export const idParamSchema = z.object({ params: z.object({ id: z.string().uuid() }) });

