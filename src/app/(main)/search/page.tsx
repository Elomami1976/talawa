"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon, BookOpen } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { AyahCard } from "@/components/quran/ayah-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AyahWithDetails } from "@/types";

interface SearchResultItem {
  ayahId: number;
  ayahKey: string;
  surahId: number;
  ayahNumber: number;
  textAr: string;
  textSimple: string;
  surah: { nameEn: string; nameAr: string; nameTrans: string };
  translation?: string;
}

interface SurahMatch {
  id: number;
  nameAr: string;
  nameEn: string;
  nameTrans: string;
  englishTranslation: string;
  ayahCount: number;
  revelationType: string;
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [surahs, setSurahs] = useState<SurahMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=30`);
      const json = await res.json();
      setResults(json.data || []);
      setSurahs(json.surahs || []);
    } catch {
      setResults([]);
      setSurahs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) performSearch(query);
  }, [query, performSearch]);

  const handleSearch = (q: string) => {
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-24 md:pb-12">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Search the Quran</h1>

      <SearchBar
        defaultValue={query}
        onSearch={handleSearch}
        placeholder="Search in Arabic or English..."
        autoFocus
        className="mb-8"
      />

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && surahs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm mt-1">Try different keywords or search in Arabic</p>
        </div>
      )}

      {!loading && surahs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Surahs ({surahs.length})
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {surahs.map((s) => (
              <Link
                key={s.id}
                href={`/surah/${s.id}`}
                className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 hover:bg-accent transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                  {s.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium truncate">{s.nameTrans}</span>
                    <span className="font-arabic text-base shrink-0">{s.nameAr}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.englishTranslation} · {s.ayahCount} verses · {s.revelationType}
                  </p>
                </div>
                <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {results.length} verses for &ldquo;{query}&rdquo;
          </p>
          <div className="space-y-4">
            {results.map((item) => {
              const ayah = {
                id: item.ayahId,
                ayahKey: item.ayahKey,
                surahId: item.surahId,
                ayahNumber: item.ayahNumber,
                textAr: item.textAr,
                textSimple: item.textSimple,
                surah: item.surah,
                translations: item.translation
                  ? [{ text: item.translation, language: "en", translator: "en.sahih", ayahId: item.ayahId, id: 0, searchVector: null }]
                  : [],
                tafsirs: [],
                juz: 0,
                hizb: 0,
                page: 0,
                sajda: false,
              } as unknown as AyahWithDetails;

              return <AyahCard key={item.ayahKey} ayah={ayah} highlight={query} />;
            })}
          </div>
        </>
      )}

      {!searched && (
        <div className="text-center py-16 text-muted-foreground">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Search the Holy Quran</p>
          <p className="text-sm mt-1">Enter Arabic text or English keywords above</p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-8 pb-24 md:pb-12">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Search the Quran</h1>
          <Skeleton className="h-10 w-full mb-8" />
        </main>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
