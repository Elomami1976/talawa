import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact \u2014 telawa",
  description: "Contact the telawa team.",
  alternates: { canonical: buildCanonicalUrl("/contact") },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-primary">اتصل بنا</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none leading-loose space-y-5 text-base">
        <p>
          نُرحّب باقتراحاتك وملاحظاتك على <strong>تلاوة (telawa)</strong>،
          سواءً كانت تصحيحاً أو اقتراح ميزةٍ جديدة أو دعاءً بظهر الغيب.
        </p>

        <div className="rounded-xl border bg-muted/30 p-5 space-y-4">
          <p className="text-sm">
            البريد الإلكتروني الرسمي للموقع:
          </p>
          <a
            href="mailto:info@telawa.org"
            className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 text-primary">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 5L2 7" />
            </svg>
            <span>info@telawa.org</span>
          </a>
          <p className="text-sm pt-2">
            كما يمكنك التواصل معنا عبر حسابات السوشل ميديا:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.tiktok.com/@alhaqalmuben"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z"/>
              </svg>
              <span>تيك توك — @alhaqalmuben</span>
            </a>
            <a
              href="https://youtube.com/@alhaqalmuben"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border bg-background px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0 text-red-600">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>يوتيوب — @alhaqalmuben</span>
            </a>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6">قبل المراسلة</h2>
        <ul className="list-disc pr-6 space-y-1">
          <li>إن كانت ملاحظتك خطأً في نصٍّ قرآني، أرفق رقم السورة والآية.</li>
          <li>إن كانت مشكلةً تقنية، اذكر المتصفّح ونوع الجهاز.</li>
          <li>إن كان اقتراحَ ميزةٍ، صِفها بإيجاز ولماذا تراها مفيدة.</li>
        </ul>

        <p className="text-sm text-muted-foreground mt-6">
          جزاكم الله خيراً على وقتكم واهتمامكم.
        </p>
      </div>
    </div>
  );
}
