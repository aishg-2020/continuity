import { Film } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <EmptyState
        icon={Film}
        title="This scene isn't in the script"
        description="The page you're looking for doesn't exist."
        action={
          <Link href="/home" className={buttonVariants()}>
            Back to workspace
          </Link>
        }
        headingLevel={1}
        className="w-full max-w-lg"
      />
    </main>
  );
}
