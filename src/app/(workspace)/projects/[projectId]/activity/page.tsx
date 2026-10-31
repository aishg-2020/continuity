import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Activity" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="activity"
      description="A history of changes across this production."
    />
  );
}
