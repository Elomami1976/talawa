import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReadingProgressStore {
  progress: Record<number, { ayahNumber: number; lastReadAt: string }>;
  recentSurahs: number[];
  setProgress: (surahId: number, ayahNumber: number) => void;
  getProgress: (surahId: number) => number;
  addRecentSurah: (surahId: number) => void;
  clearProgress: () => void;
}

export const useReadingProgressStore = create<ReadingProgressStore>()(
  persist(
    (set, get) => ({
      progress: {},
      recentSurahs: [],
      setProgress: (surahId, ayahNumber) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [surahId]: { ayahNumber, lastReadAt: new Date().toISOString() },
          },
        })),
      getProgress: (surahId) => get().progress[surahId]?.ayahNumber ?? 1,
      addRecentSurah: (surahId) =>
        set((state) => {
          const filtered = state.recentSurahs.filter((id) => id !== surahId);
          return { recentSurahs: [surahId, ...filtered].slice(0, 10) };
        }),
      clearProgress: () => set({ progress: {}, recentSurahs: [] }),
    }),
    { name: "quran-reading-progress" }
  )
);
