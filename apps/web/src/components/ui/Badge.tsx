import * as React from "react";
import type { Role } from "@next-digital-crm/shared-types";
import { Shield, Sparkles, ShieldCheck, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline";
  role?: Role;
}

export function Badge({ className, variant = "default", role, children, ...props }: BadgeProps) {
  if (role === "SUPER_ADMIN") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
          "bg-purple-950/70 border border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]",
          className,
        )}
        {...props}
      >
        <Shield className="w-3 h-3 text-purple-400 shrink-0" />
        {children || "Super Admin"}
      </span>
    );
  }

  if (role === "ADMIN") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
          "bg-blue-950/70 border border-blue-500/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]",
          className,
        )}
        {...props}
      >
        <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" />
        {children || "Admin"}
      </span>
    );
  }

  if (role === "SALES_STAFF") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
          "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
          className,
        )}
        {...props}
      >
        <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
        {children || "Sales Staff"}
      </span>
    );
  }

  if (role === "MARKETING_TEAM") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
          "bg-amber-950/70 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
          className,
        )}
        {...props}
      >
        <Megaphone className="w-3 h-3 text-amber-400 shrink-0" />
        {children || "Marketing"}
      </span>
    );
  }

  const variants = {
    default: "bg-brand-950/70 border border-brand-500/30 text-brand-300",
    secondary: "bg-surface-800 text-surface-300 border border-surface-700/60",
    success: "bg-emerald-950/70 border border-emerald-500/30 text-emerald-300",
    warning: "bg-amber-950/70 border border-amber-500/30 text-amber-300",
    danger: "bg-rose-950/70 border border-rose-500/30 text-rose-300",
    outline: "bg-transparent border border-surface-700 text-surface-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
