import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Files" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="files"
      description="Reference images and production documents."
    />
  );
}
