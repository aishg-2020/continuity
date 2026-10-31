"use client";

import { useParams } from "next/navigation";
import { findProjectModule, projectHref } from "@/components/layout/nav-config";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

/** Placeholder for a project module until its phase builds the real screen. */
export function ProjectModulePlaceholder({
  slug,
  description,
}: {
  slug: string;
  description: string;
}) {
  const { projectId } = useParams<{ projectId: string }>();
  const item = findProjectModule(slug);
  if (!item) throw new Error(`Unknown project module: ${slug}`);

  return (
    <PlaceholderPage
      title={item.label}
      description={description}
      phase={item.phase}
      icon={item.icon}
      breadcrumbs={[
        { label: "Projects", href: "/projects" },
        { label: projectId, href: projectHref(projectId, "overview") },
        { label: item.label },
      ]}
    />
  );
}
