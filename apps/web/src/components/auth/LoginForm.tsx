"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
    } catch {
      // Error is caught and surfaced via toast in useAuth
    }
  };

  const fillDemoAccount = (role: "super_admin" | "admin" | "staff" | "marketing") => {
    switch (role) {
      case "super_admin":
        setValue("email", "admin@nextdigital.crm", { shouldValidate: true });
        setValue("password", "Admin@12345", { shouldValidate: true });
        break;
      case "admin":
        setValue("email", "admin.ops@nextdigital.crm", { shouldValidate: true });
        setValue("password", "Admin@12345", { shouldValidate: true });
        break;
      case "staff":
        setValue("email", "staff@nextdigital.crm", { shouldValidate: true });
        setValue("password", "Staff@12345", { shouldValidate: true });
        break;
      case "marketing":
        setValue("email", "marketing@nextdigital.crm", { shouldValidate: true });
        setValue("password", "Market@12345", { shouldValidate: true });
        break;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-surface-800/80 bg-surface-900/80 shadow-2xl backdrop-blur-2xl">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-3 shadow-glow">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-surface-50 via-surface-200 to-surface-400 bg-clip-text text-transparent">
          Welcome to Next CRM
        </CardTitle>
        <CardDescription className="text-surface-400 text-sm mt-1">
          Enter your credentials to access your digital media workspace
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {/* Quick Demo Credentials Bar for all 4 Enterprise Roles */}
        <div className="p-3 rounded-xl bg-surface-950/60 border border-surface-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-surface-400 uppercase">
              Quick Test Accounts (4 Roles)
            </span>
            <span className="text-[10px] text-surface-500">Auto-fill & test</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("super_admin")}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin")}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/30 text-blue-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin (Ops)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("staff")}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sales Staff
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("marketing")}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/30 text-amber-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Marketing
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Work Email"
            type="email"
            placeholder="name@nextdigital.crm"
            autoComplete="email"
            leadingIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            autoComplete="current-password"
            leadingIcon={<Lock className="w-4 h-4" />}
            trailingIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-surface-200 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            size="lg"
            isLoading={isLoggingIn}
            className="w-full mt-2 group"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-surface-500">
          Role-Based Access Control (RBAC) • AES-256 JWT Authentication
        </div>
      </CardContent>
    </Card>
  );
}
