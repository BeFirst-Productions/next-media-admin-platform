"use client";

import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore, type ToastType } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const toastStyles: Record<ToastType, { icon: typeof CheckCircle2; border: string; bg: string; iconColor: string }> = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-500/40",
    bg: "bg-surface-900/90 text-surface-50 shadow-glow-staff",
    iconColor: "text-emerald-400",
  },
  error: {
    icon: AlertCircle,
    border: "border-rose-500/40",
    bg: "bg-surface-900/90 text-surface-50 shadow-[0_0_20px_-4px_rgba(244,63,94,0.35)]",
    iconColor: "text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-500/40",
    bg: "bg-surface-900/90 text-surface-50 shadow-[0_0_20px_-4px_rgba(245,158,11,0.35)]",
    iconColor: "text-amber-400",
  },
  info: {
    icon: Info,
    border: "border-brand-500/40",
    bg: "bg-surface-900/90 text-surface-50 shadow-glow",
    iconColor: "text-brand-400",
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((t) => {
        const style = toastStyles[t.type];
        const Icon = style.icon;

        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 animate-slide-up shadow-glass",
              style.bg,
              style.border,
            )}
          >
            <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", style.iconColor)} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight">{t.title}</h4>
              {t.description && (
                <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-surface-400 hover:text-surface-200 transition-colors p-1 -mr-1 -mt-1 rounded-lg hover:bg-surface-800"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
}
