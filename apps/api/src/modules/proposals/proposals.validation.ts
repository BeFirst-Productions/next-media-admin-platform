import { z } from "zod";
import { paginationSchema } from "@/common/utils/pagination";

const proposalItemInput = z.object({
  itemType: z.enum(["PACKAGE", "ADDON"]),
  packageId: z.string().uuid().optional(),
  addonId: z.string().uuid().optional(),
  quantity: z.number().int().positive().default(1),
}).refine((v) => (v.itemType === "PACKAGE" ? !!v.packageId : !!v.addonId), {
  message: "packageId is required for PACKAGE items, addonId is required for ADDON items",
});

export const createProposalSchema = z.object({
  body: z.object({
    leadId: z.string().uuid().optional(),
    clientId: z.string().uuid().optional(),
    expectedDeliveryDate: z.coerce.date().optional(),
    projectDescription: z.string().optional(),
    notes: z.string().optional(),
    discount: z.coerce.number().nonnegative().default(0),
    taxRatePercent: z.coerce.number().min(0).max(100).default(0),
    items: z.array(proposalItemInput).min(1, "At least one package or add-on is required"),
  }),
});

export const updateProposalItemsSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    items: z.array(proposalItemInput).min(1),
    discount: z.coerce.number().nonnegative().optional(),
    taxRatePercent: z.coerce.number().min(0).max(100).optional(),
  }),
});

export const listProposalsSchema = z.object({
  query: paginationSchema.extend({
    status: z
      .enum(["DRAFT","SUBMITTED","UNDER_REVIEW","APPROVED","SENT_TO_CLIENT","CLIENT_ACCEPTED","CONTRACT_CREATED","REJECTED","CANCELLED","EXPIRED"])
      .optional(),
  }),
});

export const idParamSchema = z.object({ params: z.object({ id: z.string().uuid() }) });

export const transitionSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ note: z.string().optional() }),
});
