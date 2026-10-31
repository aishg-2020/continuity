"use client";

import { Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const KEY = "continuity-contrast";
const CHANGE_EVENT = "continuity-contrast-change";

function readPreference() {
  try {
    return localStorage.getItem(KEY) === "high";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** Toggles high-contrast "on-set" mode for bright outdoor conditions (PRD §5). */
export function ContrastToggle() {
  const high = useSyncExternalStore(subscribe, readPreference, () => false);

  useEffect(() => {
    document.documentElement.dataset.contrast = high ? "high" : "normal";
  }, [high]);

  const toggle = () => {
    try {
      localStorage.setItem(KEY, high ? "normal" : "high");
    } catch {
      // Storage unavailable (private mode): fall back to toggling for this page view.
      document.documentElement.dataset.contrast = high ? "normal" : "high";
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" size="icon" aria-pressed={high} onClick={toggle}>
            <Sun aria-hidden />
            <span className="sr-only">On-set high contrast</span>
          </Button>
        }
      />
      <TooltipContent>On-set high contrast</TooltipContent>
    </Tooltip>
  );
}
