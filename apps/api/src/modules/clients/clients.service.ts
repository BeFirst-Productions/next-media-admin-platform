import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/common/errors/AppError";
import { buildPaginationMeta, toSkipTake } from "@/common/utils/pagination";
import { recordAuditLog } from "@/modules/audit/audit.service";

export async function listClients(params: { page: number; limit: number; search?: string; status?: string }) {
  const { page, limit, search, status } = params;
  const where: Prisma.ClientWhereInput = {
    ...(status ? { clientStatus: status as never } : {}),
    ...(search
      ? {
        OR: [
          { companyName: { contains: search, mode: "insensitive" } },
          { contactPerson: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { customClientId: { contains: search, mode: "insensitive" } },
        ],
      }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        contacts: true,
        lead: {
          select: {
            id: true,
            customLeadId: true,
            hasWebsite: true,
            websiteUrl: true,
            websiteScore: true,
            instagramUrl: true,
            instagramFollowers: true,
            instagramScore: true,
            hasGoogleBusiness: true,
            googleRating: true,
            assignedStaff: { select: { id: true, name: true } },
            researchExecutive: { select: { id: true, name: true } },
          },
        },
      },
      ...toSkipTake(page, limit),
    }),
    prisma.client.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(total, page, limit) };
}

export async function getClientById(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contacts: true,
      lead: {
        include: {
          assignedStaff: { select: { id: true, name: true, email: true } },
          researchExecutive: { select: { id: true, name: true, email: true } },
          source: true,
        },
      },
      proposals: { select: { id: true, proposalNumber: true, status: true, total: true, createdAt: true } },
      contracts: { select: { id: true, contractNumber: true, title: true, status: true, signedAt: true, expiresAt: true } },
      invoices: { select: { id: true, invoiceNumber: true, status: true, total: true, amountPaid: true, dueDate: true } },
      payments: { select: { id: true, amount: true, method: true, status: true, referenceNo: true, createdAt: true } },
    },
  });
  if (!client) throw new NotFoundError("Client");
  return client;
}

export async function createClient(
  data: {
    customClientId?: string;
    leadId?: string;
    companyName: string;
    industry?: string;
    location?: string;
    googleMapsLink?: string;
    contactPerson?: string;
    designation?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    billingAddress?: string;
    conversionValue?: number;
    notes?: string;
    contacts?: Array<{ name: string; designation?: string; email?: string; phone?: string; whatsapp?: string; isPrimary?: boolean }>;
  },
  actorId: string,
) {
  let customClientId = data.customClientId;
  if (!customClientId) {
    const count = await prisma.client.count();
    customClientId = `CLT-${1000 + count + 1}`;
  }

  const client = await prisma.client.create({
    data: {
      customClientId,
      leadId: data.leadId,
      companyName: data.companyName,
      industry: data.industry,
      location: data.location,
      googleMapsLink: data.googleMapsLink,
      contactPerson: data.contactPerson,
      designation: data.designation,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      billingAddress: data.billingAddress,
      conversionValue: data.conversionValue,
      notes: data.notes,
      contacts: data.contacts?.length
        ? { create: data.contacts }
        : data.contactPerson
          ? {
            create: [
              {
                name: data.contactPerson,
                designation: data.designation,
                email: data.email,
                phone: data.phone,
                whatsapp: data.whatsapp,
                isPrimary: true,
              },
            ],
          }
          : undefined,
    },
    include: { contacts: true, lead: true },
  });

  if (data.leadId) {
    await prisma.lead.update({
      where: { id: data.leadId },
      data: { status: "CLIENT", conversionStatus: "CONVERTED", convertedAt: new Date() },
    });
    await prisma.proposal.updateMany({
      where: { leadId: data.leadId },
      data: { clientId: client.id },
    });
  }

  await recordAuditLog({ userId: actorId, action: "CREATE", module: "clients", recordId: client.id, newValues: client });
  return client;
}

export async function updateClient(id: string, data: Prisma.ClientUpdateInput, actorId: string) {
  const before = await getClientById(id);
  const updated = await prisma.client.update({ where: { id }, data, include: { contacts: true, lead: true } });
  await recordAuditLog({ userId: actorId, action: "UPDATE", module: "clients", recordId: id, oldValues: before, newValues: updated });
  return updated;
}

