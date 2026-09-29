"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users2,
  UserPlus,
  Package,
  FileText,
  Briefcase,
  FileSignature,
  BarChart3,
  Target,
  Coins,
  CircleDollarSign,
  FileCheck,
  Clock,
  Bell,
  Settings,
  Terminal,
  Cloud,
  X,
  LogOut,
} from "lucide-react";
import { NextLogo } from "./NextLogo";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { title: "Dash board", href: "/dashboard", icon: Home },
  { title: "User Management", href: "/admin/users", icon: Users2 },
  { title: "Lead Management", href: "/leads", icon: UserPlus },
  { title: "Package & Add-ons", href: "/packages", icon: Package },
  { title: "Invoice Generator", href: "/invoices/new", icon: FileText },
  { title: "Client Management", href: "/clients", icon: Briefcase },
  { title: "Contract Managent", href: "/contracts", icon: FileSignature },
  { title: "Staff Report / Analytics", href: "/reports", icon: BarChart3 },
  { title: "Sales Target Management", href: "/targets", icon: Target },
  { title: "Commission Management", href: "/commissions", icon: Coins },
  { title: "Payment Status", href: "/payments", icon: CircleDollarSign },
  { title: "Invoice Manager", href: "/invoices", icon: FileCheck },
];

const OTHER_NAV_ITEMS: NavItem[] = [
  { title: "Activity History", href: "/activity", icon: Clock },
  { title: "Notifications", href: "/notifications", icon: Bell },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "System Logs", href: "/logs", icon: Terminal },
  { title: "Backup & Restore", href: "/backup", icon: Cloud },
];

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#081020] border-r border-[#121f38] flex flex-col transition-transform duration-300 lg:translate-x-0 select-none shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand Header */}
        <div className="pt-6 pb-4 px-5 flex flex-col items-center relative border-b border-[#111e38]/50">
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link href="/dashboard" className="transition-transform hover:scale-[1.02]">
            <NextLogo />
          </Link>

          {/* Role Pill Badge */}
          <div className="w-full mt-4">
            <div className="w-full py-2 px-3 rounded-xl bg-[#04283e] border border-[#026f9e] text-[#00c5ff] font-bold text-xs uppercase tracking-wider text-center shadow-[0_0_15px_rgba(0,197,255,0.18)]">
              SUPER ADMIN
            </div>
          </div>
        </div>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1 scrollbar-thin">
          {/* Main Navigation */}
          <div className="space-y-1">
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard" || pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`) ||
                    (item.href === "/admin/users" && (pathname === "/users" || pathname.startsWith("/users/")));

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm 2xl:text-base font-medium transition-all group",
                    isActive
                      ? "bg-gradient-to-r from-[#0092e0] to-[#00b4d8] text-white font-semibold shadow-[0_4px_16px_rgba(0,180,216,0.35)]"
                      : "text-slate-400 hover:text-slate-100 hover:bg-[#0e1a33]/60",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-[18px] h-[18px] 2xl:w-5 2xl:h-5 transition-colors shrink-0",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-200",
                    )}
                  />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </div>

          {/* OTHER Section */}
          <div className="pt-3">
            <div className="px-3 pb-1.5 text-xs 2xl:text-sm font-bold uppercase tracking-wider text-[#436496]">
              OTHER
            </div>
            <div className="space-y-1">
              {OTHER_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm 2xl:text-base font-medium transition-all group",
                      isActive
                        ? "bg-gradient-to-r from-[#0092e0] to-[#00b4d8] text-white font-semibold shadow-[0_4px_16px_rgba(0,180,216,0.35)]"
                        : "text-slate-400 hover:text-slate-100 hover:bg-[#0e1a33]/60",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] 2xl:w-5 2xl:h-5 transition-colors shrink-0",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-200",
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer: User Profile Card */}
        <div className="p-3 border-t border-[#121f38] bg-[#070d1a]">
          <div className="p-2.5 rounded-xl bg-[#0a152d]/90 border border-[#16274e] flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-500/40 shrink-0 bg-slate-800">
                {/* User Avatar */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face"
                  alt="Super Admin"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm 2xl:text-base font-bold text-white truncate leading-tight">
                  {user?.name || "Super Admin"}
                </p>
                <p className="text-xs 2xl:text-sm text-slate-400 truncate leading-tight">
                  {user?.email || "superadmin@next.com"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                  <span className="text-[11px] 2xl:text-xs text-emerald-400 font-medium">Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
