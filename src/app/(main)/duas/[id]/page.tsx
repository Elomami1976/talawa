import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { duaCategories, getDuaCategoryById } from "@/lib/duas-data";
import { buildCanonicalUrl } from "@/lib/seo";
import { DuaCard, CategoryAudio } from "@/components/duas/dua-card";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return duaCategories.map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cat = getDuaCategoryById(parseInt(id, 10));
  if (!cat) return {};
  return {
    title: `${cat.title} — تلاوة`,
    description: `${cat.title} — أذكار وأدعية مأثورة من كتاب حصن المسلم.`,
    alternates: { canonical: buildCanonicalUrl(`/duas/${cat.id}`) },
  };
}

export default async function DuaCategoryPage({ params }: Props) {
  const { id } = await params;
  const cat = getDuaCategoryById(parseInt(id, 10));
  if (!cat) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-12" dir="rtl">
      <Link
        href="/duas"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
      >
        <ChevronRight className="h-4 w-4 ml-1" />
        كل الأبواب
      </Link>

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            {cat.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {cat.duas.length} {cat.duas.length === 1 ? "ذكر" : "أذكار"}
          </p>
        </div>
        {cat.audioUrl && <CategoryAudio url={cat.audioUrl} title={cat.title} />}
      </div>

      <div className="space-y-4">
        {cat.duas.map((dua, i) => (
          <DuaCard key={dua.id} categoryId={cat.id} dua={dua} index={i} />
        ))}
      </div>
    </main>
  );
}
