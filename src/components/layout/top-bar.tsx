"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ContrastToggle } from "./contrast-toggle";
import { Wordmark } from "./wordmark";
import { SidebarNav } from "./sidebar-nav";

/** Top context bar: keeps the active project visible (PRD §7). */
export function TopBar() {
  const { projectId } = useParams<{ projectId?: string }>();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-6">
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu aria-hidden />
              <span className="sr-only">Open navigation</span>
            </Button>
          }
        />
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetHeader className="border-b px-4 py-4">
            <SheetTitle>
              <Wordmark />
            </SheetTitle>
          </SheetHeader>
          {/* Closing on click lets navigation inside the sheet dismiss it. */}
          <div className="overflow-y-auto px-2 pb-6" onClick={() => setMenuOpen(false)}>
            <SidebarNav />
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/home" className="md:hidden">
        <Wordmark />
      </Link>

      <div className="hidden min-w-0 items-center gap-2 text-sm md:flex">
        {projectId ? (
          <>
            <span className="text-muted-foreground">Project</span>
            <span className="truncate font-medium">{projectId}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Continuity Demo Studio</span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ContrastToggle />
      </div>
    </header>
  );
}
