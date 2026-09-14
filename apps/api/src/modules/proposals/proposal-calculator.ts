import { prisma } from "@/lib/prisma";
import { BadRequestError } from "@/common/errors/AppError";

export interface ProposalItemInput {
  itemType: "PACKAGE" | "ADDON";
  packageId?: string;
  addonId?: string;
  quantity: number;
}

export interface CalculatedItem {
  itemType: "PACKAGE" | "ADDON";
  packageId?: string;
  addonId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ProposalCalculation {
  items: CalculatedItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

/**
 * THE single source of truth for proposal pricing.
 *
 * Per spec section 9 ("Never trust the frontend total"): the client may
 * display a running total for UX, but every price used here is re-read
 * from the database (packages/addons tables), never taken from the
 * request body — so a tampered request can't change what gets charged.
 */
export async function calculateProposal(
  itemsInput: ProposalItemInput[],
  discount: number,
  taxRatePercent: number,
): Promise<ProposalCalculation> {
  const packageIds = itemsInput.filter((i) => i.itemType === "PACKAGE").map((i) => i.packageId!) ;
  const addonIds = itemsInput.filter((i) => i.itemType === "ADDON").map((i) => i.addonId!);

  const [packages, addons] = await Promise.all([
    packageIds.length ? prisma.package.findMany({ where: { id: { in: packageIds } } }) : Promise.resolve([]),
    addonIds.length ? prisma.addon.findMany({ where: { id: { in: addonIds } } }) : Promise.resolve([]),
  ]);

  const packageMap = new Map(packages.map((p) => [p.id, p]));
  const addonMap = new Map(addons.map((a) => [a.id, a]));

  const items: CalculatedItem[] = itemsInput.map((input) => {
    if (input.itemType === "PACKAGE") {
      const pkg = packageMap.get(input.packageId!);
      if (!pkg || !pkg.status) throw new BadRequestError(`Package ${input.packageId} is not available`);
      const unitPrice = Number(pkg.price);
      return {
        itemType: "PACKAGE",
        packageId: pkg.id,
        name: pkg.name,
        quantity: input.quantity,
        unitPrice,
        total: round2(unitPrice * input.quantity),
      };
    }

    const addon = addonMap.get(input.addonId!);
    if (!addon || !addon.status) throw new BadRequestError(`Add-on ${input.addonId} is not available`);
    const unitPrice = Number(addon.price);
    return {
      itemType: "ADDON",
      addonId: addon.id,
      name: addon.name,
      quantity: input.quantity,
      unitPrice,
      total: round2(unitPrice * input.quantity),
    };
  });

  const subtotal = round2(items.reduce((sum, i) => sum + i.total, 0));
  const safeDiscount = Math.min(discount, subtotal); // discount can never exceed subtotal
  const taxableAmount = subtotal - safeDiscount;
  const tax = round2(taxableAmount * (taxRatePercent / 100));
  const total = round2(taxableAmount + tax);

  return { items, subtotal, discount: round2(safeDiscount), tax, total };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
