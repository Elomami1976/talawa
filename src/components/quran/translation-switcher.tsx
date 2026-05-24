"use client";

import { useSettingsStore } from "@/store/settings-store";
import { AVAILABLE_TRANSLATIONS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TranslationSwitcherProps {
  onChangeAction?: (identifier: string) => void;
}

export function TranslationSwitcher({ onChangeAction }: TranslationSwitcherProps) {
  const { defaultTranslation, setDefaultTranslation } = useSettingsStore();

  const handleChange = (value: string) => {
    setDefaultTranslation(value);
    onChangeAction?.(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="translation-select" className="text-sm shrink-0 text-muted-foreground">
        Translation
      </Label>
      <Select value={defaultTranslation} onValueChange={handleChange}>
        <SelectTrigger id="translation-select" className="h-8 w-[200px] text-xs">
          <SelectValue placeholder="Select translation" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_TRANSLATIONS.map((t) => (
            <SelectItem key={t.key} value={t.key} className="text-xs">
              {t.translator} ({t.languageName})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
