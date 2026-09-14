import pino from "pino";
import { env, isProd } from "@/config/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" },
      },
  base: { service: "next-digital-crm-api" },
  redact: ["req.headers.authorization", "*.password", "*.passwordHash"],
});
