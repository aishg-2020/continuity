import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Schedule" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="schedule"
      description="Group scenes into shoot days, with conflict warnings before publishing."
    />
  );
}
