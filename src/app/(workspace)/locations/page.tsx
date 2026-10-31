import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export const metadata: Metadata = { title: "Locations" };

export default function LocationsPage() {
  return (
    <PlaceholderPage
      title="Locations"
      description="Every location in this workspace, with permission status and access notes."
      phase={3}
      icon={MapPin}
    />
  );
}
