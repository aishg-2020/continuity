import { Users } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  return (
    <PlaceholderPage
      title="People"
      description="Cast and crew across all productions in this workspace."
      phase={3}
      icon={Users}
    />
  );
}
