import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/layout/wordmark";
import { DemoBanner } from "@/components/shared/demo-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Demo sign-in" };

export default function DemoLoginPage() {
  return (
    <>
      <DemoBanner />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <Wordmark />
        <EmptyState
          icon={UserRound}
          title="Choose a demo role"
          description="The role picker arrives in Phase 2. For now, continue as the demo producer."
          action={
            <Link href="/home" className={buttonVariants()}>
              Continue to workspace
            </Link>
          }
          headingLevel={1}
          className="w-full max-w-lg"
        />
      </main>
    </>
  );
}
