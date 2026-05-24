"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Copy, Share2, Bookmark, Play, Pause, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toArabicNumeral } from "@/lib/utils";
import { useAudioStore } from "@/store/audio-store";
import { useSettingsStore } from "@/store/settings-store";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { useToast } from "@/hooks/use-toast";
import { buildAudioUrl } from "@/lib/utils";
import type { Ayah, AyahWithDetails, Translation, Tafsir } from "@/types";

interface AyahCardProps {
  ayah: Ayah | AyahWithDetails;
  translation?: Translation;
  tafsir?: Tafsir;
  audioBaseUrl?: string;
  isHighlighted?: boolean;
  showActions?: boolean;
  highlight?: string;
  id?: string;
}

const ARABIC_FONT_SIZES = {
  medium: "text-arabic-base",
  large: "text-arabic-lg",
  xlarge: "text-arabic-xl",
  "2xlarge": "text-arabic-2xl",
};

export function AyahCard({
  ayah,
  translation: translationProp,
  tafsir: tafsirProp,
  audioBaseUrl,
  isHighlighted = false,
  showActions = true,
  highlight,
  id,
}: AyahCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showTafsirText, setShowTafsirText] = useState(false);
  const sharingRef = useRef(false);

  const { isPlaying, currentAyahKey, setCurrentAyah, setPlaying } = useAudioStore();
  const { arabicFontSize, showTranslation, showTafsir } = useSettingsStore();
  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const toggleBookmark = useBookmarksStore((s) => s.toggle);
  const isBookmarked = bookmarks.some((b) => b.ayahId === ayah.id);

  // Support AyahWithDetails (arrays) or direct props
  const details = ayah as AyahWithDetails;
  const translation = translationProp ?? details.translations?.[0];
  const tafsir = tafsirProp ?? details.tafsirs?.[0];

  const isCurrentlyPlaying = isPlaying && currentAyahKey === ayah.ayahKey;
  const fontSizeClass = ARABIC_FONT_SIZES[arabicFontSize] || "text-arabic-lg";

  const handleCopy = async () => {
    const text = `${ayah.textAr}\n\n${translation?.text || ""}\n\n— Quran ${ayah.surahId}:${ayah.ayahNumber}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/ayah/${ayah.surahId}/${ayah.ayahNumber}`;
    if (sharingRef.current) return;
    if (navigator.share) {
      sharingRef.current = true;
      try {
        await navigator.share({
          title: `Quran ${ayah.surahId}:${ayah.ayahNumber}`,
          text: `${ayah.textSimple}\n${translation?.text || ""}`,
          url,
        });
      } catch (err) {
        // Ignore user cancellation/abort; fall back to copy on other errors
        const name = (err as { name?: string })?.name;
        if (name !== "AbortError" && name !== "InvalidStateError") {
          try {
            await navigator.clipboard.writeText(url);
            toast({ title: "Link copied!" });
          } catch {
            /* noop */
          }
        }
      } finally {
        sharingRef.current = false;
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!" });
    }
  };

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      setPlaying(false);
    } else {
      setCurrentAyah(ayah.ayahKey, ayah.id);
      setPlaying(true);
    }
  };

  const handleBookmark = () => {
    const surahMeta = (ayah as Ayah).surah;
    const added = toggleBookmark({
      ayahId: ayah.id,
      ayahKey: ayah.ayahKey,
      surahId: ayah.surahId,
      ayahNumber: ayah.ayahNumber,
      surahNameEn: surahMeta?.nameEn ?? `Surah ${ayah.surahId}`,
      surahNameAr: surahMeta?.nameAr ?? "",
      textAr: ayah.textAr,
      translation: translation?.text,
      createdAt: new Date().toISOString(),
    });
    toast({
      title: added ? "Bookmarked!" : "Bookmark removed",
      description: `Surah ${ayah.surahId}, Ayah ${ayah.ayahNumber}`,
    });
  };

  return (
    <motion.div
      id={id ?? `ayah-${ayah.ayahNumber}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative rounded-xl border p-5 transition-all duration-200",
        isHighlighted
          ? "border-primary/50 bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
      )}
    >
      {/* Ayah number badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full border-2 border-primary/30 flex items-center justify-center bg-primary/5">
            <span className="text-xs font-semibold text-primary font-arabic">
              {toArabicNumeral(ayah.ayahNumber)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {ayah.surahId}:{ayah.ayahNumber}
          </span>
        </div>

        {/* Quick actions - visible on hover */}
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {audioBaseUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handlePlayPause}
                aria-label={isCurrentlyPlaying ? "Pause" : "Play"}
              >
                {isCurrentlyPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleBookmark}
              aria-label="Bookmark"
            >
              <Bookmark
                className={cn(
                  "h-3.5 w-3.5",
                  isBookmarked && "fill-primary text-primary"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
              aria-label="Copy"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleShare}
              aria-label="Share"
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Arabic text */}
      <div
        className={cn(
          "quran-text mb-5 leading-loose text-right",
          fontSizeClass,
          isCurrentlyPlaying && "text-primary"
        )}
        dir="rtl"
        lang="ar"
      >
        {ayah.textAr}
      </div>

      {/* Translation */}
      {showTranslation && translation && (
        <>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {translation.text}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            — {translation.translator}
          </p>
        </>
      )}

      {/* Tafsir */}
      {showTafsir && tafsir && (
        <>
          <Separator className="my-4" />
          <div>
            <button
              onClick={() => setShowTafsirText(!showTafsirText)}
              className="text-xs font-medium text-primary hover:underline"
            >
              {showTafsirText ? "Hide" : "Show"} Tafsir ({tafsir.source})
            </button>
            {showTafsirText && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 text-sm text-muted-foreground leading-relaxed"
              >
                {tafsir.text}
              </motion.p>
            )}
          </div>
        </>
      )}

      {/* Sajda indicator */}
      {ayah.sajda && (
        <div className="absolute top-3 right-3 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 rounded px-1.5 py-0.5 font-medium">
          ۩ Sajda
        </div>
      )}
    </motion.div>
  );
}
