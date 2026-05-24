"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocalBookmark } from "@/types";

interface BookmarksState {
  bookmarks: LocalBookmark[];
  add: (bookmark: LocalBookmark) => void;
  remove: (ayahId: number) => void;
  toggle: (bookmark: LocalBookmark) => boolean; // returns new state
  has: (ayahId: number) => boolean;
  updateNote: (ayahId: number, note: string) => void;
  clear: () => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      add: (bookmark) =>
        set((state) => {
          if (state.bookmarks.some((b) => b.ayahId === bookmark.ayahId)) {
            return state;
          }
          return { bookmarks: [bookmark, ...state.bookmarks] };
        }),
      remove: (ayahId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.ayahId !== ayahId),
        })),
      toggle: (bookmark) => {
        const exists = get().bookmarks.some((b) => b.ayahId === bookmark.ayahId);
        if (exists) {
          set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.ayahId !== bookmark.ayahId),
          }));
          return false;
        }
        set((state) => ({ bookmarks: [bookmark, ...state.bookmarks] }));
        return true;
      },
      has: (ayahId) => get().bookmarks.some((b) => b.ayahId === ayahId),
      updateNote: (ayahId, note) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.ayahId === ayahId ? { ...b, note } : b
          ),
        })),
      clear: () => set({ bookmarks: [] }),
    }),
    { name: "quran-bookmarks" }
  )
);
