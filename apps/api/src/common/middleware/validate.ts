import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ValidationError } from "@/common/errors/AppError";

/**
 * Validates & coerces req.body / req.query / req.params against a Zod schema
 * shaped as { body?, query?, params? }, and replaces the request objects
 * with the parsed (typed, coerced, defaulted) values.
 */
export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError("Validation failed", err.flatten().fieldErrors);
      }
      throw err;
    }
  };
}
