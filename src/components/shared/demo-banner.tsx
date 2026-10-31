import { FlaskConical } from "lucide-react";

/** Always-visible disclosure that everything on screen is sample data (PRD §10). */
export function DemoBanner() {
  return (
    <div
      role="note"
      className="flex items-center justify-center gap-2 border-b border-status-warning/25 bg-status-warning/10 px-4 py-1.5 text-center text-xs text-status-warning"
    >
      <FlaskConical aria-hidden className="size-3.5 shrink-0" />
      <span>
        <strong className="font-semibold">Demo</strong>: sample data, stored only in this browser.
      </span>
    </div>
  );
}
