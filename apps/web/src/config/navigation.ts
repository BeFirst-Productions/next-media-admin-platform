import {
  LayoutDashboard,
  Users,
  Target,
  FileText,
  CreditCard,
  Package,
  FileCheck2,
  ShieldCheck,
  Settings,
  PieChart,
  UserCheck,
  Building2,
  BadgeDollarSign,
  ActivitySquare,
  Megaphone,
  Share2,
} from "lucide-react";
import type { NavSection } from "@/types/navigation.types";

export const NAVIGATION_CONFIG: readonly NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN", "ADMIN", "SALES_STAFF", "MARKETING_TEAM"] as const,
        description: "Personalized role cockpit & metrics",
      },
      {
        title: "Sales Targets",
        href: "/dashboard/targets",
        icon: Target,
        roles: ["SUPER_ADMIN", "ADMIN", "SALES_STAFF"] as const,
        description: "Monthly quotas & target pacing",
      },
    ],
  },
  {
    title: "Growth & Acquisition",
    items: [
      {
        title: "Marketing Campaigns",
        href: "/dashboard/marketing",
        icon: Megaphone,
        roles: ["SUPER_ADMIN", "ADMIN", "MARKETING_TEAM"] as const,
        description: "Campaign tracking, budgets, acquisition",
      },
      {
        title: "Inbound Channels",
        href: "/dashboard/channels",
        icon: Share2,
        roles: ["SUPER_ADMIN", "ADMIN", "MARKETING_TEAM"] as const,
        description: "Attribution sources & UTM campaigns",
      },
      {
        title: "Leads Management",
        href: "/dashboard/leads",
        icon: UserCheck,
        roles: ["SUPER_ADMIN", "ADMIN", "SALES_STAFF", "MARKETING_TEAM"] as const,
        description: "Inbound prospects and qualification",
      },
      {
        title: "Client Directory",
        href: "/dashboard/clients",
        icon: Building2,
        roles: ["SUPER_ADMIN", "ADMIN", "SALES_STAFF"] as const,
        description: "Accounts, brand contacts, SLA status",
      },
    ],
  },
  {
    title: "Deals & Revenue",
    items: [
      {
        title: "Proposals & Deals",
        href: "/dashboard/proposals",
        icon: FileText,
        roles: ["SUPER_ADMIN", "ADMIN", "SALES_STAFF"] as const,
        description: "Custom scopes and price quotes",
      },
      {
        title: "Master Contracts",
        href: "/dashboard/contracts",
        icon: FileCheck2,
        roles: ["SUPER_ADMIN", "ADMIN"] as const,
        description: "Executed master service agreements",
      },
      {
        title: "Invoices & Receipts",
        href: "/dashboard/invoices",
        icon: CreditCard,
        roles: ["SUPER_ADMIN", "ADMIN", "SALES_STAFF"] as const,
        description: "Billing schedules and milestone payouts",
      },
      {
        title: "Commissions",
        href: "/dashboard/commissions",
        icon: BadgeDollarSign,
        roles: ["SUPER_ADMIN", "ADMIN", "SALES_STAFF"] as const,
        description: "Earned payouts & incentive calculation",
      },
      {
        title: "Reports & Analytics",
        href: "/dashboard/reports",
        icon: PieChart,
        roles: ["SUPER_ADMIN", "ADMIN", "MARKETING_TEAM"] as const,
        description: "Revenue forecasts and profit analytics",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "User Governance",
        href: "/admin/users",
        icon: Users,
        roles: ["SUPER_ADMIN"] as const,
        description: "Staff accounts & custom permission matrix",
      },
      {
        title: "Package Catalog",
        href: "/admin/packages",
        icon: Package,
        roles: ["SUPER_ADMIN", "ADMIN"] as const,
        description: "Retainers, rate cards, and add-ons",
      },
      {
        title: "Audit & Security Logs",
        href: "/admin/audit",
        icon: ShieldCheck,
        roles: ["SUPER_ADMIN"] as const,
        description: "Immutable compliance records",
      },
      {
        title: "System Health",
        href: "/admin/system",
        icon: ActivitySquare,
        roles: ["SUPER_ADMIN"] as const,
        description: "Server latency, db pool, and backups",
      },
      {
        title: "Platform Settings",
        href: "/admin/settings",
        icon: Settings,
        roles: ["SUPER_ADMIN", "ADMIN"] as const,
        description: "Tax rates, currencies, email notifications",
      },
    ],
  },
] as const;
