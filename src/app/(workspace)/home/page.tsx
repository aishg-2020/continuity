import { Home } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <PlaceholderPage
      title="Home"
      description="Your workspace at a glance: active productions, upcoming shoot days and recent updates."
      phase={2}
      icon={Home}
    />
  );
}
