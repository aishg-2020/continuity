import { useDevSettings } from "@/lib/data/dev-settings";

/**
 * Fixed "today" for the demo: 15 Nov 2026, 10:00 IST.
 * Every countdown, "next shoot day" and overdue state is computed from this,
 * so the demo looks the same for every viewer and every test run.
 */
export const DEMO_NOW = "2026-11-15T04:30:00.000Z";
export const DEMO_TIMEZONE = "Asia/Kolkata";

export const clock = {
  now(): Date {
    return new Date(useDevSettings.getState().demoNowOverride ?? DEMO_NOW);
  },
  nowIso(): string {
    return clock.now().toISOString();
  },
};
