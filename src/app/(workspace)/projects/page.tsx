import { Clapperboard } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      title="Projects"
      description="Every production in this workspace, with status, dates and budget."
      phase={2}
      icon={Clapperboard}
    />
  );
}
