import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "@/common/errors/AppError";
import { logger } from "@/config/logger";
import { isProd } from "@/config/env";

/**
 * Single place where every error in the app ends up.
 * Anything thrown in a controller/service (sync or async, thanks to
 * express-async-errors) lands here instead of crashing the process
 * or leaking a raw stack trace to the client.
 */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = (req as Request & { id?: string }).id;

  // 1. Known, predictable application errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId }, "Operational 5xx error");
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      ...(err.details ? { details: err.details } : {}),
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Zod validation errors that escaped the validate() middleware
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: err.flatten().fieldErrors,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  // 3. Known Prisma errors mapped to sane HTTP codes
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = mapPrismaError(err);
    return res.status(mapped.statusCode).json({
      success: false,
      message: mapped.message,
      code: mapped.code,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  // 4. Anything else = unexpected bug. Log full detail, hide it from the client.
  logger.error({ err, requestId }, "Unhandled error");
  return res.status(500).json({
    success: false,
    message: isProd ? "Internal server error" : (err as Error)?.message ?? "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    requestId,
    timestamp: new Date().toISOString(),
  });
}

function mapPrismaError(err: Prisma.PrismaClientKnownRequestError) {
  switch (err.code) {
    case "P2002":
      return { statusCode: 409, code: "UNIQUE_CONSTRAINT", message: `Duplicate value for: ${(err.meta?.target as string[])?.join(", ")}` };
    case "P2025":
      return { statusCode: 404, code: "NOT_FOUND", message: "Record not found" };
    case "P2003":
      return { statusCode: 409, code: "FOREIGN_KEY_CONSTRAINT", message: "Related record does not exist" };
    default:
      return { statusCode: 400, code: "DATABASE_ERROR", message: "Database request failed" };
  }
}
