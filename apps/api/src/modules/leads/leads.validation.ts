import { z } from "zod";
import { paginationSchema } from "@/common/utils/pagination";

const LEAD_STATUSES = [
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

const CONVERSION_STATUSES = ["PENDING", "CONVERTED", "REJECTED", "ON_HOLD"] as const;
const CONTACT_METHODS = ["CALL", "WHATSAPP", "EMAIL", "IN_PERSON_MEETING", "OTHER"] as const;

export const createLeadSchema = z.object({
  body: z.object({
    customLeadId: z.string().optional(),
    date: z.coerce.date().optional(),
    companyName: z.string().min(1, "Company name is required"),
    contactPerson: z.string().min(1, "Contact person is required"),
    designation: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    location: z.string().optional(),
    googleMapsLink: z.string().optional(),
    industry: z.string().optional(),
    decisionMakerAvailable: z.boolean().optional(),

    // Digital Audit & Presence
    hasWebsite: z.boolean().optional(),
    websiteUrl: z.string().optional(),
    websiteScore: z.coerce.number().min(0).max(10).optional(),
    websiteIssues: z.string().optional(),
    instagramUrl: z.string().optional(),
    instagramFollowers: z.coerce.number().int().min(0).optional(),
    instagramPosts: z.coerce.number().int().min(0).optional(),
    instagramLastPostDate: z.coerce.date().optional(),
    instagramScore: z.coerce.number().min(0).max(10).optional(),
    facebookUrl: z.string().optional(),
    linkedInUrl: z.string().optional(),
    hasGoogleBusiness: z.boolean().optional(),
    googleRating: z.coerce.number().min(0).max(5).optional(),
    googleReviews: z.coerce.number().int().min(0).optional(),
    socialMediaIssues: z.string().optional(),

    // Sales & Prospecting
    servicesRequired: z.string().optional(),
    recommendedPackageId: z.string().uuid().optional().or(z.literal("")),
    value: z.coerce.number().nonnegative().optional(),
    status: z.enum(LEAD_STATUSES).optional(),
    conversionStatus: z.enum(CONVERSION_STATUSES).optional(),
    firstContactDate: z.coerce.date().optional(),
    contactMethod: z.enum(CONTACT_METHODS).optional(),
    response: z.string().optional(),
    followUpDate: z.coerce.date().optional(),
    meetingDate: z.coerce.date().optional(),
    proposalSent: z.boolean().optional(),
    proposalValue: z.coerce.number().nonnegative().optional(),
    remarks: z.string().optional(),
    additionalNotes: z.string().optional(),
    projectDescription: z.string().optional(),
    expectedDeliveryDate: z.coerce.date().optional(),

    sourceId: z.string().uuid().optional().or(z.literal("")),
    researchExecutiveId: z.string().uuid().optional().or(z.literal("")),
    assignedStaffId: z.string().uuid().optional().or(z.literal("")),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createLeadSchema.shape.body.partial(),
});

export const convertLeadSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    billingAddress: z.string().optional(),
    notes: z.string().optional(),
    conversionValue: z.coerce.number().nonnegative().optional(),
  }),
});

export const listLeadsSchema = z.object({
  query: paginationSchema.extend({
    status: z.enum(LEAD_STATUSES).optional(),
    conversionStatus: z.enum(CONVERSION_STATUSES).optional(),
    assignedStaffId: z.string().uuid().optional(),
    researchExecutiveId: z.string().uuid().optional(),
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

