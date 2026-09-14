import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@/common/errors/AppError";
import { verifyAccessToken, AccessTokenPayload } from "@/common/utils/tokens";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

/**
 * Verifies the JWT access token from the Authorization header and attaches
 * the decoded payload to `req.user`. Does NOT hit the database on every
 * request (fast path) — controllers that need fresh user state should
 * load it explicitly.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or malformed Authorization header");
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }
}
