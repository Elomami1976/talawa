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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const reciterEntry = DEFAULT_RECITERS.find((r) => r.identifier === reciterId);
  const reciterBase = reciterEntry?.audioBaseUrl ?? reciterId;
  const reciterFormat = reciterEntry?.audioFormat ?? "global";

  // currentAyahKey is "surah:ayah" — derive components for the "surah-ayah" URL pattern
  const [currentSurah, currentAyahInSurah] = currentAyahKey
    ? currentAyahKey.split(":").map(Number)
    : [undefined, undefined];

  const audioUrl = currentAyahNumber && reciterId
    ? buildAudioUrl(
        reciterBase,
        currentAyahNumber,
        currentSurah,
        currentAyahInSurah,
        reciterFormat
      )
    : null;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      const advanced = playNext();
      if (!advanced) {
        setIsPlaying(false);
      }
    };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [isRepeat, playNext, setCurrentTime, setDuration, setIsLoading, setIsPlaying]);

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    const audio = audioRef.current;
    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    }
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [audioUrl, isPlaying, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
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
