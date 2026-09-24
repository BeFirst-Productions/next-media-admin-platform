"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X, Zap } from "lucide-react";
import { NAVIGATION_CONFIG } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const userRole = user?.role;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-surface-950/90 border-r border-surface-800/80 backdrop-blur-2xl flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-surface-800/80">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-surface-100 group-hover:text-brand-400 transition-colors">
                NEXT DIGITAL
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-surface-500 font-semibold">
                CRM Engine
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {NAVIGATION_CONFIG.map((section) => {
            // Filter section items by the user's role
            const visibleItems = section.items.filter((item) =>
              userRole ? item.roles.includes(userRole) : false,
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-surface-500">
                  {section.title}
                </p>
                <div className="space-y-0.5 pt-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative",
                          isActive
                            ? "bg-brand-600/15 text-brand-300 font-semibold border border-brand-500/30 shadow-glow"
                            : "text-surface-400 hover:text-surface-200 hover:bg-surface-900/60 border border-transparent",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive
                              ? "text-brand-400"
                              : "text-surface-500 group-hover:text-surface-300",
                          )}
                        />
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-800 text-surface-300 border border-surface-700">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: User Role Card & Sign Out */}
        <div className="p-4 border-t border-surface-800/80 bg-surface-950/60">
          <div className="p-3 rounded-xl bg-surface-900/60 border border-surface-800/80 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-surface-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-surface-400 uppercase tracking-wider font-mono">
                {user?.role === "SUPER_ADMIN" ? "Administrator" : "Sales Team"}
              </p>
            </div>
            <button
              onClick={() => logout()}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-surface-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
