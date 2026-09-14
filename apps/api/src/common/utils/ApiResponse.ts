import { Response } from "express";

/**
 * Standard success envelope used by EVERY endpoint in the API.
 * Keeping this consistent means the frontend never has to guess
 * the shape of a response.
 */
interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message = "Success", statusCode = 200, meta?: Meta) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
      timestamp: new Date().toISOString(),
    });
  }

  static created<T>(res: Response, data: T, message = "Created successfully") {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
