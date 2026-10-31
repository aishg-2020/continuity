import type { Metadata } from "next";
import { ProjectModulePlaceholder } from "@/components/projects/project-module-placeholder";

export const metadata: Metadata = { title: "Call Sheets" };

export default function Page() {
  return (
    <ProjectModulePlaceholder
      slug="call-sheets"
      description="Generate, preview and publish call sheets from shoot days."
    />
  );
}
