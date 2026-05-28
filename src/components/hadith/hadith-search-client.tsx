"use client";

import { useCallback, useRef, useState } from "react";
import { Search, Loader2, ExternalLink, Copy, Check, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ParsedHadith {
  text: string;
  rawi: string;
  mhd: string;
  book: string;
  numberOrPage: string;
  grade: string;
}

interface SearchResponse {
  ok: boolean;
  ahadith?: ParsedHadith[];
  count?: number;
  error?: string;
}

function gradeVariant(
  grade?: string
): "success" | "secondary" | "destructive" | "outline" {
  const g = (grade || "").trim();
  if (!g) return "outline";
  if (/موضوع|باطل|منكر|لا أصل|لا يصح/.test(g)) return "destructive";
  if (/ضعيف|شاذ|خطأ/.test(g)) return "secondary";
  if (/صحيح|حسن|متفق|ثبت|مشهور بالصحة/.test(g)) return "success";
  return "outline";
}

export function HadithSearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ParsedHadith[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(
        `/api/hadith/search?q=${encodeURIComponent(q)}`,
        { cache: "force-cache" }
      );
      const json: SearchResponse = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "fetch_failed");
      }
      setResults(json.ahadith || []);
    } catch {
      setError(
        "تعذّر الوصول إلى خدمة الدرر السنية. تأكّد من اتصال الإنترنت أو حاول لاحقاً."
      );
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleCopy = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      window.setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <Input
              ref={inputRef}
              dir="rtl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="أدخل نصّ الحديث أو جزءاً منه..."
              className="flex-1 min-w-0 h-11 text-base bg-background border-2"
              aria-label="نص البحث في الموسوعة الحديثية"
            />
            <Button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="h-11 px-5 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جارٍ البحث...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 ml-2" />
                  تحقّق من الحديث
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {results && results.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>لم يُعثر على نتائج لهذا البحث.</p>
            <p className="text-xs mt-1">
              جرّب صياغة جزءٍ من نصّ الحديث بدون تشكيل.
            </p>
          </CardContent>
        </Card>
      )}

      {results && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            تم العثور على{" "}
            <span className="font-semibold text-foreground">
              {results.length}
            </span>{" "}
            نتيجة من الموسوعة الحديثية.
          </p>
          {results.map((h, i) => (
            <Card key={i} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-5 space-y-3">
                <p
                  dir="rtl"
                  className="text-base sm:text-lg leading-loose font-arabic"
                >
                  {h.text}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-3 border-t">
                  {h.grade && (
                    <Badge variant={gradeVariant(h.grade)} className="text-xs">
                      الحكم: {h.grade}
                    </Badge>
                  )}
                  {h.rawi && (
                    <span className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        الراوي:
                      </span>{" "}
                      {h.rawi}
                    </span>
                  )}
                  {h.mhd && (
                    <span className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        المحدِّث:
                      </span>{" "}
                      {h.mhd}
                    </span>
                  )}
                  {h.book && (
                    <span className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        المصدر:
                      </span>{" "}
                      {h.book}
                      {h.numberOrPage ? ` — ${h.numberOrPage}` : ""}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(h.text, i)}
                    className={cn(
                      "text-xs",
                      copiedIdx === i && "text-primary"
                    )}
                  >
                    {copiedIdx === i ? (
                      <>
                        <Check className="h-3.5 w-3.5 ml-1" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 ml-1" />
                        نسخ
                      </>
                    )}
                  </Button>
                  <a
                    href={`https://dorar.net/hadith/search?q=${encodeURIComponent(
                      h.text || query
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    عرض في الدرر
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
          <p className="text-xs text-muted-foreground text-center pt-2">
            المصدر: الموسوعة الحديثية —{" "}
            <a
              href="https://dorar.net"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              الدرر السنية (dorar.net)
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
