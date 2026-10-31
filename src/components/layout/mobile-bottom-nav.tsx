"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  globalMobileNav,
  globalNav,
  projectHref,
  projectMobileNav,
  projectNav,
} from "./nav-config";

/** Bottom tab bar for phones, with large touch targets (PRD §11). */
export function MobileBottomNav() {
  const pathname = usePathname();
  const { projectId } = useParams<{ projectId?: string }>();

  const items = projectId
    ? projectNav
        .filter((item) => projectMobileNav.includes(item.href))
        .map((item) => ({ ...item, href: projectHref(projectId, item.href) }))
    : globalNav.filter((item) => globalMobileNav.includes(item.href));

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-sidebar/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[0.7rem] text-muted-foreground",
                  active && "text-primary",
                )}
              >
                <Icon aria-hidden className="size-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
