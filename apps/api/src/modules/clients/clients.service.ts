import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/common/errors/AppError";
import { buildPaginationMeta, toSkipTake } from "@/common/utils/pagination";
import { recordAuditLog } from "@/modules/audit/audit.service";

export async function listClients(params: { page: number; limit: number; search?: string }) {
  const { page, limit, search } = params;
  const where: Prisma.ClientWhereInput = search
    ? { companyName: { contains: search, mode: "insensitive" } }
    : {};

  const [items, total] = await Promise.all([
    prisma.client.findMany({ where, orderBy: { createdAt: "desc" }, include: { contacts: true }, ...toSkipTake(page, limit) }),
    prisma.client.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(total, page, limit) };
}

export async function getClientById(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contacts: true,
      proposals: { select: { id: true, proposalNumber: true, status: true, total: true } },
      contracts: { select: { id: true, contractNumber: true, status: true } },
      invoices: { select: { id: true, invoiceNumber: true, status: true, total: true, amountPaid: true } },
    },
  });
  if (!client) throw new NotFoundError("Client");
  return client;
}

export async function createClient(
  data: { leadId?: string; companyName: string; industry?: string; location?: string; billingAddress?: string; contacts?: Array<{ name: string; email?: string; phone?: string; isPrimary?: boolean }> },
  actorId: string,
) {
  const client = await prisma.client.create({
    data: {
      leadId: data.leadId,
      companyName: data.companyName,
      industry: data.industry,
      location: data.location,
      billingAddress: data.billingAddress,
      contacts: data.contacts?.length ? { create: data.contacts } : undefined,
    },
    include: { contacts: true },
  });

  if (data.leadId) {
    await prisma.lead.update({ where: { id: data.leadId }, data: { status: "CLIENT" } });
  }

  await recordAuditLog({ userId: actorId, action: "CREATE", module: "clients", recordId: client.id, newValues: client });
  return client;
}

export async function updateClient(id: string, data: Prisma.ClientUpdateInput, actorId: string) {
  const before = await getClientById(id);
  const updated = await prisma.client.update({ where: { id }, data });
  await recordAuditLog({ userId: actorId, action: "UPDATE", module: "clients", recordId: id, oldValues: before, newValues: updated });
  return updated;
}
