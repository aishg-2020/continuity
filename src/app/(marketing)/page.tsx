import Link from "next/link";
import { Wordmark } from "@/components/layout/wordmark";
import { DemoBanner } from "@/components/shared/demo-banner";
import { buttonVariants } from "@/components/ui/button";

// Holding page. The cinematic landing page replaces this in Phase 1.
export default function LandingPage() {
  return (
    <>
      <DemoBanner />
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <Wordmark />
        <h1 className="max-w-3xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
          Every scene, every call time, <em className="text-primary">one workspace.</em>
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Production planning and shoot-day coordination for independent filmmakers.
        </p>
        <Link href="/demo-login" className={buttonVariants({ size: "lg" })}>
          Enter the demo
        </Link>
      </main>
    </>
  );
}
