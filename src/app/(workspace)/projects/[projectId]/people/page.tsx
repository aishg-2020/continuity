import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Cast & Crew" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="people"
      description="Everyone on this production, with roles, departments and confirmations."
    />
  );
}
