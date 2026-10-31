"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { globalNav, projectHref, projectNav, type NavItem } from "./nav-config";

function NavLink({ item, href, active }: { item: NavItem; href: string; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
      )}
    >
      <Icon
        aria-hidden
        className={cn("size-4 shrink-0", active ? "text-sidebar-primary" : "opacity-70")}
      />
      {item.label}
    </Link>
  );
}

/** Global navigation plus, inside a project, that project's modules. */
export function SidebarNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { projectId } = useParams<{ projectId?: string }>();

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <nav aria-label="Workspace" className="flex flex-col gap-0.5">
        {globalNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            href={item.href}
            active={!projectId && pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      {projectId && (
        <nav aria-label="Project" className="flex flex-col gap-0.5">
          <p className="px-3 pb-1 text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Project
          </p>
          {projectNav.map((item) => {
            const href = projectHref(projectId, item.href);
            return (
              <NavLink key={item.href} item={item} href={href} active={pathname.startsWith(href)} />
            );
          })}
        </nav>
      )}
    </div>
  );
}
