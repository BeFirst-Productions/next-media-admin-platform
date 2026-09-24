import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  glow?: "none" | "brand" | "admin" | "staff";
}

export function Card({ className, glass = true, glow = "none", children, ...props }: CardProps) {
  const glowClasses = {
    none: "",
    brand: "hover:shadow-glow hover:border-brand-500/40",
    admin: "hover:shadow-glow-admin hover:border-purple-500/40",
    staff: "hover:shadow-glow-staff hover:border-emerald-500/40",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        glass
          ? "bg-surface-900/60 backdrop-blur-xl border-surface-800/80 shadow-glass"
          : "bg-surface-900 border-surface-800 shadow-lg",
        glowClasses[glow],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-3 border-b border-surface-800/50", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-surface-100 tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-surface-400 mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-3 border-t border-surface-800/50 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}
