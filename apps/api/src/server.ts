import { createApp } from "@/app";
import { env } from "@/config/env";
import { logger } from "@/config/logger";
import { connectDatabase, disconnectDatabase } from "@/lib/prisma";

async function bootstrap() {
  await connectDatabase();
  logger.info("✅ Database connected");

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Next Digital CRM API running on port ${env.PORT} [${env.NODE_ENV}]`);
    logger.info(`   API base: http://localhost:${env.PORT}${env.API_PREFIX}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info("Shutdown complete.");
      process.exit(0);
    });
    // Force-exit if graceful shutdown hangs
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled promise rejection");
  });
  process.on("uncaughtException", (err) => {
    logger.error({ err }, "Uncaught exception — exiting");
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
