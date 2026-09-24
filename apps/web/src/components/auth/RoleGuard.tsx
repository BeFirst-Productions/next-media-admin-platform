"use client";

import { ReactNode } from "react";
import type { Role, PermissionString } from "@next-digital-crm/shared-types";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: readonly Role[];
  requiredPermission?: PermissionString | string;
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  requiredPermission,
  fallback,
}: RoleGuardProps) {
  const { user, hasPermission } = useAuth();

  if (!user) return null;

  const roleAllowed = !allowedRoles || allowedRoles.includes(user.role);
  const permissionAllowed = !requiredPermission || hasPermission(requiredPermission);

  if (roleAllowed && permissionAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-8 flex items-center justify-center min-h-[300px]">
      <Card className="max-w-md w-full border-amber-500/30 bg-surface-900/90 text-center">
        <CardContent className="space-y-4 pt-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(245,158,11,0.25)]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-surface-100">Restricted Access</h4>
            <p className="text-xs text-surface-400">
              Your current role does not have authorization to view this module.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-xs text-surface-500">Your role:</span>
            <Badge role={user.role} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
