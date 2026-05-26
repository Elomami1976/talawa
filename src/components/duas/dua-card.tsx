"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Check, RotateCcw, Volume2, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseRepeat, type Dua } from "@/lib/duas-data";
import { useToast } from "@/hooks/use-toast";

interface Props {
  categoryId: number;
  dua: Dua;
  index: number;
}

export function DuaCard({ categoryId, dua, index }: Props) {
  const total = parseRepeat(dua.repeat);
  const storageKey = `dua-count-${categoryId}-${dua.id}`;
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setCount(Math.min(parseInt(saved, 10) || 0, total));
    } catch {}
  }, [storageKey, total]);

  const increment = useCallback(() => {
    setCount((c) => {
      const next = Math.min(c + 1, total);
      try {
        localStorage.setItem(storageKey, String(next));
      } catch {}
      if (next === total && total > 1) {
        toast({
          title: "تم بحمد الله",
          description: `أكملت تكرار الذكر (${total} مرة)`,
        });
      }
      return next;
    });
  }, [storageKey, total, toast]);

  const reset = useCallback(() => {
    setCount(0);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(dua.arabic);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, [dua.arabic]);

  const progress = total > 0 ? (count / total) * 100 : 0;
  const done = count >= total;

  return (
    <Card className={done ? "border-emerald-500/50 bg-emerald-500/5" : ""}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
            {index + 1}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={copy}
            aria-label="نسخ"
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="font-arabic text-xl leading-loose text-right whitespace-pre-wrap">
          {dua.arabic}
        </p>

        {dua.reference && (
          <p className="text-xs text-muted-foreground border-t pt-3 leading-relaxed">
            {dua.reference}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2 border-t">
          <button
            type="button"
            onClick={increment}
            disabled={done}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              done
                ? "bg-emerald-500/10 text-emerald-600 cursor-default"
                : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
            }`}
          >
            {done ? (
              <>
                <Check className="h-4 w-4" />
                تم
              </>
            ) : (
              <>
                <span className="tabular-nums">
                  {count} / {total}
                </span>
                <span>تسبيح</span>
              </>
            )}
          </button>
          {count > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={reset}
              aria-label="إعادة"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {total > 1 && (
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                done ? "bg-emerald-500" : "bg-primary"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AudioProps {
  url: string;
  title: string;
}

export function CategoryAudio({ url, title }: AudioProps) {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Force https for mixed-content safety
    const safeUrl = url.replace(/^http:/, "https:");
    const a = new Audio(safeUrl);
    a.preload = "none";
    a.addEventListener("ended", () => setPlaying(false));
    a.addEventListener("pause", () => setPlaying(false));
    a.addEventListener("play", () => setPlaying(true));
    setAudio(a);
    return () => {
      a.pause();
      a.src = "";
    };
  }, [url]);

  const toggle = () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={toggle} className="gap-2">
      {playing ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {playing ? "إيقاف" : "استماع"}
      <span className="sr-only">{title}</span>
    </Button>
  );
}
