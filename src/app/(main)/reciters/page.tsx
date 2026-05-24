import Link from "next/link";
import type { Metadata } from "next";
import { RECITER_PROFILES } from "@/lib/reciters-data";
import { buildCanonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Quran Reciters — Biographies | telawa",
  description:
    "Biographies of the world's most beloved Quran reciters: Yasser Al-Dosari, Maher Al-Muaiqly, Saad Al-Ghamdi, Abu Baker Ash-Shaatree, and Mohamed Siddiq Al-Minshawi — in English and Arabic.",
  keywords: [
    "Quran reciters",
    "Quran biography",
    "Yasser Al-Dosari",
    "Maher Al-Muaiqly",
    "Saad Al-Ghamdi",
    "Abu Baker Ash-Shaatree",
    "Mohamed Siddiq Al-Minshawi",
    "Tilawah",
    "Islamic recitation",
  ],
  alternates: { canonical: buildCanonicalUrl("/reciters") },
  openGraph: {
    type: "website",
    url: buildCanonicalUrl("/reciters"),
    title: "Quran Reciters — Biographies",
    description:
      "Read about the world's most beloved Quran reciters in English and Arabic.",
  },
};

export default function RecitersIndexPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          قُرّاء القرآن الكريم · Quran Reciters
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          Reciters Biographies
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Get to know the voices behind the recitations. Each profile is
          available in English and Arabic.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RECITER_PROFILES.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/reciters/${r.slug}`}
              className="group block rounded-2xl border bg-card p-5 hover:border-primary/60 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {r.nameEn}
                  </h2>
                  <p
                    dir="rtl"
                    lang="ar"
                    className="text-base font-arabic-ui text-muted-foreground mt-0.5 truncate"
                  >
                    {r.nameAr}
                  </p>
                </div>
                <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {r.styleEn}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {r.taglineEn}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                {r.bornEn} · {r.countryEn}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
