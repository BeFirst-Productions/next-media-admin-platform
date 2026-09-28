import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/common/errors/AppError";
import { buildPaginationMeta, toSkipTake } from "@/common/utils/pagination";
import { recordAuditLog } from "@/modules/audit/audit.service";
import { notifyUser } from "@/modules/notifications/notifications.service";

import { RoleName } from "@/common/constants/roles";

interface ListLeadsParams {
  page: number;
  limit: number;
  status?: string;
  conversionStatus?: string;
  assignedStaffId?: string;
  researchExecutiveId?: string;
  industry?: string;
  search?: string;
  actorId: string;
  actorRole: RoleName;
}

export async function listLeads(params: ListLeadsParams) {
  const { page, limit, status, conversionStatus, assignedStaffId, researchExecutiveId, industry, search, actorId, actorRole } = params;

  // Sales staff only ever see their own assigned leads — enforced server-side
  const scopedAssignee = actorRole === "SALES_STAFF" ? actorId : assignedStaffId;

  const where: Prisma.LeadWhereInput = {
    ...(status ? { status: status as never } : {}),
    ...(conversionStatus ? { conversionStatus: conversionStatus as never } : {}),
    ...(scopedAssignee ? { assignedStaffId: scopedAssignee } : {}),
    ...(researchExecutiveId ? { researchExecutiveId } : {}),
    ...(industry ? { industry } : {}),
    ...(search
      ? {
        OR: [
          { companyName: { contains: search, mode: "insensitive" } },
          { contactPerson: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
          { customLeadId: { contains: search, mode: "insensitive" } },
        ],
      }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        assignedStaff: { select: { id: true, name: true, email: true } },
        researchExecutive: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        source: true,
        recommendedPackage: { select: { id: true, name: true, price: true } },
        client: { select: { id: true, customClientId: true, clientStatus: true } },
      },
      orderBy: { createdAt: "desc" },
      ...toSkipTake(page, limit),
    }),
    prisma.lead.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(total, page, limit) };
}

export async function getLeadById(id: string) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      assignedStaff: { select: { id: true, name: true, email: true } },
      researchExecutive: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true, email: true } },
      source: true,
      recommendedPackage: { select: { id: true, name: true, price: true, description: true } },
      client: {
        include: {
          contacts: true,
        },
      },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { id: true, name: true } } } },
      activities: { orderBy: { createdAt: "desc" }, include: { user: { select: { id: true, name: true } } } },
      proposals: { select: { id: true, proposalNumber: true, status: true, total: true, createdAt: true } },
    },
  });
  if (!lead) throw new NotFoundError("Lead");
  return lead;
}

export async function createLead(data: Prisma.LeadUncheckedCreateInput, actorId: string) {
  // Generate auto customLeadId if not provided e.g. LED-1001
  let customLeadId = data.customLeadId;
  if (!customLeadId) {
    const count = await prisma.lead.count();
    customLeadId = `LED-${1000 + count + 1}`;
  }

  const lead = await prisma.lead.create({
    data: {
      ...data,
      customLeadId,
      createdById: actorId,
    },
    include: {
      assignedStaff: { select: { id: true, name: true } },
      researchExecutive: { select: { id: true, name: true } },
      source: true,
      recommendedPackage: true,
    },
  });

  await recordAuditLog({ userId: actorId, action: "CREATE", module: "leads", recordId: lead.id, newValues: lead });

  await prisma.leadActivity.create({
    data: { leadId: lead.id, userId: actorId, activity: `Lead created (${lead.customLeadId})` },
  });

  if (lead.assignedStaffId) {
    await notifyUser({
      userId: lead.assignedStaffId,
      type: "NEW_LEAD_ASSIGNED",
      title: "New lead assigned",
      message: `You were assigned a new lead: ${lead.companyName} (${lead.customLeadId})`,
      referenceType: "lead",
      referenceId: lead.id,
    });
  }

  return lead;
}

export async function updateLead(id: string, data: Prisma.LeadUncheckedUpdateInput, actorId: string) {
  const before = await getLeadById(id);
  const updated = await prisma.lead.update({
    where: { id },
    data,
    include: {
      assignedStaff: { select: { id: true, name: true } },
      researchExecutive: { select: { id: true, name: true } },
      source: true,
      recommendedPackage: true,
      client: true,
    },
  });

  await prisma.leadActivity.create({
    data: { leadId: id, userId: actorId, activity: `Lead updated${data.status ? ` — status → ${data.status}` : ""}` },
  });

  await recordAuditLog({ userId: actorId, action: "UPDATE", module: "leads", recordId: id, oldValues: before, newValues: updated });

  return updated;
}

export async function convertLeadToClient(
  leadId: string,
  payload: { billingAddress?: string; notes?: string; conversionValue?: number },
  actorId: string,
) {
  const lead = await getLeadById(leadId);

  if (lead.client) {
    throw new BadRequestError(`Lead is already converted to client: ${lead.client.customClientId || lead.client.companyName}`);
  }

  const result = await prisma.$transaction(async (tx) => {
    const clientCount = await tx.client.count();
    const customClientId = `CLT-${1000 + clientCount + 1}`;
    const conversionValue = payload.conversionValue ?? (lead.proposalValue ? Number(lead.proposalValue) : Number(lead.value) || 0);

    // 1. Create Client record
    const client = await tx.client.create({
      data: {
        customClientId,
        leadId: lead.id,
        companyName: lead.companyName,
        industry: lead.industry,
        location: lead.location,
        googleMapsLink: lead.googleMapsLink,
        contactPerson: lead.contactPerson,
        designation: lead.designation,
        email: lead.email,
        phone: lead.phone,
        whatsapp: lead.whatsapp,
        billingAddress: payload.billingAddress || lead.location,
        clientStatus: "ACTIVE",
        conversionValue,
        notes: payload.notes || lead.remarks,
        contacts: {
          create: [
            {
              name: lead.contactPerson,
              designation: lead.designation,
              email: lead.email,
              phone: lead.phone,
              whatsapp: lead.whatsapp,
              isPrimary: true,
            },
          ],
        },
      },
      include: { contacts: true },
    });

    // 2. Update Lead status to CLIENT and CONVERTED
    await tx.lead.update({
      where: { id: leadId },
      data: {
        status: "CLIENT",
        conversionStatus: "CONVERTED",
        convertedAt: new Date(),
      },
    });

    // 3. Link any existing proposals belonging to this lead to the newly created Client
    await tx.proposal.updateMany({
      where: { leadId },
      data: { clientId: client.id },
    });

    // 4. Create activity entry
    await tx.leadActivity.create({
      data: {
        leadId,
        userId: actorId,
        activity: `Lead successfully converted to Client (${client.customClientId})`,
      },
    });

    return client;
  });

  await recordAuditLog({
    userId: actorId,
    action: "CREATE",
    module: "clients",
    recordId: result.id,
    newValues: { convertedFromLeadId: leadId, clientId: result.id, customClientId: result.customClientId },
  });

  return result;
}

export async function assignLead(id: string, staffId: string, actorId: string) {
  const updated = await updateLead(id, { assignedStaffId: staffId }, actorId);
  await notifyUser({
    userId: staffId,
    type: "NEW_LEAD_ASSIGNED",
    title: "Lead assigned to you",
    message: `Lead "${updated.companyName}" was assigned to you`,
    referenceType: "lead",
    referenceId: id,
  });
  return updated;
}

export async function addLeadNote(id: string, note: string, actorId: string) {
  await getLeadById(id);
  return prisma.leadNote.create({ data: { leadId: id, authorId: actorId, note } });
}

export async function deleteLead(id: string, actorId: string) {
  const existing = await getLeadById(id);

  if (existing.client || existing.conversionStatus === "CONVERTED" || existing.status === "CLIENT") {
    throw new BadRequestError(
      "Converted leads cannot be deleted because they are linked to an active Client profile. To manage or remove this account, use the Clients directory.",
    );
  }

  await prisma.lead.delete({ where: { id } });
  await recordAuditLog({ userId: actorId, action: "DELETE", module: "leads", recordId: id, oldValues: existing });
}

