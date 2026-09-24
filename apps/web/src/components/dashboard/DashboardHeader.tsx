"use client";

import * as React from "react";
import { LogOut, Bell, Search, Menu, Command } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { formatRole } from "@/lib/utils";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const { user, logout, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="h-16 border-b border-surface-800/80 bg-surface-950/70 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-900/80 border border-surface-800/80 text-surface-400 text-xs w-64 hover:border-surface-700 transition-colors cursor-pointer">
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1">Search leads, proposals...</span>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-800 border border-surface-700 text-[10px] text-surface-300">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications, Role, User Profile */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        {user?.role && (
          <div className="hidden md:block">
            <Badge role={user.role} />
          </div>
        )}

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-900 border border-transparent hover:border-surface-800 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 shadow-glow" />
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-900/80 border border-transparent hover:border-surface-800/80 transition-all text-left"
            aria-label="Open user menu"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-400 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-surface-100 leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-surface-400 leading-tight">
                {user?.role ? formatRole(user.role) : ""}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-900 border border-surface-800/90 shadow-2xl p-2 z-50 animate-slide-up backdrop-blur-2xl">
                <div className="px-3 py-2 border-b border-surface-800/70 mb-1">
                  <p className="text-xs font-semibold text-surface-100 truncate">{user?.name}</p>
                  <p className="text-[11px] text-surface-400 truncate">{user?.email}</p>
                  <div className="mt-2 md:hidden">
                    {user?.role && <Badge role={user.role} />}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
