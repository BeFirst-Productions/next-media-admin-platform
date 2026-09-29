"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Role, LoginPayload } from "@next-digital-crm/shared-types";
import { useAuthStore } from "@/stores/auth.store";
import { apiClient, ApiClientError } from "@/lib/api-client";
import { useToast } from "@/hooks/useToast";
import { hasPermission as checkPermission, ROLE_DEFAULT_TEMPLATES } from "@/config/permissions";
import type { LoginResponseData, UserSession } from "@/types/auth.types";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, accessToken, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  // Query current user profile if token is present
  const sessionQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      if (accessToken?.startsWith("mock-jwt-token-")) {
        return user;
      }
      try {
        const response = await apiClient<UserSession>("/auth/me");
        return response.data;
      } catch {
        return user;
      }
    },
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      try {
        const response = await apiClient<LoginResponseData>("/auth/login", {
          method: "POST",
          body: credentials,
          requiresAuth: false,
        });
        return response.data;
      } catch (err) {
        // Smart fallback: if database is offline or network fails, support seeded demo accounts
        const isDbOffline =
          (err instanceof ApiClientError && (err.code === "DATABASE_ERROR" || err.status >= 500)) ||
          (err instanceof TypeError && err.message.includes("fetch"));

        if (isDbOffline) {
          if (
            credentials.email === "admin@nextdigital.crm" &&
            credentials.password === "Admin@12345"
          ) {
            return {
              user: {
                id: "demo-admin-id",
                name: "Super Admin",
                email: "admin@nextdigital.crm",
                role: "SUPER_ADMIN" as const,
                status: "ACTIVE",
                permissions: [...ROLE_DEFAULT_TEMPLATES.SUPER_ADMIN],
                settings: { theme: "dark", roleView: "total_controller" },
              },
              accessToken: "mock-jwt-token-super-admin",
            };
          }

          if (
            credentials.email === "admin.ops@nextdigital.crm" &&
            credentials.password === "Admin@12345"
          ) {
            return {
              user: {
                id: "demo-admin-ops-id",
                name: "Sarah (Operations Admin)",
                email: "admin.ops@nextdigital.crm",
                role: "ADMIN" as const,
                status: "ACTIVE",
                permissions: [...ROLE_DEFAULT_TEMPLATES.ADMIN],
                settings: { theme: "dark", roleView: "operations_overview" },
              },
              accessToken: "mock-jwt-token-admin-ops",
            };
          }

          if (
            credentials.email === "staff@nextdigital.crm" &&
            credentials.password === "Staff@12345"
          ) {
            return {
              user: {
                id: "demo-staff-id",
                name: "Anaz (Sales Staff)",
                email: "staff@nextdigital.crm",
                role: "SALES_STAFF" as const,
                status: "ACTIVE",
                permissions: [...ROLE_DEFAULT_TEMPLATES.SALES_STAFF],
                settings: { theme: "dark", roleView: "personal_sales_cockpit" },
              },
              accessToken: "mock-jwt-token-sales-staff",
            };
          }

          if (
            credentials.email === "marketing@nextdigital.crm" &&
            credentials.password === "Market@12345"
          ) {
            return {
              user: {
                id: "demo-marketing-id",
                name: "Elena (Marketing Lead)",
                email: "marketing@nextdigital.crm",
                role: "MARKETING_TEAM" as const,
                status: "ACTIVE",
                permissions: [...ROLE_DEFAULT_TEMPLATES.MARKETING_TEAM],
                settings: { theme: "dark", roleView: "marketing_growth_hub" },
              },
              accessToken: "mock-jwt-token-marketing",
            };
          }
        }

        throw err;
      }
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(["auth", "me"], data.user);
      toast({
        type: "success",
        title: "Welcome back!",
        description: `Signed in as ${data.user.name} (${data.user.role.replace(/_/g, " ")})`,
      });

      // Role-aware redirect
      router.push("/dashboard");
    },
    onError: (err) => {
      let message = "Invalid email or password";
      if (err instanceof ApiClientError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast({
        type: "error",
        title: "Sign in failed",
        description: message,
      });
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiClient<null>("/auth/logout", {
          method: "POST",
          requiresAuth: true,
        });
      } catch {
        // Even if server request fails, clear local state
      }
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      toast({
        type: "info",
        title: "Logged out",
        description: "You have been safely signed out.",
      });
      router.push("/login");
    },
  });

  return {
    user: sessionQuery.data ?? user,
    accessToken,
    isAuthenticated,
    isLoading: sessionQuery.isLoading || loginMutation.isPending || logoutMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    hasRole: (role: Role) => user?.role === role,
    hasPermission: (permission: string) => checkPermission(user, permission),
  };
}
