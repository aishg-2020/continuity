import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Script & Scenes" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="scenes"
      description="Organise the script into scenes with locations, characters and requirements."
    />
  );
}
