import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 bg-surface-950 overflow-hidden">
      {/* Background Decorative Mesh Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-mesh-pattern opacity-40 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md my-8 animate-fade-in">
        <LoginForm />
      </div>
    </main>
  );
}
