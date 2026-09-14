import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/common/errors/AppError";
import { recordAuditLog } from "@/modules/audit/audit.service";

// ----- Service Categories -----
export async function listCategories() {
  return prisma.serviceCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { packages: true } } },
  });
}

export async function createCategory(data: { name: string; description?: string; status?: boolean; sortOrder?: number }, actorId: string) {
  const category = await prisma.serviceCategory.create({ data });
  await recordAuditLog({ userId: actorId, action: "CREATE", module: "service_categories", recordId: category.id, newValues: category });
  return category;
}

export async function updateCategory(id: string, data: Partial<{ name: string; description?: string; status?: boolean; sortOrder?: number }>, actorId: string) {
  const before = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!before) throw new NotFoundError("Service category");
  const updated = await prisma.serviceCategory.update({ where: { id }, data });
  await recordAuditLog({ userId: actorId, action: "UPDATE", module: "service_categories", recordId: id, oldValues: before, newValues: updated });
  return updated;
}

// ----- Packages -----
export async function listPackages(categoryId?: string) {
  return prisma.package.findMany({
    where: { ...(categoryId ? { categoryId } : {}) },
    include: { features: { orderBy: { sortOrder: "asc" } }, category: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPackageById(id: string) {
  const pkg = await prisma.package.findUnique({ where: { id }, include: { features: true, category: true } });
  if (!pkg) throw new NotFoundError("Package");
  return pkg;
}

export async function createPackage(
  data: {
    categoryId: string; name: string; description?: string; price: number; billingType?: "ONE_TIME" | "MONTHLY" | "YEARLY" | "CUSTOM";
    duration?: string; status?: boolean; isPopular?: boolean; sortOrder?: number;
    features?: Array<{ featureName: string; featureValue?: string; included?: boolean; sortOrder?: number }>;
  },
  actorId: string,
) {
  const { features, ...pkgData } = data;
  const pkg = await prisma.package.create({
    data: { ...pkgData, features: features?.length ? { create: features } : undefined },
    include: { features: true },
  });
  await recordAuditLog({ userId: actorId, action: "CREATE", module: "packages", recordId: pkg.id, newValues: pkg });
  return pkg;
}

export async function updatePackage(id: string, data: Record<string, unknown>, actorId: string) {
  const before = await getPackageById(id);
  // NOTE: package price changes are audited explicitly — this feeds
  // "Activity History" (see spec section 23: "Changed package price ...").
  const updated = await prisma.package.update({ where: { id }, data: data as never });

  if (before.price.toString() !== updated.price.toString()) {
    await recordAuditLog({
      userId: actorId,
      action: "PRICE_CHANGE",
      module: "packages",
      recordId: id,
      oldValues: { price: before.price },
      newValues: { price: updated.price },
    });
  } else {
    await recordAuditLog({ userId: actorId, action: "UPDATE", module: "packages", recordId: id, oldValues: before, newValues: updated });
  }

  return updated;
}

// ----- Addons -----
export async function listAddons() {
  return prisma.addon.findMany({ where: { status: true }, orderBy: { name: "asc" } });
}

export async function createAddon(data: { name: string; description?: string; category?: string; price: number; pricingType?: "ONE_TIME" | "MONTHLY" | "YEARLY" | "CUSTOM"; status?: boolean }, actorId: string) {
  const addon = await prisma.addon.create({ data });
  await recordAuditLog({ userId: actorId, action: "CREATE", module: "addons", recordId: addon.id, newValues: addon });
  return addon;
}

export async function updateAddon(id: string, data: Record<string, unknown>, actorId: string) {
  const before = await prisma.addon.findUnique({ where: { id } });
  if (!before) throw new NotFoundError("Addon");
  const updated = await prisma.addon.update({ where: { id }, data: data as never });
  await recordAuditLog({ userId: actorId, action: "UPDATE", module: "addons", recordId: id, oldValues: before, newValues: updated });
  return updated;
}
