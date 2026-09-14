import { prisma } from "@/lib/prisma";
import { logger } from "@/config/logger";
import { NotificationType } from "@prisma/client";

interface NotifyInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceType?: string;
  referenceId?: string;
}

/** Creates an in-app notification row. Swallows failures so a notification
 * problem never blocks the business operation that triggered it. */
export async function notifyUser(input: NotifyInput): Promise<void> {
  try {
    await prisma.notification.create({ data: input });
  } catch (err) {
    logger.warn({ err, input }, "Failed to create notification");
  }
}

export async function listNotifications(userId: string, unreadOnly = false) {
  return prisma.notification.findMany({
    where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markAsRead(userId: string, id: string) {
  return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
}
