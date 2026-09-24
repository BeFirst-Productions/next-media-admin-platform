"use client";

import * as React from "react";
import {
  Users,
  TrendingUp,
  FileText,
  CreditCard,
  Plus,
  Sparkles,
  ArrowUpRight,
  Database,
  Lock,
  KeyRound,
  CheckCircle2,
  Megaphone,
  Share2,
  BarChart3,
  SlidersHorizontal,
  Clock,
  Briefcase,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function BlankDashboard() {
  const { user } = useAuth();
  const role = user?.role || "SALES_STAFF";

  switch (role) {
    case "SUPER_ADMIN":
      return <SuperAdminDashboard user={user} />;
    case "ADMIN":
      return <AdminDashboard user={user} />;
    case "SALES_STAFF":
      return <SalesStaffDashboard user={user} />;
    case "MARKETING_TEAM":
      return <MarketingDashboard user={user} />;
    default:
      return <SalesStaffDashboard user={user} />;
  }
}

// ============================================================================
// 1. SUPER ADMIN: TOTAL CONTROLLER DASHBOARD
// ============================================================================
function SuperAdminDashboard({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  const [showRbac, setShowRbac] = React.useState(false);
  const [selectedStaffPerspective, setSelectedStaffPerspective] = React.useState<string>("ALL");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 border border-purple-500/30 bg-gradient-to-br from-surface-950 via-purple-950/20 to-surface-950 shadow-glass">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-surface-50">
                Command Center — {user?.name}
              </h1>
              <Badge role="SUPER_ADMIN" />
            </div>
            <p className="text-sm text-surface-400 max-w-2xl leading-relaxed">
              Super Admin total controller mode: Full unrestricted authority across all modules,
              cross-user data inspection, and system-wide telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRbac(!showRbac)}
              className="gap-2 text-xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {showRbac ? "Hide RBAC" : "Universal Authority"}
            </Button>

            <Link href="/admin/users">
              <Button size="sm" className="gap-2 text-xs shadow-glow">
                <Users className="w-3.5 h-3.5" />
                Manage Staff
              </Button>
            </Link>
          </div>
        </div>

        {/* Super Admin Individual User Data Inspector Selector */}
        <div className="mt-6 pt-6 border-t border-surface-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-xs font-semibold text-surface-200 uppercase tracking-wider">
              Super Admin Data Inspector:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-surface-500 mr-1">Inspect Perspective:</span>
            {[
              { id: "ALL", label: "Organization View" },
              { id: "STAFF_ANAZ", label: "Anaz (Sales)" },
              { id: "ADMIN_SARAH", label: "Sarah (Ops)" },
              { id: "MARKET_ELENA", label: "Elena (Marketing)" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedStaffPerspective(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedStaffPerspective === p.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-surface-900 text-surface-400 hover:text-surface-200 border border-surface-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {showRbac && (
          <div className="mt-4 pt-4 border-t border-surface-800/80 animate-slide-up space-y-2">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Universal Override Status: Wildcard (*) Active
            </span>
            <p className="text-xs text-surface-400">
              Super Admin has universal bypass. Every action (create, edit, delete, list, approve, export) in every CRM module is unconditionally authorized.
            </p>
          </div>
        )}
      </div>

      {/* Super Admin Global KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pipeline Volume"
          value="$148,500"
          subtitle={selectedStaffPerspective === "ALL" ? "Across all sales staff" : "Filtered for selected staff"}
          icon={TrendingUp}
          color="text-purple-400"
        />
        <StatCard
          title="Active Staff Accounts"
          value="4 Members"
          subtitle="Admin, Sales & Marketing"
          icon={Users}
          color="text-brand-400"
        />
        <StatCard
          title="Security Engine"
          value="Enforced"
          subtitle="4-tier RBAC + JWT Cookies"
          icon={Lock}
          color="text-purple-400"
        />
        <StatCard
          title="Prisma Database"
          value="PostgreSQL"
          subtitle="Schema Synced & Active"
          icon={Database}
          color="text-brand-400"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full border-surface-800/80 bg-surface-900/60 shadow-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Organization Performance & Governance</CardTitle>
                  <CardDescription>
                    {selectedStaffPerspective === "ALL"
                      ? "Global company metrics and cross-module operational activity"
                      : `Drill-down view of individual user activity (${selectedStaffPerspective})`}
                  </CardDescription>
                </div>
                <Badge role="SUPER_ADMIN" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-950/60 border border-surface-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-surface-200">Company Revenue Target (Q3)</span>
                  <span className="text-emerald-400 font-mono">$84,000 / $120,000 (70%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[70%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-surface-950/50 border border-surface-800">
                  <span className="text-[11px] text-surface-400">Total Inbound Leads</span>
                  <p className="text-lg font-bold text-surface-100 mt-1">28 Qualified</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-950/50 border border-surface-800">
                  <span className="text-[11px] text-surface-400">Proposals Awaiting Approval</span>
                  <p className="text-lg font-bold text-amber-400 mt-1">3 Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-surface-800/80 bg-surface-900/60 shadow-glass">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Super Admin Quick Access</CardTitle>
              <CardDescription>Privileged governance actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <QuickLink title="Manage Staff & Action Permissions" href="/admin/users" badge="RBAC" />
              <QuickLink title="Digital Media Package Catalog" href="/admin/packages" badge="Pricing" />
              <QuickLink title="Compliance Audit Trail" href="/admin/audit" badge="Security" />
              <QuickLink title="Platform Settings & Keys" href="/admin/settings" badge="Config" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. OPERATIONS ADMIN DASHBOARD
// ============================================================================
function AdminDashboard({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-3xl p-6 lg:p-8 border border-blue-500/30 bg-gradient-to-br from-surface-950 via-blue-950/20 to-surface-950 shadow-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-surface-50">
                Operations Portal — {user?.name}
              </h1>
              <Badge role="ADMIN" />
            </div>
            <p className="text-sm text-surface-400 max-w-2xl leading-relaxed">
              Operational oversight: Manage proposals, approvals, billing workflows, and client directory.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Approvals" value="3 Deals" subtitle="Awaiting review" icon={FileText} color="text-blue-400" />
        <StatCard title="Active Retainers" value="12 Clients" subtitle="SLA active" icon={Briefcase} color="text-brand-400" />
        <StatCard title="Invoices Due" value="$22,400" subtitle="Due this week" icon={CreditCard} color="text-amber-400" />
        <StatCard title="Team Pacing" value="92% SLA" subtitle="Operations on track" icon={Clock} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full border-surface-800/80 bg-surface-900/60 shadow-glass">
            <CardHeader>
              <CardTitle>Operational Queues</CardTitle>
              <CardDescription>Items requiring operations sign-off</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-surface-100">All Operations Queues Cleared</h4>
              <p className="text-xs text-surface-400 max-w-xs">
                No contracts or proposals currently pending operations sign-off.
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="border-surface-800/80 bg-surface-900/60 shadow-glass">
            <CardHeader>
              <CardTitle className="text-sm">Operations Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <QuickLink title="Review Proposals" href="/dashboard/proposals" badge="Deals" />
              <QuickLink title="Manage Invoices" href="/dashboard/invoices" badge="Billing" />
              <QuickLink title="Client Accounts" href="/dashboard/clients" badge="Directory" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. SALES STAFF: PERSONAL SALES COCKPIT (DATA ISOLATED)
// ============================================================================
function SalesStaffDashboard({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-3xl p-6 lg:p-8 border border-emerald-500/30 bg-gradient-to-br from-surface-950 via-emerald-950/20 to-surface-950 shadow-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-surface-50">
                Sales Cockpit — {user?.name}
              </h1>
              <Badge role="SALES_STAFF" />
            </div>
            <p className="text-sm text-surface-400 max-w-2xl leading-relaxed">
              Personal sales pipeline and targets. All metrics and deals are strictly scoped to your individual account.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button size="sm" className="gap-2 text-xs shadow-glow-staff bg-emerald-600 hover:bg-emerald-500">
              <Plus className="w-3.5 h-3.5" />
              New Deal
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Active Pipeline" value="$34,000" subtitle="Your assigned deals" icon={Briefcase} color="text-emerald-400" />
        <StatCard title="My Inbound Leads" value="6 Prospects" subtitle="Assigned to you" icon={Users} color="text-brand-400" />
        <StatCard title="Earned Commission" value="$1,850.00" subtitle="Current pay cycle" icon={CreditCard} color="text-emerald-400" />
        <StatCard title="Monthly Quota" value="68% Pacing" subtitle="Target: $50k" icon={Target} color="text-brand-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full border-surface-800/80 bg-surface-900/60 shadow-glass">
            <CardHeader>
              <CardTitle>My Deals Pipeline</CardTitle>
              <CardDescription>Your personal prospects moving through stages</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-surface-100">Your Sales Workspace is Live</h4>
              <p className="text-xs text-surface-400 max-w-xs">
                As you qualify leads and submit custom package proposals, your deal flow will display here.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-surface-800/80 bg-surface-900/60 shadow-glass">
            <CardHeader>
              <CardTitle className="text-sm">Sales Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <QuickLink title="View My Leads" href="/dashboard/leads" badge="Mine" />
              <QuickLink title="Create Proposal Quote" href="/dashboard/proposals" badge="Quote" />
              <QuickLink title="My Commissions Tracker" href="/dashboard/commissions" badge="Earnings" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MARKETING TEAM: CAMPAIGN & INBOUND HUB
// ============================================================================
function MarketingDashboard({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-3xl p-6 lg:p-8 border border-amber-500/30 bg-gradient-to-br from-surface-950 via-amber-950/20 to-surface-950 shadow-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-surface-50">
                Marketing Growth Hub — {user?.name}
              </h1>
              <Badge role="MARKETING_TEAM" />
            </div>
            <p className="text-sm text-surface-400 max-w-2xl leading-relaxed">
              Inbound lead acquisition, paid campaign attribution, conversion analytics, and brand reach.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button size="sm" className="gap-2 text-xs shadow-sm bg-amber-600 hover:bg-amber-500 text-white">
              <Megaphone className="w-3.5 h-3.5" />
              New Campaign
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Inbound Leads Generated" value="42 Leads" subtitle="This month" icon={Share2} color="text-amber-400" />
        <StatCard title="Active Ad Campaigns" value="5 Live" subtitle="Google & Meta Ads" icon={Megaphone} color="text-brand-400" />
        <StatCard title="Lead Conversion Rate" value="18.4%" subtitle="+2.1% from last month" icon={BarChart3} color="text-emerald-400" />
        <StatCard title="Cost Per Lead (CPL)" value="$38.50" subtitle="Budget: On Target" icon={Target} color="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full border-surface-800/80 bg-surface-900/60 shadow-glass">
            <CardHeader>
              <CardTitle>Inbound Acquisition Channels</CardTitle>
              <CardDescription>Lead attribution and channel performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {[
                { channel: "Google Search (High Intent)", leads: 18, share: "43%", roi: "4.2x" },
                { channel: "LinkedIn B2B Retargeting", leads: 14, share: "33%", roi: "3.8x" },
                { channel: "Direct Brand Referral", leads: 10, share: "24%", roi: "N/A" },
              ].map((c) => (
                <div key={c.channel} className="p-3 rounded-xl bg-surface-950 border border-surface-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-surface-200">{c.channel}</span>
                    <p className="text-[11px] text-surface-500">Attribution share: {c.share}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-400">{c.leads} Leads</span>
                    <p className="text-[10px] text-surface-400 font-mono">ROI: {c.roi}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-surface-800/80 bg-surface-900/60 shadow-glass">
            <CardHeader>
              <CardTitle className="text-sm">Marketing Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <QuickLink title="Manage Inbound Leads" href="/dashboard/leads" badge="Leads" />
              <QuickLink title="Campaign Performance" href="/dashboard/reports" badge="Analytics" />
              <QuickLink title="Digital Retainer Catalog" href="/dashboard/packages" badge="Services" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Reusable Helper Components
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "text-brand-400",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <Card className="p-5 border-surface-800/80 bg-surface-900/60 shadow-glass">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-surface-400">{title}</span>
        <div className="p-2 rounded-xl bg-surface-950 border border-surface-800">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xl font-bold text-surface-50 tracking-tight">{value}</p>
        <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>
      </div>
    </Card>
  );
}

function QuickLink({ title, href, badge }: { title: string; href: string; badge?: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-800/60 border border-transparent hover:border-surface-700/60 transition-all text-xs text-surface-300 hover:text-surface-100 group"
    >
      <span className="font-medium truncate">{title}</span>
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-800 text-surface-400 border border-surface-700">
            {badge}
          </span>
        )}
        <ArrowUpRight className="w-3.5 h-3.5 text-surface-500 group-hover:text-brand-400 transition-colors" />
      </div>
    </a>
  );
}
