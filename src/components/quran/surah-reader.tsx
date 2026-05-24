"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { AyahCard } from "@/components/quran/ayah-card";
import { Bismillah } from "@/components/quran/bismillah";
import { TranslationSwitcher } from "@/components/quran/translation-switcher";
import { ReciterSelector } from "@/components/quran/reciter-selector";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";
import { useAudioStore } from "@/store/audio-store";
import { AVAILABLE_TRANSLATIONS, AVAILABLE_TAFSIRS, DEFAULT_RECITERS } from "@/lib/constants";
import type { AyahWithDetails, Translation, Tafsir } from "@/types";

interface SurahReaderProps {
  surahId: number;
  ayahs: AyahWithDetails[];
}

export function SurahReader({ surahId, ayahs }: SurahReaderProps) {
  const { defaultTranslation, defaultReciter, showTafsir, setShowTafsir } =
    useSettingsStore();
  const setAudioReciter = useAudioStore((s) => s.setReciter);
  const playQueueStart = useAudioStore((s) => s.playQueueStart);
  const clearQueue = useAudioStore((s) => s.clearQueue);
  const setPlaying = useAudioStore((s) => s.setPlaying);
  const currentAyahKey = useAudioStore((s) => s.currentAyahKey);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const playQueue = useAudioStore((s) => s.playQueue);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isSurahPlaying = playQueue.length > 0 && isPlaying;

  const [translations, setTranslations] = useState<Map<number, Translation>>(new Map());
  const [tafsirs, setTafsirs] = useState<Map<number, Tafsir>>(new Map());
  const [loadingTr, setLoadingTr] = useState(false);
  const [loadingTaf, setLoadingTaf] = useState(false);

  const translationMeta = useMemo(
    () => AVAILABLE_TRANSLATIONS.find((t) => t.key === defaultTranslation),
    [defaultTranslation]
  );
  const reciter = useMemo(
    () => DEFAULT_RECITERS.find((r) => r.identifier === defaultReciter) ?? DEFAULT_RECITERS[0],
    [defaultReciter]
  );

  // Pick a tafsir source matching the translation language (fallback to ibn-kathir).
  const tafsirMeta = useMemo(() => {
    const lang = translationMeta?.language || "en";
    return (
      AVAILABLE_TAFSIRS.find((t) => t.language === lang) ??
      AVAILABLE_TAFSIRS.find((t) => t.key === "en.ibn-kathir") ??
      AVAILABLE_TAFSIRS[0]
    );
  }, [translationMeta]);

  // Sync audio reciter with user-selected reciter.
  useEffect(() => {
    setAudioReciter(defaultReciter);
  }, [defaultReciter, setAudioReciter]);

  // Auto-scroll to currently playing ayah when in queue mode.
  useEffect(() => {
    if (!currentAyahKey || playQueue.length === 0) return;
    const [s, a] = currentAyahKey.split(":");
    if (Number(s) !== surahId) return;
    const el = document.getElementById(`ayah-${a}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentAyahKey, playQueue.length, surahId]);

  const handlePlaySurah = () => {
    if (isSurahPlaying) {
      setPlaying(false);
      clearQueue();
      return;
    }
    const queue = ayahs.map((a) => ({ key: a.ayahKey, number: a.id }));
    playQueueStart(queue, 0);
  };

  // Fetch translations.
  useEffect(() => {
    if (!translationMeta) return;
    let cancelled = false;
    setLoadingTr(true);
    const url = `/api/translations?surahId=${surahId}&language=${translationMeta.language}&translator=${encodeURIComponent(
      translationMeta.translator
    )}`;
    fetch(url)
      .then((r) => r.json())
      .then((json: { data?: Translation[] }) => {
        if (cancelled) return;
        const map = new Map<number, Translation>();
        for (const t of json.data || []) map.set(t.ayahId, t);
        setTranslations(map);
      })
      .catch(() => {
        if (!cancelled) setTranslations(new Map());
      })
      .finally(() => {
        if (!cancelled) setLoadingTr(false);
      });
    return () => {
      cancelled = true;
    };
  }, [surahId, translationMeta]);

  // Fetch tafsirs (only when enabled).
  useEffect(() => {
    if (!showTafsir || !tafsirMeta) return;
    let cancelled = false;
    setLoadingTaf(true);
    const url = `/api/tafsirs?surahId=${surahId}&language=${tafsirMeta.language}&source=${encodeURIComponent(
      tafsirMeta.key
    )}`;
    fetch(url)
      .then((r) => r.json())
      .then((json: { data?: Tafsir[] }) => {
        if (cancelled) return;
        const map = new Map<number, Tafsir>();
        for (const t of json.data || []) map.set(t.ayahId, t);
        setTafsirs(map);
      })
      .catch(() => {
        if (!cancelled) setTafsirs(new Map());
      })
      .finally(() => {
        if (!cancelled) setLoadingTaf(false);
      });
    return () => {
      cancelled = true;
    };
  }, [surahId, tafsirMeta, showTafsir]);

  return (
    <>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6 p-3 rounded-xl border bg-muted/30">
        <TranslationSwitcher />
        <ReciterSelector />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isSurahPlaying ? "destructive" : "default"}
            onClick={handlePlaySurah}
            className="h-8 text-xs"
          >
            {isSurahPlaying ? (
              <>
                <Square className="h-3.5 w-3.5 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 mr-1" />
                Play Surah
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant={showTafsir ? "default" : "outline"}
            onClick={() => setShowTafsir(!showTafsir)}
            className="h-8 text-xs"
          >
            {showTafsir ? "Hide Tafsir" : "Show Tafsir"}
          </Button>
        </div>
      </div>

      {surahId !== 9 && <Bismillah />}

      <div ref={containerRef} className="space-y-4">
        {ayahs.map((ayah) => {
          const tr = translations.get(ayah.id);
          const taf = tafsirs.get(ayah.id);
          return (
            <AyahCard
              key={ayah.id}
              id={`ayah-${ayah.ayahNumber}`}
              ayah={ayah}
              translation={tr}
              tafsir={taf}
              audioBaseUrl={reciter.audioBaseUrl}
              isHighlighted={currentAyahKey === ayah.ayahKey}
            />
          );
        })}
      </div>

      {(loadingTr || loadingTaf) && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          Loading{loadingTr ? " translation" : ""}
          {loadingTr && loadingTaf ? " &" : ""}
          {loadingTaf ? " tafsir" : ""}...
        </p>
      )}
      {!loadingTr && translationMeta && translations.size === 0 && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          No translation available for {translationMeta.translator}.
        </p>
      )}
      {showTafsir && !loadingTaf && tafsirMeta && tafsirs.size === 0 && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          No tafsir data yet for {tafsirMeta.name}. Import may be in progress.
        </p>
      )}
    </>
  );
}
