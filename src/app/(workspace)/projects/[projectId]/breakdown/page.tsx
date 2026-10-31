import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Breakdown" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="breakdown"
      description="Turn scenes into production requirements by department."
    />
  );
}
