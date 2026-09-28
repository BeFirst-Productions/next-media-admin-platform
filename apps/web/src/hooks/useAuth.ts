"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Role, PermissionString } from "@next-digital-crm/shared-types";
import { useAuthStore } from "@/stores/auth.store";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import type { LoginResponseData } from "@/types/auth.types";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const toast = useToast();
  const { user, accessToken, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoggingIn(true);
      try {
        const response = await apiClient<LoginResponseData>("/auth/login", {
          method: "POST",
          body: credentials,
          requiresAuth: false,
        });

        if (response.success && response.data) {
          const { user, accessToken } = response.data;
          setAuth(user, accessToken);
          toast.success("Welcome back!", `Signed in as ${user.name}`);
          router.push("/dashboard");
          return response.data;
        }
        return null;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to log in";
        toast.error("Login Failed", message);
        throw err;
      } finally {
        setIsLoggingIn(false);
      }
    },
    [setAuth, toast, router]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiClient("/auth/logout", {
        method: "POST",
        requiresAuth: true,
      });
    } catch {
      // Ignore logout request errors and proceed with clearing local auth
    } finally {
      clearAuth();
      toast.info("Logged Out", "You have been signed out.");
      router.push("/login");
    }
  }, [clearAuth, setLoading, toast, router]);

  const hasPermission = useCallback(
    (permission: PermissionString | string): boolean => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN") return true;
      if (user.permissions && Array.isArray(user.permissions)) {
        return user.permissions.includes(permission);
      }
      return false;
    },
    [user]
  );

  const hasRole = useCallback(
    (role: Role): boolean => {
      return user?.role === role;
    },
    [user]
  );

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isLoggingIn,
    login,
    logout,
    hasPermission,
    hasRole,
  };
}
