"use client";

import Link from "next/link";
import { Bookmark, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { useToast } from "@/hooks/use-toast";

export default function BookmarksPage() {
  const { toast } = useToast();
  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const remove = useBookmarksStore((s) => s.remove);
  const clear = useBookmarksStore((s) => s.clear);

  const handleRemove = (ayahId: number) => {
    remove(ayahId);
    toast({ title: "Bookmark removed" });
  };

  const handleClear = () => {
    clear();
    toast({ title: "All bookmarks cleared" });
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
        {bookmarks.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {bookmarks.length} saved
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-destructive"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No bookmarks yet</p>
            <p className="text-sm mt-1">
              Bookmark ayahs while reading to save them here.
            </p>
            <p className="text-xs mt-2 opacity-70">
              Bookmarks are stored locally on this device.
            </p>
            <Button variant="outline" asChild className="mt-4">
              <Link href="/quran">
                <BookOpen className="mr-2 h-4 w-4" />
                Start Reading
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <Card key={bm.ayahId} className="group">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/surah/${bm.surahId}#ayah-${bm.ayahNumber}`}
                      className="block"
                    >
                      <p
                        className="text-xl font-arabic text-primary leading-loose text-right mb-2"
                        dir="rtl"
                        lang="ar"
                      >
                        {bm.textAr}
                      </p>
                      {bm.translation && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {bm.translation}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {bm.surahNameEn} · Verse {bm.ayahNumber}
                      </p>
                    </Link>
                    {bm.note && (
                      <p className="text-sm italic mt-2 text-muted-foreground border-l-2 border-primary/30 pl-2">
                        {bm.note}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                    onClick={() => handleRemove(bm.ayahId)}
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
