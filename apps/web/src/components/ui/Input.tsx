import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, leadingIcon, trailingIcon, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-surface-300 tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-surface-400">
              {leadingIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full h-11 px-3.5 bg-surface-900/60 border rounded-xl text-surface-100 placeholder:text-surface-500 text-sm transition-all duration-200 backdrop-blur-sm",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leadingIcon ? "pl-11" : "",
              trailingIcon ? "pr-11" : "",
              error ? "border-rose-500 focus:ring-rose-500/40 focus:border-rose-500" : "border-surface-700/60 hover:border-surface-600",
              className,
            )}
            {...props}
          />
          {trailingIcon && (
            <div className="absolute right-3.5 flex items-center text-surface-400">
              {trailingIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-400 font-medium pl-1">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-surface-400 pl-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
