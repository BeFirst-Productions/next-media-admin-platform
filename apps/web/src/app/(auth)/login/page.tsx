import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-surface-950">
      <div className="w-full max-w-sm animate-fade-in">
        <LoginForm />
      </div>
    </main>
  );
}

