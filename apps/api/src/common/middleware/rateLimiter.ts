import rateLimit from "express-rate-limit";
import { env } from "@/config/env";
import { TooManyRequestsError } from "@/common/errors/AppError";

const handler = () => {
  throw new TooManyRequestsError();
};

/** Applied globally to /api/* */
export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/** Stricter limiter for /auth/login, /auth/register, /auth/refresh */
export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});
