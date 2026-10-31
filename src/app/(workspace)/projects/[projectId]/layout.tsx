import { Suspense } from "react";
import WorkspaceLoading from "../../loading";

/** Project pages read the project ID from the URL, so they stream in behind a skeleton. */
export default function ProjectLayout({ children }: LayoutProps<"/projects/[projectId]">) {
  return <Suspense fallback={<WorkspaceLoading />}>{children}</Suspense>;
}
