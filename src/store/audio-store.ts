import { create } from "zustand";
import type { AudioState, AudioQueueItem } from "@/types";

interface AudioStore extends AudioState {
  setPlaying: (playing: boolean) => void;
  setCurrentAyah: (key: string | null, globalAyahNumber?: number | null) => void;
  setReciter: (id: string) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  setLoading: (loading: boolean) => void;
  toggleRepeat: () => void;
  toggleAutoPlay: () => void;
  playQueueStart: (queue: AudioQueueItem[], startIndex?: number) => void;
  playNext: () => boolean;
  playPrev: () => boolean;
  clearQueue: () => void;
  reset: () => void;
}

const DEFAULT_STATE: AudioState = {
  isPlaying: false,
  currentAyahKey: null,
  currentAyahNumber: null,
  reciterId: "ar.alafasy",
  duration: 0,
  currentTime: 0,
  volume: 1,
  isLoading: false,
  isRepeat: false,
  autoPlay: false,
  playQueue: [],
  playQueueIndex: null,
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  ...DEFAULT_STATE,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentAyah: (currentAyahKey, currentAyahNumber = null) =>
    set({ currentAyahKey, currentAyahNumber, playQueue: [], playQueueIndex: null }),
  setReciter: (reciterId) => set({ reciterId }),
  setDuration: (duration) => set({ duration }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setVolume: (volume) => set({ volume }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleRepeat: () => set((s) => ({ isRepeat: !s.isRepeat })),
  toggleAutoPlay: () => set((s) => ({ autoPlay: !s.autoPlay })),
  playQueueStart: (queue, startIndex = 0) => {
    if (!queue.length) return;
    const idx = Math.max(0, Math.min(startIndex, queue.length - 1));
    const item = queue[idx];
    set({
      playQueue: queue,
      playQueueIndex: idx,
      currentAyahKey: item.key,
      currentAyahNumber: item.number,
      isPlaying: true,
    });
  },
  playNext: () => {
    const { playQueue, playQueueIndex } = get();
    if (playQueueIndex === null || !playQueue.length) return false;
    const next = playQueueIndex + 1;
    if (next >= playQueue.length) {
      set({ isPlaying: false });
      return false;
    }
    const item = playQueue[next];
    set({
      playQueueIndex: next,
      currentAyahKey: item.key,
      currentAyahNumber: item.number,
      isPlaying: true,
    });
    return true;
  },
  playPrev: () => {
    const { playQueue, playQueueIndex } = get();
    if (playQueueIndex === null || !playQueue.length) return false;
    const prev = playQueueIndex - 1;
    if (prev < 0) return false;
    const item = playQueue[prev];
    set({
      playQueueIndex: prev,
      currentAyahKey: item.key,
      currentAyahNumber: item.number,
      isPlaying: true,
    });
    return true;
  },
  clearQueue: () => set({ playQueue: [], playQueueIndex: null }),
  reset: () => set(DEFAULT_STATE),
}));
