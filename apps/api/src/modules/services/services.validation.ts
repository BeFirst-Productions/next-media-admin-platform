import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    status: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
  }),
});
export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createCategorySchema.shape.body.partial(),
});

const featureSchema = z.object({
  featureName: z.string().min(1),
  featureValue: z.string().optional(),
  included: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const createPackageSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid(),
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().nonnegative(),
    billingType: z.enum(["ONE_TIME", "MONTHLY", "YEARLY", "CUSTOM"]).default("ONE_TIME"),
    duration: z.string().optional(),
    status: z.boolean().default(true),
    isPopular: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    features: z.array(featureSchema).optional(),
  }),
});
export const updatePackageSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createPackageSchema.shape.body.partial(),
});

export const createAddonSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    category: z.string().optional(),
    price: z.coerce.number().nonnegative(),
    pricingType: z.enum(["ONE_TIME", "MONTHLY", "YEARLY", "CUSTOM"]).default("ONE_TIME"),
    status: z.boolean().default(true),
  }),
});
export const updateAddonSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createAddonSchema.shape.body.partial(),
});

export const idParamSchema = z.object({ params: z.object({ id: z.string().uuid() }) });
