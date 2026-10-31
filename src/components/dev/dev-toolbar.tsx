"use client";

import { Wrench, X } from "lucide-react";
import { useState } from "react";
import { ResetDemoDataButton } from "@/components/shared/reset-demo-data-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_LATENCY_MS, useDevSettings } from "@/lib/data/dev-settings";
import { DEMO_NOW } from "@/lib/services/clock";

const ENABLED =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEV_TOOLBAR === "1";

const FAILURE_RATES = [0, 0.1, 0.5, 1];

/** Developer controls for the mock layer: latency, failures, demo date, reset. */
export function DevToolbar() {
  const [open, setOpen] = useState(false);
  const settings = useDevSettings();

  if (!ENABLED) return null;

  const demoDate = (settings.demoNowOverride ?? DEMO_NOW).slice(0, 10);

  return (
    <div className="fixed right-4 bottom-20 z-50 md:bottom-4">
      {open ? (
        <section
          aria-label="Developer toolbar"
          className="w-72 space-y-4 rounded-xl border bg-popover p-4 text-sm shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Mock data controls</h2>
            <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
              <X aria-hidden />
              <span className="sr-only">Close developer toolbar</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(["Min", "Max"] as const).map((label, index) => (
              <div key={label} className="space-y-1">
                <Label htmlFor={`latency-${label}`}>{label} latency (ms)</Label>
                <Input
                  id={`latency-${label}`}
                  type="number"
                  min={0}
                  step={50}
                  value={settings.latencyMs[index]}
                  onChange={(event) => {
                    const next = [...settings.latencyMs] as [number, number];
                    next[index] = Math.max(0, Number(event.target.value) || 0);
                    settings.setLatency(next);
                  }}
                />
              </div>
            ))}
          </div>

          <fieldset className="space-y-1">
            <legend className="text-sm font-medium">Simulated failure rate</legend>
            <div className="flex gap-1">
              {FAILURE_RATES.map((rate) => (
                <Button
                  key={rate}
                  size="sm"
                  variant={settings.failureRate === rate ? "default" : "outline"}
                  aria-pressed={settings.failureRate === rate}
                  onClick={() => settings.setFailureRate(rate)}
                >
                  {rate * 100}%
                </Button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-1">
            <Label htmlFor="demo-date">Demo &quot;today&quot;</Label>
            <Input
              id="demo-date"
              type="date"
              value={demoDate}
              onChange={(event) =>
                settings.setDemoNowOverride(
                  event.target.value ? `${event.target.value}T04:30:00.000Z` : null,
                )
              }
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                settings.setLatency(DEFAULT_LATENCY_MS);
                settings.setFailureRate(0);
                settings.setDemoNowOverride(null);
              }}
            >
              Restore defaults
            </Button>
            <ResetDemoDataButton size="sm" />
          </div>
        </section>
      ) : (
        <Button variant="outline" size="icon-lg" onClick={() => setOpen(true)}>
          <Wrench aria-hidden />
          <span className="sr-only">Open developer toolbar</span>
        </Button>
      )}
    </div>
  );
}
