"use client";

import { useSettingsStore } from "@/store/settings-store";
import { DEFAULT_RECITERS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function ReciterSelector() {
  const { defaultReciter, setDefaultReciter } = useSettingsStore();

  const handleOpenChange = (open: boolean) => {
    if (!open) return;
    // Radix Select auto-scrolls the viewport to the currently selected item
    // (using internal effects). We override that scroll across several ticks so
    // Yasser, Maher and Saad are always the first three reciters visible.
    const scrollTop = () => {
      const viewports = document.querySelectorAll<HTMLElement>(
        "[data-radix-select-viewport]"
      );
      viewports.forEach((vp) => {
        vp.scrollTop = 0;
      });
    };
    // Run on the next few frames + a short timeout to win the race with Radix.
    requestAnimationFrame(scrollTop);
    setTimeout(scrollTop, 0);
    setTimeout(scrollTop, 30);
    setTimeout(scrollTop, 80);
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="reciter-select" className="text-sm shrink-0 text-muted-foreground">
        Reciter
      </Label>
      <Select
        value={defaultReciter}
        onValueChange={setDefaultReciter}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger id="reciter-select" className="h-8 w-[200px] text-xs">
          <SelectValue placeholder="Select reciter" />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4}>
          {DEFAULT_RECITERS.map((r) => (
            <SelectItem key={r.identifier} value={r.identifier} className="text-xs">
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
