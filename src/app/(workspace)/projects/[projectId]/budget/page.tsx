import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Budget" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="budget"
      description="Planned, actual and paid amounts by category."
    />
  );
}
