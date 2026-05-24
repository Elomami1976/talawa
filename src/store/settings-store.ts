import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@/types";

interface SettingsState extends UserSettings {
  setTheme: (theme: UserSettings["theme"]) => void;
  setFontSize: (size: UserSettings["fontSize"]) => void;
  setArabicFontSize: (size: UserSettings["arabicFontSize"]) => void;
  setDefaultTranslation: (key: string) => void;
  setDefaultReciter: (identifier: string) => void;
  setDisplayMode: (mode: UserSettings["displayMode"]) => void;
  setShowTranslation: (show: boolean) => void;
  setShowTafsir: (show: boolean) => void;
  setAutoPlayNext: (auto: boolean) => void;
  reset: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  fontSize: "medium",
  arabicFontSize: "large",
  defaultTranslation: "en.sahih",
  defaultReciter: "ar.yasseraldossari",
  displayMode: "continuous",
  showTranslation: true,
  showTafsir: false,
  autoPlayNext: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setArabicFontSize: (arabicFontSize) => set({ arabicFontSize }),
      setDefaultTranslation: (defaultTranslation) => set({ defaultTranslation }),
      setDefaultReciter: (defaultReciter) => set({ defaultReciter }),
      setDisplayMode: (displayMode) => set({ displayMode }),
      setShowTranslation: (showTranslation) => set({ showTranslation }),
      setShowTafsir: (showTafsir) => set({ showTafsir }),
      setAutoPlayNext: (autoPlayNext) => set({ autoPlayNext }),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: "quran-settings",
    }
  )
);
