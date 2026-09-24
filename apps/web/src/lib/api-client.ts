import type { ApiSuccessResponse, ApiErrorResponse } from "@next-digital-crm/shared-types";
import { useAuthStore } from "@/stores/auth.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly requestId?: string;

  constructor(status: number, message: string, code: string, details?: unknown, requestId?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  requiresAuth?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<ApiSuccessResponse<T>> {
  const { body, requiresAuth = true, headers: customHeaders, ...customOptions } = options;

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (customHeaders) {
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, customHeaders);
    }
  }

  const token = useAuthStore.getState().accessToken;
  if (requiresAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...customOptions,
    headers,
    credentials: "include", // Required for refresh token cookie
  };

  if (body !== undefined) {
    fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  // If 401 Unauthorized and not already refreshing or calling auth endpoints, try refreshing
  if (response.status === 401 && requiresAuth && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
    if (isRefreshing) {
      return new Promise<ApiSuccessResponse<T>>((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            headers["Authorization"] = `Bearer ${newToken}`;
            fetch(url, { ...fetchOptions, headers })
              .then((res) => parseResponse<T>(res))
              .then(resolve)
              .catch(reject);
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        throw new Error("Session expired. Please log in again.");
      }

      const refreshData = (await refreshResponse.json()) as ApiSuccessResponse<{
        accessToken: string;
      }>;
      const newToken = refreshData.data.accessToken;

      useAuthStore.getState().setAccessToken(newToken);
      processQueue(null, newToken);

      headers["Authorization"] = `Bearer ${newToken}`;
      return parseResponse<T>(await fetch(url, { ...fetchOptions, headers }));
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      useAuthStore.getState().clearAuth();
      throw new ApiClientError(401, "Session expired", "SESSION_EXPIRED");
    } finally {
      isRefreshing = false;
    }
  }

  return parseResponse<T>(response);
}

async function parseResponse<T>(response: Response): Promise<ApiSuccessResponse<T>> {
  const isJson = response.headers.get("content-type")?.includes("application/json");

  if (!response.ok) {
    if (isJson) {
      const errorJson = (await response.json()) as ApiErrorResponse;
      throw new ApiClientError(
        response.status,
        errorJson.message || "An unexpected error occurred",
        errorJson.code || "UNKNOWN_ERROR",
        errorJson.details,
        errorJson.requestId,
      );
    }
    const text = await response.text();
    throw new ApiClientError(
      response.status,
      text || response.statusText || "Request failed",
      "HTTP_ERROR",
    );
  }

  if (response.status === 204) {
    return {
      success: true,
      message: "No content",
      data: {} as T,
      timestamp: new Date().toISOString(),
    };
  }

  const data = (await response.json()) as ApiSuccessResponse<T>;
  return data;
}
