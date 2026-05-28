import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ISLAMIC_BOOKS } from "@/lib/books-data";
import { buildCanonicalUrl } from "@/lib/seo";
import { BookMarked, Download, ExternalLink, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "تحميل الكتب الإسلامية | Islamic Books PDF — تلاوة",
  description:
    "تحميل أمّهات الكتب الإسلامية بصيغة PDF: صحيح البخاري، صحيح مسلم، الموطّأ، مسند الإمام أحمد، والسيرة النبوية لابن هشام — روابط مباشرة من أرشيف الإنترنت.",
  alternates: { canonical: buildCanonicalUrl("/books") },
  openGraph: {
    title: "تحميل الكتب الإسلامية بصيغة PDF — تلاوة",
    description:
      "أمّهات كتب الحديث والسيرة النبوية بصيغة PDF: البخاري، مسلم، الموطّأ، مسند أحمد، وسيرة ابن هشام.",
    url: buildCanonicalUrl("/books"),
  },
};

export default function BooksPage() {
  return (
    <main
      className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-12"
      dir="rtl"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
          <BookMarked className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          تحميل الكتب الإسلامية
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          أمّهات كتب الحديث والسيرة النبوية لأئمة المسلمين، متاحة للتحميل
          المباشر بصيغة PDF من{" "}
          <a
            href="https://archive.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            أرشيف الإنترنت
          </a>
          .
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ISLAMIC_BOOKS.map((book) => (
          <Card
            key={book.slug}
            className="hover:border-primary/50 hover:shadow-md transition-all"
          >
            <CardContent className="p-5 flex flex-col h-full">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold leading-tight">
                    {book.titleAr}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {book.titleEn}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {book.categoryAr}
                </Badge>
              </div>

              <p className="text-sm font-medium text-primary mb-2">
                {book.authorAr}
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {book.descriptionAr}
              </p>

              <div className="flex flex-col gap-2 pt-3 border-t">
                {book.pdfUrl && (
                  <a
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      تحميل PDF
                    </span>
                    {book.pdfSize && (
                      <span className="text-xs opacity-80">
                        {book.pdfSize}
                      </span>
                    )}
                  </a>
                )}

                {book.volumes?.map((v) => (
                  <a
                    key={v.url}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      تحميل {v.label} — PDF
                    </span>
                    {v.size && (
                      <span className="text-xs opacity-80">{v.size}</span>
                    )}
                  </a>
                ))}

                <a
                  href={book.detailsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  صفحة الكتاب في الأرشيف
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 p-4 rounded-lg bg-muted/50 border text-sm text-muted-foreground text-center leading-relaxed">
        <p>
          هذه الكتب من التراث الإسلامي العام، ومستضافة على{" "}
          <a
            href="https://archive.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            archive.org
          </a>
          . موقع تلاوة يوفّر روابط مباشرة فقط، ولا يستضيف أيّاً من هذه الملفات.
        </p>
        <p className="mt-2">
          هل تودّ اقتراح كتابٍ آخر؟{" "}
          <Link
            href="/contact"
            className="underline hover:text-primary"
          >
            تواصل معنا
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
