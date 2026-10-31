import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
};

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}
