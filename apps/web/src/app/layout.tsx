import type { Metadata } from "next";
import { type ReactNode } from "react";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Next Digital CRM — Enterprise Client & Media Operations",
  description: "Next Digital CRM & Media Engine with role-based access control, proposals, pipeline, and billing.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-950 text-surface-50 antialiased selection:bg-brand-500 selection:text-white">
        <QueryProvider>
          {children}
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
