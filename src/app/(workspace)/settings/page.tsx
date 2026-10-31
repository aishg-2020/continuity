import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { WorkspaceSettings } from "./workspace-settings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Workspace details and demo data controls." />
      <WorkspaceSettings />
    </div>
  );
}
