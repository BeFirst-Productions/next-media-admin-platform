import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/common/errors/AppError";
import { buildPaginationMeta, toSkipTake } from "@/common/utils/pagination";
import { recordAuditLog } from "@/modules/audit/audit.service";
import { notifyUser } from "@/modules/notifications/notifications.service";

interface ListLeadsParams {
  page: number;
  limit: number;
  status?: string;
  assignedStaffId?: string;
  industry?: string;
  search?: string;
  actorId: string;
  actorRole: "SUPER_ADMIN" | "SALES_STAFF";
}

export async function listLeads(params: ListLeadsParams) {
  const { page, limit, status, assignedStaffId, industry, search, actorId, actorRole } = params;

  // Sales staff only ever see their own leads — enforced server-side,
  // regardless of query params they might try to pass.
  const scopedAssignee = actorRole === "SALES_STAFF" ? actorId : assignedStaffId;

  const where: Prisma.LeadWhereInput = {
    ...(status ? { status: status as never } : {}),
    ...(scopedAssignee ? { assignedStaffId: scopedAssignee } : {}),
    ...(industry ? { industry } : {}),
    ...(search
      ? {
          OR: [
            { companyName: { contains: search, mode: "insensitive" } },
            { contactPerson: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { assignedStaff: { select: { id: true, name: true } }, source: true },
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
      source: true,
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { id: true, name: true } } } },
      activities: { orderBy: { createdAt: "desc" } },
      proposals: { select: { id: true, proposalNumber: true, status: true, total: true } },
    },
  });
  if (!lead) throw new NotFoundError("Lead");
  return lead;
}

export async function createLead(data: Prisma.LeadUncheckedCreateInput, actorId: string) {
  const lead = await prisma.lead.create({ data: { ...data, createdById: actorId } });

  await recordAuditLog({ userId: actorId, action: "CREATE", module: "leads", recordId: lead.id, newValues: lead });

  if (lead.assignedStaffId) {
    await notifyUser({
      userId: lead.assignedStaffId,
      type: "NEW_LEAD_ASSIGNED",
      title: "New lead assigned",
      message: `You were assigned a new lead: ${lead.companyName}`,
      referenceType: "lead",
      referenceId: lead.id,
    });
  }

  return lead;
}

export async function updateLead(id: string, data: Prisma.LeadUncheckedUpdateInput, actorId: string) {
  const before = await getLeadById(id);
  const updated = await prisma.lead.update({ where: { id }, data });

  await prisma.leadActivity.create({
    data: { leadId: id, userId: actorId, activity: `Lead updated${data.status ? ` — status → ${data.status}` : ""}` },
  });

  await recordAuditLog({ userId: actorId, action: "UPDATE", module: "leads", recordId: id, oldValues: before, newValues: updated });

  return updated;
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
  await prisma.lead.delete({ where: { id } });
  await recordAuditLog({ userId: actorId, action: "DELETE", module: "leads", recordId: id, oldValues: existing });
}
