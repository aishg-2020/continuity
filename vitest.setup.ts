import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { useDevSettings } from "@/lib/data/dev-settings";
import { useDataStore } from "@/lib/data/store";

beforeEach(() => {
  // No simulated latency or failures in unit tests unless a test opts in.
  useDevSettings.setState({ latencyMs: [0, 0], failureRate: 0, demoNowOverride: null });
  useDataStore.getState().resetDemoData();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});
