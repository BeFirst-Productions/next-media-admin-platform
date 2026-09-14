import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env, isProd } from "@/config/env";

/**
 * Reuse a single PrismaClient instance across hot-reloads in dev,
 * and across the whole process in production.
 *
 * Prisma 7 requires a driver adapter to be passed to PrismaClient.
 * We use @prisma/adapter-pg for a direct PostgreSQL connection.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: isProd ? ["error", "warn"] : ["error", "warn"],
  });
}

export const prisma = global.__prisma__ ?? createPrismaClient();

if (!isProd) {
  global.__prisma__ = prisma;
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}

