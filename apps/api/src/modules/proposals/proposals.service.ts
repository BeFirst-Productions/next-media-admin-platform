import { prisma } from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/common/errors/AppError";
import { buildPaginationMeta, toSkipTake } from "@/common/utils/pagination";
import { recordAuditLog } from "@/modules/audit/audit.service";
import { calculateProposal, ProposalItemInput } from "@/modules/proposals/proposal-calculator";
import { ProposalStatus } from "@prisma/client";

async function generateProposalNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.proposal.count({ where: { createdAt: { gte: new Date(`${year}-01-01`) } } });
  return `PROP-${year}-${String(count + 1).padStart(4, "0")}`;
}

/** Allowed forward transitions for the proposal status machine (spec section 12). */
const ALLOWED_TRANSITIONS: Record<ProposalStatus, ProposalStatus[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["UNDER_REVIEW", "CANCELLED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["SENT_TO_CLIENT", "CANCELLED"],
  SENT_TO_CLIENT: ["CLIENT_ACCEPTED", "REJECTED", "EXPIRED"],
  CLIENT_ACCEPTED: ["CONTRACT_CREATED"],
  CONTRACT_CREATED: [],
  REJECTED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export async function listProposals(params: {
  page: number; limit: number; status?: ProposalStatus; actorId: string; actorRole: "SUPER_ADMIN" | "SALES_STAFF";
}) {
  const { page, limit, status, actorId, actorRole } = params;
  const where = {
    ...(status ? { status } : {}),
    ...(actorRole === "SALES_STAFF" ? { salesStaffId: actorId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.proposal.findMany({
      where,
      include: { client: true, lead: true, salesStaff: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      ...toSkipTake(page, limit),
    }),
    prisma.proposal.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(total, page, limit) };
}

export async function getProposalById(id: string, actorId: string, actorRole: "SUPER_ADMIN" | "SALES_STAFF") {
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      items: true,
      lead: true,
      client: { include: { contacts: true } },
      salesStaff: { select: { id: true, name: true, email: true } },
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!proposal) throw new NotFoundError("Proposal");
  if (actorRole === "SALES_STAFF" && proposal.salesStaffId !== actorId) {
    throw new NotFoundError("Proposal"); // don't leak existence to other staff
  }
  return proposal;
}

export async function createProposal(
  input: {
    leadId?: string; clientId?: string; expectedDeliveryDate?: Date; projectDescription?: string;
    notes?: string; discount: number; taxRatePercent: number; items: ProposalItemInput[];
  },
  actorId: string,
) {
  const calc = await calculateProposal(input.items, input.discount, input.taxRatePercent);
  const proposalNumber = await generateProposalNumber();

  const proposal = await prisma.proposal.create({
    data: {
      proposalNumber,
      leadId: input.leadId,
      clientId: input.clientId,
      salesStaffId: actorId,
      status: "DRAFT",
      subtotal: calc.subtotal,
      discount: calc.discount,
      tax: calc.tax,
      total: calc.total,
      expectedDeliveryDate: input.expectedDeliveryDate,
      projectDescription: input.projectDescription,
      notes: input.notes,
      items: {
        create: calc.items.map((i) => ({
          itemType: i.itemType,
          packageId: i.packageId,
          addonId: i.addonId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.total,
        })),
      },
      statusHistory: { create: { toStatus: "DRAFT", changedBy: actorId } },
    },
    include: { items: true },
  });

  await recordAuditLog({ userId: actorId, action: "CREATE", module: "proposals", recordId: proposal.id, newValues: proposal });
  return proposal;
}

export async function recalculateProposalItems(
  id: string,
  items: ProposalItemInput[],
  discount: number | undefined,
  taxRatePercent: number | undefined,
  actorId: string,
) {
  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Proposal");
  if (existing.status !== "DRAFT") {
    throw new BadRequestError("Only DRAFT proposals can have their items changed");
  }

  const calc = await calculateProposal(items, discount ?? Number(existing.discount), taxRatePercent ?? 0);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.proposalItem.deleteMany({ where: { proposalId: id } });
    return tx.proposal.update({
      where: { id },
      data: {
        subtotal: calc.subtotal,
        discount: calc.discount,
        tax: calc.tax,
        total: calc.total,
        items: {
          create: calc.items.map((i) => ({
            itemType: i.itemType,
            packageId: i.packageId,
            addonId: i.addonId,
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.total,
          })),
        },
      },
      include: { items: true },
    });
  });

  await recordAuditLog({ userId: actorId, action: "UPDATE", module: "proposals", recordId: id, newValues: updated });
  return updated;
}

export async function transitionProposal(
  id: string,
  toStatus: ProposalStatus,
  actorId: string,
  note?: string,
) {
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) throw new NotFoundError("Proposal");

  const allowed = ALLOWED_TRANSITIONS[proposal.status];
  if (!allowed.includes(toStatus)) {
    throw new BadRequestError(`Cannot move proposal from ${proposal.status} to ${toStatus}`);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.proposal.update({ where: { id }, data: { status: toStatus } });
    await tx.proposalStatusHistory.create({
      data: { proposalId: id, fromStatus: proposal.status, toStatus, changedBy: actorId, note },
    });
    return p;
  });

  await recordAuditLog({
    userId: actorId, action: "STATUS_CHANGE", module: "proposals", recordId: id,
    oldValues: { status: proposal.status }, newValues: { status: toStatus },
  });

  return updated;
}
