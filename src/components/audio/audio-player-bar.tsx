"use client";

import { useEffect, useRef, useCallback } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Download, X } from "lucide-react";
import { useAudioStore } from "@/store/audio-store";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatTime, buildAudioUrl, downloadAudioFile } from "@/lib/utils";
import { DEFAULT_RECITERS } from "@/lib/constants";

export function AudioPlayerBar() {
  const {
    isPlaying,
    currentAyahKey,
    currentAyahNumber,
    reciterId,
    duration,
    currentTime,
    volume,
    isLoading,
    isRepeat,
    setPlaying: setIsPlaying,
    setCurrentTime,
    setDuration,
    setLoading: setIsLoading,
    setVolume,
    toggleRepeat,
    playNext,
    playPrev,
    playQueue,
    playQueueIndex,
    reset,
  } = useAudioStore();

  const hasQueue = playQueue.length > 0 && playQueueIndex !== null;
  const hasNext = hasQueue && (playQueueIndex as number) < playQueue.length - 1;
  const hasPrev = hasQueue && (playQueueIndex as number) > 0;

  // Two elements, double-buffered: `audioRef` is the one playing, `nextRef`
  // silently preloads the next ayah in the queue. On "ended" they swap, so the
  // next ayah starts instantly instead of waiting for a network fetch.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextRef = useRef<HTMLAudioElement | null>(null);
  const nextUrlRef = useRef<string | null>(null);

  const reciterEntry = DEFAULT_RECITERS.find((r) => r.identifier === reciterId);
  const reciterBase = reciterEntry?.audioBaseUrl ?? reciterId;
  const reciterFormat = reciterEntry?.audioFormat ?? "global";

  // Ayah keys are "surah:ayah" - split them for the "surah-ayah" URL pattern
  const urlFor = (key: string | null, number: number | null) => {
    if (!key || !number || !reciterId) return null;
    const [s, a] = key.split(":").map(Number);
    return buildAudioUrl(reciterBase, number, s, a, reciterFormat);
  };

  const audioUrl = urlFor(currentAyahKey, currentAyahNumber);
  const nextItem = hasNext ? playQueue[(playQueueIndex as number) + 1] : null;
  const nextUrl = nextItem ? urlFor(nextItem.key, nextItem.number) : null;

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    if (!nextRef.current) {
      nextRef.current = new Audio();
      nextRef.current.preload = "auto";
    }
    const elements = [audioRef.current, nextRef.current];

    // Both elements share these handlers; only the active one may update the UI.
    const isActive = (e: Event) => e.currentTarget === audioRef.current;

    const onTimeUpdate = (e: Event) => {
      if (isActive(e)) setCurrentTime(audioRef.current!.currentTime);
    };
    const onDurationChange = (e: Event) => {
      if (isActive(e)) setDuration(audioRef.current!.duration);
    };
    const onWaiting = (e: Event) => {
      if (isActive(e)) setIsLoading(true);
    };
    const onCanPlay = (e: Event) => {
      if (isActive(e)) setIsLoading(false);
    };
    const onEnded = (e: Event) => {
      if (!isActive(e)) return;
      const finished = audioRef.current!;

      if (useAudioStore.getState().isRepeat) {
        finished.currentTime = 0;
        finished.play().catch(() => {});
        return;
      }

      const preloaded = nextRef.current!;
      const target = nextUrlRef.current;
      if (target && preloaded.src === target) {
        // Start the preloaded ayah in this same tick - no render, no fetch.
        audioRef.current = preloaded;
        nextRef.current = finished;
        setCurrentTime(0);
        if (!Number.isNaN(preloaded.duration)) setDuration(preloaded.duration);
        setIsLoading(preloaded.readyState < HTMLMediaElement.HAVE_FUTURE_DATA);
        preloaded.play().catch(() => {
          // Some browsers (notably iOS Safari) refuse play() on an element the
          // user never interacted with. Fall back to reusing the old element.
          audioRef.current = finished;
          nextRef.current = preloaded;
          finished.src = target;
          finished.play().catch(() => setIsPlaying(false));
        });
      }

      if (!playNext()) setIsPlaying(false);
    };

    for (const el of elements) {
      el.addEventListener("timeupdate", onTimeUpdate);
      el.addEventListener("durationchange", onDurationChange);
      el.addEventListener("ended", onEnded);
      el.addEventListener("waiting", onWaiting);
      el.addEventListener("canplay", onCanPlay);
    }

    return () => {
      for (const el of elements) {
        el.removeEventListener("timeupdate", onTimeUpdate);
        el.removeEventListener("durationchange", onDurationChange);
        el.removeEventListener("ended", onEnded);
        el.removeEventListener("waiting", onWaiting);
        el.removeEventListener("canplay", onCanPlay);
      }
    };
  }, [playNext, setCurrentTime, setDuration, setIsLoading, setIsPlaying]);

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    const audio = audioRef.current;
    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    }
    if (isPlaying) {
      // After a gapless swap the element is already playing; don't restart it.
      if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [audioUrl, isPlaying, setIsPlaying]);

  // Keep the next ayah buffered while the current one plays.
  useEffect(() => {
    nextUrlRef.current = nextUrl;
    const next = nextRef.current;
    if (!next || !nextUrl || next.src === nextUrl) return;
    next.src = nextUrl;
    next.load();
  }, [nextUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (nextRef.current) nextRef.current.volume = volume;
  }, [volume]);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, [setCurrentTime]);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value[0]);
  }, [setVolume]);

  const handleClose = useCallback(() => {
    for (const el of [audioRef.current, nextRef.current]) {
      if (!el) continue;
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    reset();
  }, [reset]);

  const handleDownload = useCallback(() => {
    if (!audioUrl || !currentAyahKey) return;
    const [s, a] = currentAyahKey.split(":");
    const reciterSlug = (reciterEntry?.identifier ?? "reciter").replace(/[^a-z0-9._-]/gi, "_");
    downloadAudioFile(audioUrl, `quran-${s}-${a}-${reciterSlug}.mp3`);
  }, [audioUrl, currentAyahKey, reciterEntry]);

  if (!currentAyahKey) return null;

  const [surahNum, ayahNum] = currentAyahKey.split(":").map(Number);

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="mx-auto max-w-5xl px-4 py-2">
        {/* Progress bar */}
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="mb-2"
          aria-label="Audio progress"
        />

        <div className="flex items-center justify-between gap-4">
          {/* Ayah info */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              Surah {surahNum} : Ayah {ayahNum}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRepeat}
              className={isRepeat ? "text-primary" : "text-muted-foreground"}
              aria-label="Toggle repeat"
            >
              <Repeat className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous ayah"
              onClick={() => playPrev()}
              disabled={!hasPrev}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              variant="default"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isLoading}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Next ayah"
              onClick={() => playNext()}
              disabled={!hasNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <div className="hidden sm:flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                aria-label={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="w-20">
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  aria-label="Volume"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={!audioUrl}
              aria-label="Download MP3"
              title="Download MP3"
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="Close player"
              title="Close player"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
