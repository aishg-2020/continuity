import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Storyboards" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="storyboards"
      description="Sequence frames and visual references for each scene and shot."
    />
  );
}
