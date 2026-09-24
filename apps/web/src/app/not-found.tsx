import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-surface-800/80 bg-surface-900/90 text-center shadow-glass">
        <CardContent className="space-y-4 pt-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-950/60 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto shadow-glow">
            <FileQuestion className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-surface-50">Page Not Found</h2>
            <p className="text-xs text-surface-400">
              The module or screen you requested does not exist or may have been relocated.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="primary" size="md" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
