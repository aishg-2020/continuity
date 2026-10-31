import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Locations" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="locations"
      description="Locations used by this production, with permission status and access notes."
    />
  );
}
