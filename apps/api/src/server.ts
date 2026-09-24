import { createApp } from "@/app";
import { env, isProd } from "@/config/env";
import { logger } from "@/config/logger";
import {
  printServerBanner,
  printShutdownMessage,
  printStartupErrorBanner,
} from "@/config/banner";
import { connectDatabase, disconnectDatabase } from "@/lib/prisma";

async function bootstrap() {
  const startTime = performance.now();

  // 1. Establish database connection
  await connectDatabase();

  // 2. Instantiate and mount Express application
  const app = createApp();

  // 3. Start HTTP server
  const server = app.listen(env.PORT, () => {
    const bootDurationMs = Math.round(performance.now() - startTime);

    // Display professional developer experience banner in terminal
    printServerBanner({
      port: env.PORT,
      apiPrefix: env.API_PREFIX,
      clientUrl: env.CLIENT_URL,
      nodeEnv: env.NODE_ENV,
      databaseConnected: true,
      bootDurationMs,
    });

    // Structured log for monitoring systems and log collectors
    if (isProd) {
      logger.info(
        {
          service: "next-digital-crm-api",
          port: env.PORT,
          env: env.NODE_ENV,
          apiPrefix: env.API_PREFIX,
          pid: process.pid,
          bootDurationMs,
        },
        "API server started successfully",
      );
    }
  });

  server.on("error", (err) => {
    printStartupErrorBanner(err);
    logger.fatal({ err }, "Server listen failure");
    process.exit(1);
  });

  // Graceful shutdown sequence
  let isShuttingDown = false;
  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    printShutdownMessage(signal, "start");
    logger.info({ signal }, "Shutdown signal received. Starting graceful shutdown sequence...");

    // Force-exit safety fallback if connections refuse to drain within 10s
    const forceExitTimer = setTimeout(() => {
      logger.error("Graceful shutdown timeout exceeded (10s). Forcing termination.");
      process.exit(1);
    }, 10_000).unref();

    server.close(async (httpErr) => {
      if (httpErr) {
        logger.error({ err: httpErr }, "Error while closing HTTP server");
      } else {
        printShutdownMessage(signal, "http_closed");
      }

      try {
        await disconnectDatabase();
        printShutdownMessage(signal, "db_closed");
      } catch (dbErr) {
        logger.error({ err: dbErr }, "Error disconnecting database client");
      }

      clearTimeout(forceExitTimer);
      printShutdownMessage(signal, "done");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled promise rejection");
  });

  process.on("uncaughtException", (err) => {
    logger.error({ err }, "Uncaught exception — exiting process");
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  printStartupErrorBanner(err);
  logger.fatal({ err }, "Fatal error during server startup");
  process.exit(1);
});
