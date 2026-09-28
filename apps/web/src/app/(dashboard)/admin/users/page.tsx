"use client";

import * as React from "react";
import { Users, UserPlus, Shield, Sparkles, Megaphone, ShieldCheck, Search, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import type { UserDto } from "@next-digital-crm/shared-types";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CreateUserModal } from "@/components/admin/CreateUserModal";
import { ROLE_DEFAULT_TEMPLATES } from "@/config/permissions";
import { apiClient } from "@/lib/api-client";

// Seeded / fallback user accounts for all 4 roles
const DEFAULT_USERS: UserDto[] = [
  {
    id: "usr-super-admin-01",
    employeeId: "USR-1001",
    name: "Super Admin",
    email: "admin@next.com",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    permissions: [...ROLE_DEFAULT_TEMPLATES.SUPER_ADMIN],
    settings: { theme: "dark", roleView: "total_controller" },
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "usr-admin-02",
    employeeId: "USR-1002",
    name: "Sarah (Operations Admin)",
    email: "admin.ops@nextdigital.crm",
    role: "ADMIN",
    status: "ACTIVE",
    permissions: [...ROLE_DEFAULT_TEMPLATES.ADMIN],
    settings: { theme: "dark", roleView: "operations_overview" },
    createdAt: "2026-09-05T09:30:00Z",
  },
  {
    id: "usr-sales-03",
    employeeId: "USR-1003",
    name: "Anaz (Sales Staff)",
    email: "staff@nextdigital.crm",
    role: "SALES_STAFF",
    status: "ACTIVE",
    permissions: [...ROLE_DEFAULT_TEMPLATES.SALES_STAFF],
    settings: { theme: "dark", roleView: "personal_sales_cockpit" },
    createdAt: "2026-09-10T11:15:00Z",
  },
  {
    id: "usr-marketing-04",
    employeeId: "USR-1004",
    name: "Elena (Marketing Lead)",
    email: "marketing@nextdigital.crm",
    role: "MARKETING_TEAM",
    status: "ACTIVE",
    permissions: [...ROLE_DEFAULT_TEMPLATES.MARKETING_TEAM],
    settings: { theme: "dark", roleView: "marketing_growth_hub" },
    createdAt: "2026-09-12T14:20:00Z",
  },
];

export default function UsersManagementPage() {
  const [users, setUsers] = React.useState<UserDto[]>(DEFAULT_USERS);
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [selectedUserForInspect, setSelectedUserForInspect] = React.useState<UserDto | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await apiClient<UserDto[]>("/users");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setUsers(res.data);
      }
    } catch {
      // Use seeded fallback list if backend database is offline
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <div className="space-y-8 animate-fade-in">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-surface-50 flex items-center gap-2.5">
              <Users className="w-6 h-6 text-brand-400" />
              User Governance & Permissions
            </h1>
            <p className="text-xs text-surface-400 mt-1">
              Super Admin total controller: Provision accounts and customize module-action permissions per person
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 shrink-0 shadow-glow"
          >
            <UserPlus className="w-4 h-4" />
            Provision New User
          </Button>
        </div>

        {/* Role Statistics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox
            label="Super Admin"
            count={users.filter((u) => u.role === "SUPER_ADMIN").length}
            icon={Shield}
            color="text-purple-400"
            border="border-purple-500/30"
          />
          <StatBox
            label="Operations Admin"
            count={users.filter((u) => u.role === "ADMIN").length}
            icon={ShieldCheck}
            color="text-blue-400"
            border="border-blue-500/30"
          />
          <StatBox
            label="Sales Staff"
            count={users.filter((u) => u.role === "SALES_STAFF").length}
            icon={Sparkles}
            color="text-emerald-400"
            border="border-emerald-500/30"
          />
          <StatBox
            label="Marketing Team"
            count={users.filter((u) => u.role === "MARKETING_TEAM").length}
            icon={Megaphone}
            color="text-amber-400"
            border="border-amber-500/30"
          />
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-surface-900/60 border border-surface-800/80 shadow-glass">
          <div className="flex items-center gap-2 w-full sm:w-72 px-3 py-1.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-surface-300">
            <Search className="w-4 h-4 text-surface-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full placeholder:text-surface-600"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { id: "ALL", label: "All Roles" },
                { id: "SUPER_ADMIN", label: "Super Admin" },
                { id: "ADMIN", label: "Admin" },
                { id: "SALES_STAFF", label: "Sales Staff" },
                { id: "MARKETING_TEAM", label: "Marketing" },
              ] as const
            ).map((rf) => (
              <button
                key={rf.id}
                onClick={() => setRoleFilter(rf.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${roleFilter === rf.id
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-surface-800/60 text-surface-400 hover:text-surface-200"
                  }`}
              >
                {rf.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Directory Table */}
        <Card className="border-surface-800/80 bg-surface-900/60 shadow-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-surface-800/80 bg-surface-950/60 text-[11px] uppercase tracking-wider text-surface-400 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Permissions Active</th>
                  <th className="py-3.5 px-4">Account Settings</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/50">
                {filteredUsers.map((u) => {
                  const permsCount = u.permissions?.length ?? 0;
                  const isSuper = u.role === "SUPER_ADMIN";

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-surface-800/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedUserForInspect(u)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-surface-100">{u.name}</div>
                        <div className="text-surface-400 text-[11px] font-mono">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge role={u.role} />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${isSuper
                                ? "bg-purple-950 border border-purple-500/40 text-purple-300"
                                : "bg-surface-950 border border-surface-800 text-surface-300"
                              }`}
                          >
                            {isSuper ? "Wildcard (*)" : `${permsCount} actions`}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-surface-400">
                        <span className="font-mono text-[11px] text-surface-400">
                          {u.settings ? "Personalized" : "Default"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {u.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[11px] h-7 px-2.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUserForInspect(u);
                          }}
                        >
                          <SlidersHorizontal className="w-3 h-3 mr-1" />
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Selected User RBAC Details Inspector Drawer/Modal */}
        {selectedUserForInspect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-md animate-fade-in">
            <Card className="max-w-xl w-full max-h-[85vh] flex flex-col border-surface-800 bg-surface-900 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {selectedUserForInspect.name}
                    <Badge role={selectedUserForInspect.role} />
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {selectedUserForInspect.email} • ID: {selectedUserForInspect.id}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUserForInspect(null)}
                >
                  Close
                </Button>
              </CardHeader>
              <CardContent className="overflow-y-auto space-y-4 pt-2">
                <div className="p-3 rounded-xl bg-surface-950/60 border border-surface-800 text-xs space-y-1">
                  <span className="font-semibold text-surface-300 uppercase tracking-wide text-[10px]">
                    Authority Status:
                  </span>
                  <p className="text-surface-400">
                    {selectedUserForInspect.role === "SUPER_ADMIN"
                      ? "Super Admin total authority: Every API route and client module is completely authorized."
                      : "Scoped RBAC: Can only perform approved module actions and strictly accesses their own assigned data."}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-surface-200 uppercase tracking-wider">
                    Assigned Action Permissions ({selectedUserForInspect.permissions?.length ?? 0}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto pr-1">
                    {selectedUserForInspect.permissions?.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-surface-950 border border-surface-800 text-surface-300"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchUsers()}
        />
      </div>
    </RoleGuard>
  );
}

function StatBox({
  label,
  count,
  icon: Icon,
  color,
  border,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
  border: string;
}) {
  return (
    <div className={`p-4 rounded-2xl bg-surface-900/60 border ${border} shadow-glass`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-surface-400">{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-xl font-bold text-surface-50 mt-2">{count} Staff</p>
    </div>
  );
}
