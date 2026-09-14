import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Note: with `express-async-errors` imported once in app.ts, thrown/rejected
 * errors inside async route handlers already propagate to errorHandler
 * automatically. This wrapper is kept for explicitness/readability and for
 * codebases that later drop that patch package.
 */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
