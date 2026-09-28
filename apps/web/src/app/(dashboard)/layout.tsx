"use client";

import * as React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      {/* Sidebar (Desktop fixed / Mobile drawer) */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 w-full max-w-full overflow-x-hidden">
        <DashboardHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-2.5 sm:p-4 lg:p-5 w-full min-w-0 max-w-full overflow-x-hidden">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
