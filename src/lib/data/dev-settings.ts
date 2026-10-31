import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Tuning knobs for the mock data layer. Adjustable from the dev toolbar. */
type DevSettings = {
  /** Simulated network latency range in ms, `[min, max]`. */
  latencyMs: [number, number];
  /** Probability (0–1) that a mock request fails, to exercise error states. */
  failureRate: number;
  /** Overrides the fixed demo date (ISO timestamp), or `null` for the default. */
  demoNowOverride: string | null;
  setLatency: (range: [number, number]) => void;
  setFailureRate: (rate: number) => void;
  setDemoNowOverride: (iso: string | null) => void;
};

export const DEFAULT_LATENCY_MS: [number, number] = [150, 400];

export const useDevSettings = create<DevSettings>()(
  persist(
    (set) => ({
      latencyMs: DEFAULT_LATENCY_MS,
      failureRate: 0,
      demoNowOverride: null,
      setLatency: (latencyMs) => set({ latencyMs }),
      setFailureRate: (failureRate) => set({ failureRate: Math.min(1, Math.max(0, failureRate)) }),
      setDemoNowOverride: (demoNowOverride) => set({ demoNowOverride }),
    }),
    {
      name: "continuity-dev-settings",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
