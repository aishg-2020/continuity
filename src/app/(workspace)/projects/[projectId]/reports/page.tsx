import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Daily Reports" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="reports"
      description="Record what happened on each shoot day."
    />
  );
}
