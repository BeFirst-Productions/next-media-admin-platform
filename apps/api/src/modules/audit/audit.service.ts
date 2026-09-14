import { prisma } from "@/lib/prisma";
import { logger } from "@/config/logger";

interface AuditInput {
  userId?: string;
  action: string; // e.g. "CREATE", "UPDATE", "DELETE"
  module: string; // e.g. "proposals", "packages"
  recordId?: string;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string;
}

/**
 * Fire-and-forget audit logging. Failures here must NEVER break the
 * calling business transaction, so errors are swallowed and logged.
 */
export async function recordAuditLog(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        module: input.module,
        recordId: input.recordId,
        oldValues: input.oldValues as never,
        newValues: input.newValues as never,
        ipAddress: input.ipAddress,
      },
    });
  } catch (err) {
    logger.warn({ err, input }, "Failed to write audit log");
  }
}
