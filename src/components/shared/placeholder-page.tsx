import { Construction, type LucideIcon } from "lucide-react";
import type { Crumb } from "./breadcrumbs";
import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";

type PlaceholderPageProps = {
  title: string;
  description: string;
  phase: number;
  icon?: LucideIcon;
  breadcrumbs?: Crumb[];
};

/** Stand-in for a module that a later phase of the implementation plan builds. */
export function PlaceholderPage({
  title,
  description,
  phase,
  icon = Construction,
  breadcrumbs,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} />
      <EmptyState
        icon={icon}
        title="Coming in a later phase"
        description={
          <>
            This module is built in <strong className="text-foreground">Phase {phase}</strong> of
            the implementation plan.
          </>
        }
      />
    </div>
  );
}
