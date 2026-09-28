"use client";

import * as React from "react";
import {
  Menu,
  Search,
  Calendar,
  Bell,
  Moon,
  Sun,
  Maximize2,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/providers/ThemeProvider";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = React.useState(false);

  return (
    <header className="h-14 sm:h-16 bg-[#081020] border-b border-[#121f38] px-3 sm:px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 select-none w-full max-w-full">
      {/* Left: Mobile Toggle & Software Title */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1 mr-2">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#0f1d38] transition-colors shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xs sm:text-sm md:text-base font-semibold text-white tracking-tight truncate">
          Sales &amp; Client Management Software
        </h1>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
        <div className="w-full relative flex items-center bg-[#091426] border border-[#142444] rounded-lg px-3 py-1.5 transition-colors focus-within:border-[#00c5ff]/50">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search clients, leads, invoices, packages..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Right Controls: Date Range, Notifications, Dark Mode, Maximize, User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Date Range Picker */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#091426] border border-[#142444] text-xs text-slate-300 hover:border-[#1f3769] transition-colors cursor-pointer">
          <span>01 May 2026 - 31 May 2026</span>
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Notifications with Badge "12" */}
        <button
          className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0f1d38] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.6)]">
            12
          </span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0f1d38] transition-all hidden sm:flex items-center justify-center cursor-pointer active:scale-95"
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Moon className="w-4 h-4 text-slate-300 hover:text-cyan-400 transition-colors" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 hover:text-amber-600 hover:rotate-45 transition-all" />
          )}
        </button>

        {/* Maximize Icon */}
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0f1d38] transition-colors hidden sm:block"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* User Profile Pill Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-[#0f1d38] transition-all text-left"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-500/50 bg-slate-800 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face"
                alt="Super Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-200">
              {user?.name || "Super Admin"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#091426] border border-[#16274e] shadow-2xl p-1.5 z-50 animate-slide-up backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-[#142444] mb-1">
                  <p className="text-xs font-bold text-white truncate">{user?.name || "Super Admin"}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email || "superadmin@next.com"}</p>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#0f1f3d] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#0f1f3d] transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    disabled={isLoading}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
