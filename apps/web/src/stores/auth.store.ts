import { create } from "zustand";
import type { Role } from "@next-digital-crm/shared-types";
import type { UserSession, AuthState } from "@/types/auth.types";

interface AuthActions {
  setAuth: (user: UserSession, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  hasRole: (role: Role) => boolean;
}

export type AuthStore = AuthState & AuthActions;

const AUTH_STORAGE_KEY = "crm_user_session";
const TOKEN_STORAGE_KEY = "crm_access_token";
const COOKIE_TOKEN_NAME = "crm_auth_token";
const COOKIE_ROLE_NAME = "crm_user_role";

function setCookie(name: string, value: string, days = 7): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function loadInitialState(): { user: UserSession | null; accessToken: string | null } {
  if (typeof window === "undefined") {
    return { user: null, accessToken: null };
  }

  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser) as UserSession;
      return { user, accessToken: storedToken };
    }
  } catch {
    // If parsing fails, cleanly fall back to empty state
  }

  return { user: null, accessToken: null };
}

const initial = loadInitialState();

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: initial.user,
  accessToken: initial.accessToken,
  isAuthenticated: Boolean(initial.accessToken && initial.user),
  isLoading: false,

  setAuth: (user: UserSession, accessToken: string) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      // Synchronize cookies so Next.js edge middleware can inspect auth state instantly
      setCookie(COOKIE_TOKEN_NAME, accessToken);
      setCookie(COOKIE_ROLE_NAME, user.role);
    } catch {
      // Storage access may be restricted in private mode
    }

    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setAccessToken: (accessToken: string) => {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      setCookie(COOKIE_TOKEN_NAME, accessToken);
    } catch {
      // Ignore storage errors
    }

    set({ accessToken });
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      deleteCookie(COOKIE_TOKEN_NAME);
      deleteCookie(COOKIE_ROLE_NAME);
    } catch {
      // Ignore
    }

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  hasRole: (role: Role) => {
    return get().user?.role === role;
  },
}));
