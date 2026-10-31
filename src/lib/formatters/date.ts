import { TZDate } from "@date-fns/tz";
import { format, parse } from "date-fns";

/** Formats a UTC timestamp in the given time zone, e.g. `15 Nov 2026, 10:00`. */
export function formatTimestamp(iso: string, timeZone: string, pattern = "d MMM yyyy, HH:mm") {
  return format(new TZDate(iso, timeZone), pattern);
}

/** Formats a `YYYY-MM-DD` calendar date, e.g. `Sun, 15 Nov 2026`. */
export function formatDate(date: string, pattern = "EEE, d MMM yyyy") {
  return format(parse(date, "yyyy-MM-dd", new Date(2000, 0, 1)), pattern);
}

/** Formats an `HH:MM` wall-clock time, e.g. `07:30` → `7:30 AM`. */
export function formatTime(time: string) {
  return format(parse(time, "HH:mm", new Date(2000, 0, 1)), "h:mm a");
}

/** Formats a duration in minutes, e.g. `90` → `1h 30m`. */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
