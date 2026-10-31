import { describe, expect, it } from "vitest";
import { DEMO_NOW, DEMO_TIMEZONE } from "@/lib/services/clock";
import { formatDate, formatDuration, formatTime, formatTimestamp } from "./date";

describe("date formatters", () => {
  it("renders UTC timestamps in the project time zone", () => {
    expect(formatTimestamp(DEMO_NOW, DEMO_TIMEZONE)).toBe("15 Nov 2026, 10:00");
  });

  it("formats calendar dates without shifting the day", () => {
    expect(formatDate("2026-11-15")).toBe("Sun, 15 Nov 2026");
  });

  it("formats wall-clock times", () => {
    expect(formatTime("07:30")).toBe("7:30 AM");
    expect(formatTime("19:05")).toBe("7:05 PM");
  });

  it.each([
    [45, "45m"],
    [60, "1h"],
    [90, "1h 30m"],
  ])("formats %i minutes as %s", (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});
