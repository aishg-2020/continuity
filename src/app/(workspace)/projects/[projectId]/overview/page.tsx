import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="overview"
      description="The production command centre: status, schedule, budget and recent activity."
    />
  );
}
