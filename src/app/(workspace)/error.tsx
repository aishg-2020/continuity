"use client";

import { TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function WorkspaceError({ reset }: { error: Error; reset: () => void }) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title="Something went wrong"
      description="This screen couldn't load. Your demo data is still saved in this browser."
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
