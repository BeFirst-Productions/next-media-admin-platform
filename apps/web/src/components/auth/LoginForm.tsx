"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { NextLogo } from "@/components/dashboard/NextLogo";

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

  const handleFillDemo = () => {
    setValue("email", "admin@nextdigital.crm", { shouldValidate: true });
    setValue("password", "Admin@12345", { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-sm mx-auto border-surface-800 bg-surface-900/90 shadow-xl">
      <CardHeader className="text-center pb-3 pt-6 border-b-0">
        <div className="flex justify-center mb-4">
          <NextLogo width={160} height={56} />
        </div>
        <CardTitle className="text-xl font-bold text-surface-50">
          Sign In
        </CardTitle>
        <CardDescription className="text-surface-400 text-xs mt-1">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2 pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@nextdigital.crm"
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
            size="md"
            isLoading={isLoggingIn}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs text-surface-500 hover:text-surface-300 transition-colors"
          >
            Fill demo credentials
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
