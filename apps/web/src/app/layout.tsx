import type { Metadata } from "next";
import { type ReactNode } from "react";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Next Digital CRM — Enterprise Client & Media Operations",
  description: "Next Digital CRM & Media Engine with role-based access control, proposals, pipeline, and billing.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('next_crm_theme') || 'dark';
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.style.colorScheme = 'light';
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        <ThemeProvider>
          <QueryProvider>
            {children}
            <ToastContainer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
