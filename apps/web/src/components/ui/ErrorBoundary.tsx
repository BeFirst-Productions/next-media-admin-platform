"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="max-w-md w-full border-rose-500/30 bg-surface-900/90 shadow-glass">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(244,63,94,0.3)]">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-surface-100">Something went wrong</h3>
                <p className="text-xs text-surface-400">
                  {this.state.error?.message || "An unexpected error occurred while rendering this component."}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full gap-2"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
