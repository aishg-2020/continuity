import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { DevToolbar } from "@/components/dev/dev-toolbar";
import { DemoBanner } from "@/components/shared/demo-banner";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { SidebarNav } from "./sidebar-nav";
import { TopBar } from "./top-bar";
import { Wordmark } from "./wordmark";

/**
 * Desktop: left navigation, top context bar, main content.
 * Mobile: compact top bar and bottom navigation (PRD §11).
 *
 * The nav pieces read the current route, so each sits in its own Suspense
 * boundary: the static shell prerenders and the route-aware parts stream in.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <DemoBanner />
      <div className="flex flex-1">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
          <Link href="/home" className="flex h-14 items-center border-b px-5">
            <Wordmark />
          </Link>
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <Suspense>
              <SidebarNav />
            </Suspense>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <Suspense fallback={<div className="h-14 border-b" />}>
            <TopBar />
          </Suspense>
          <main id="main" className="flex-1 px-4 pt-6 pb-24 md:px-8 md:pt-8 md:pb-12">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
      <Suspense>
        <MobileBottomNav />
      </Suspense>
      <DevToolbar />
    </div>
  );
}
