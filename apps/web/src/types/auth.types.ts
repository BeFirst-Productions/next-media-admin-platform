import type { Role } from "@next-digital-crm/shared-types";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: string;
  permissions?: string[];
  settings?: Record<string, unknown>;
  createdAt?: string;
}

export interface AuthState {
  user: UserSession | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponseData {
  user: UserSession;
  accessToken: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorPayload {
  success: false;
  message: string;
  code: string;
  details?: unknown;
  requestId?: string;
  timestamp?: string;
}
