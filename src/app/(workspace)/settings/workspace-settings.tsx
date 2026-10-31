"use client";

import { ResetDemoDataButton } from "@/components/shared/reset-demo-data-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataStore } from "@/lib/data/store";
import { useHydrated } from "@/lib/data/use-hydrated";

export function WorkspaceSettings() {
  const hydrated = useHydrated();
  const workspace = useDataStore((state) => Object.values(state.tables.workspaces)[0]);
  const memberCount = useDataStore((state) => Object.keys(state.tables.workspaceMembers).length);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Member management arrives in Phase 2.</CardDescription>
        </CardHeader>
        <CardContent>
          {hydrated && workspace ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Name</dt>
              <dd>{workspace.name}</dd>
              <dt className="text-muted-foreground">Members</dt>
              <dd>{memberCount}</dd>
            </dl>
          ) : (
            <div className="space-y-2" aria-busy="true">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo data</CardTitle>
          <CardDescription>
            Everything in Continuity is sample data stored only in this browser. Nothing is sent to
            a server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetDemoDataButton />
        </CardContent>
      </Card>
    </div>
  );
}
