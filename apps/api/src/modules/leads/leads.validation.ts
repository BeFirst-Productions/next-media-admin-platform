import { z } from "zod";
import { paginationSchema } from "@/common/utils/pagination";

const LEAD_STATUSES = [
  "NEW","CONTACTED","QUALIFIED","PROPOSAL_SENT","NEGOTIATION",
  "APPROVED","CONTRACT_SIGNED","CLIENT","ACTIVE_PROJECT","COMPLETED","LOST",
] as const;

export const createLeadSchema = z.object({
  body: z.object({
    companyName: z.string().min(2),
    contactPerson: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    location: z.string().optional(),
    industry: z.string().optional(),
    requiredServices: z.string().optional(),
    expectedDeliveryDate: z.coerce.date().optional(),
    projectDescription: z.string().optional(),
    additionalNotes: z.string().optional(),
    value: z.coerce.number().nonnegative().optional(),
    sourceId: z.string().uuid().optional(),
    assignedStaffId: z.string().uuid().optional(),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createLeadSchema.shape.body.partial().extend({
    status: z.enum(LEAD_STATUSES).optional(),
  }),
});

export const listLeadsSchema = z.object({
  query: paginationSchema.extend({
    status: z.enum(LEAD_STATUSES).optional(),
    assignedStaffId: z.string().uuid().optional(),
    industry: z.string().optional(),
    search: z.string().optional(),
  }),
});

export const idParamSchema = z.object({ params: z.object({ id: z.string().uuid() }) });

export const assignLeadSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ staffId: z.string().uuid() }),
});

export const addLeadNoteSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ note: z.string().min(1) }),
});
