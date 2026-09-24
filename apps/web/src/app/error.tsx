"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Router Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-rose-500/30 bg-surface-900/90 text-center shadow-glass">
        <CardContent className="space-y-4 pt-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(244,63,94,0.3)]">
            <AlertOctagon className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-surface-50">Application Error</h2>
            <p className="text-xs text-surface-400">
              {error.message || "An unexpected error occurred while executing this route."}
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => reset()}
              className="w-full gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset & Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
