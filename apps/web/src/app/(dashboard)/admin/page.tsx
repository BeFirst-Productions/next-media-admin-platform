"use client";

import { Users, ActivitySquare, Key } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-50">Super Administrator Portal</h1>
            <p className="text-xs text-surface-400 mt-1">
              Protected route accessible exclusively by the SUPER_ADMIN role
            </p>
          </div>
          <Badge role="SUPER_ADMIN" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card glow="admin">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Staff Governance</CardTitle>
                  <CardDescription>Accounts & Role Scopes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-surface-400 leading-relaxed">
                Super Admins can provision, deactivate, and assign sales quota policies to staff members.
              </p>
            </CardContent>
          </Card>

          <Card glow="brand">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-950/60 border border-brand-500/30 text-brand-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">RBAC Matrix</CardTitle>
                  <CardDescription>21 Fine-Grained Permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-surface-400 leading-relaxed">
                Dual-layer authorization is active: Coarse-grained roles + fine-grained route permissions.
              </p>
            </CardContent>
          </Card>

          <Card glow="admin">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                  <ActivitySquare className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Audit Trail</CardTitle>
                  <CardDescription>Compliance & Security Logs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-surface-400 leading-relaxed">
                Every mutation, login attempt, and proposal state transition is recorded immutably.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
