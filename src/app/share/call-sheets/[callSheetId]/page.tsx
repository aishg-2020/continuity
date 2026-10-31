import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { Wordmark } from "@/components/layout/wordmark";
import { DemoBanner } from "@/components/shared/demo-banner";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Call sheet" };

/** Read-only call-sheet view for crew without an account. Built in Phase 5. */
export default function SharedCallSheetPage() {
  return (
    <>
      <DemoBanner />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <Wordmark />
        <EmptyState
          icon={FileText}
          title="Shared call sheet"
          description="The read-only call sheet view arrives in Phase 5."
          headingLevel={1}
          className="w-full max-w-lg"
        />
      </main>
    </>
  );
}
