"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDataStore } from "@/lib/data/store";

export function ResetDemoDataButton({ size = "default" }: { size?: "default" | "sm" }) {
  const [open, setOpen] = useState(false);

  const reset = () => {
    useDataStore.getState().resetDemoData();
    setOpen(false);
    toast.success("Demo data reset to the original sample.");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size={size}>
            <RotateCcw aria-hidden />
            Reset demo data
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset demo data?</DialogTitle>
          <DialogDescription>
            Everything you have added or changed in this browser will be replaced with the original
            sample data. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive" onClick={reset}>
            Reset demo data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
