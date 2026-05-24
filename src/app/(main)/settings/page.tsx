"use client";

import { useSettingsStore } from "@/store/settings-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_TRANSLATIONS, DEFAULT_RECITERS } from "@/lib/constants";
import { Moon, Type, BookOpen, Volume2, Globe } from "lucide-react";
import { useTheme } from "next-themes";

const FONT_SIZES = ["small", "medium", "large"] as const;
const ARABIC_FONT_SIZES = ["medium", "large", "xlarge", "2xlarge"] as const;
const DISPLAY_MODES = ["page", "continuous"] as const;

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const {
    fontSize,
    arabicFontSize,
    defaultTranslation,
    defaultReciter,
    displayMode,
    showTranslation,
    showTafsir,
    autoPlayNext,
    setFontSize,
    setArabicFontSize,
    setDefaultTranslation,
    setDefaultReciter,
    setDisplayMode,
    setShowTranslation,
    setShowTafsir,
    setAutoPlayNext,
  } = useSettingsStore();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-12">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Appearance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Display Mode</Label>
              <Select value={displayMode} onValueChange={setDisplayMode as (v: string) => void}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISPLAY_MODES.map((m) => (
                    <SelectItem key={m} value={m} className="capitalize">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-4 w-4 text-primary" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>UI Font Size</Label>
              <Select value={fontSize} onValueChange={setFontSize as (v: string) => void}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map((s) => (
                    <SelectItem key={s} value={s} className="uppercase">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Arabic Font Size</Label>
              <Select value={arabicFontSize} onValueChange={setArabicFontSize as (v: string) => void}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ARABIC_FONT_SIZES.map((s) => (
                    <SelectItem key={s} value={s} className="uppercase">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reading */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Reading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-translation">Show Translation</Label>
              <Switch
                id="show-translation"
                checked={showTranslation}
                onCheckedChange={setShowTranslation}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-tafsir">Show Tafsir</Label>
              <Switch
                id="show-tafsir"
                checked={showTafsir}
                onCheckedChange={setShowTafsir}
              />
            </div>
          </CardContent>
        </Card>

        {/* Translation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Translation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>Default Translation</Label>
              <Select value={defaultTranslation} onValueChange={setDefaultTranslation}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
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
          </CardContent>
        </Card>

        {/* Audio */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-primary" />
              Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Default Reciter</Label>
              <Select value={defaultReciter} onValueChange={setDefaultReciter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_RECITERS.map((r) => (
                    <SelectItem key={r.identifier} value={r.identifier} className="text-xs">
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-play">Auto-play Next Ayah</Label>
              <Switch
                id="auto-play"
                checked={autoPlayNext}
                onCheckedChange={setAutoPlayNext}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
