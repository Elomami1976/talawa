import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Search, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PrayerTimesWidget } from "@/components/prayer/prayer-times-widget";
import { generateMetaTags, buildCanonicalUrl } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = generateMetaTags({
  title: "QuranApp \u2014 Read, Listen & Reflect",
  description:
    "Explore the Holy Quran with beautiful recitations, accurate translations, and in-depth tafsir. Read every surah and ayah with Islamic scholarly commentary.",
  canonical: buildCanonicalUrl("/"),
});

async function getFeaturedSurahs() {
  try {
    const ids = [1, 2, 18, 36, 55, 67, 112, 113, 114];
    return prisma.surah.findMany({
      where: { id: { in: ids } },
      orderBy: { id: "asc" },
    });
  } catch {
    return [];
  }
}

async function getDailyAyah() {
  try {
    const total = await prisma.ayah.count();
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86_400_000
    );
    const skip = dayOfYear % total;
    return prisma.ayah.findFirst({
      skip,
      include: {
        surah: { select: { nameEn: true, nameTrans: true, id: true } },
        translations: {
          where: { language: "en", translator: "en.sahih" },
          take: 1,
        },
      },
      orderBy: { id: "asc" },
    });
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [featuredSurahs, dailyAyah] = await Promise.all([
    getFeaturedSurahs(),
    getDailyAyah(),
  ]);

  return (
    <main className="flex flex-col gap-12 pb-24 md:pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-gold/5 py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p
            className="mb-4 text-3xl sm:text-5xl font-arabic text-primary leading-loose"
            dir="rtl"
            lang="ar"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Read the Holy Quran
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Explore 114 surahs with beautiful recitations, accurate translations
            in 8 languages, and in-depth scholarly tafsir.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/quran">
                <BookOpen className="mr-2 h-4 w-4" />
                Start Reading
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Search Quran
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 flex flex-col gap-10">
        {/* Prayer Times */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Today&apos;s Prayer Times
          </h2>
          <PrayerTimesWidget />
        </section>

        {/* Daily Ayah */}
        {dailyAyah && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-gold" />
              Ayah of the Day
            </h2>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <p
                  className="text-2xl sm:text-3xl font-arabic text-primary leading-loose text-right mb-4"
                  dir="rtl"
                  lang="ar"
                >
                  {dailyAyah.textAr}
                </p>
                {dailyAyah.translations[0] && (
                  <p className="text-muted-foreground text-sm italic mb-3">
                    &ldquo;{dailyAyah.translations[0].text}&rdquo;
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {dailyAyah.surah.nameEn} ({dailyAyah.surah.nameTrans}) — Verse{" "}
                    {dailyAyah.ayahNumber}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/surah/${dailyAyah.surah.id}#ayah-${dailyAyah.ayahNumber}`}>
                      Read More <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Featured Surahs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Featured Surahs</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/quran">
                All 114 Surahs <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredSurahs.map((surah) => (
              <Link key={surah.id} href={`/surah/${surah.id}`}>
                <Card className="group p-4 hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {surah.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{surah.nameEn}</p>
                      <p className="text-xs text-muted-foreground">
                        {surah.nameTrans} · {surah.ayahCount} verses
                      </p>
                    </div>
                    <p
                      className="text-lg font-arabic text-primary shrink-0"
                      dir="rtl"
                      lang="ar"
                    >
                      {surah.nameAr}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: BookOpen,
              title: "114 Surahs",
              desc: "Complete Quran with Uthmani script",
            },
            {
              icon: Search,
              title: "Smart Search",
              desc: "Search in Arabic text or translations",
            },
            {
              icon: Clock,
              title: "Prayer Times",
              desc: "Accurate times based on your location",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-4 text-center">
              <div className="flex h-10 w-10 mx-auto mb-3 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-semibold text-sm mb-1">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
