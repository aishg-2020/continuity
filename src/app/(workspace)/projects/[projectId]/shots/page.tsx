import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Shot Lists" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="shots"
      description="Plan every shot by scene, with size, angle, movement and status."
    />
  );
}
