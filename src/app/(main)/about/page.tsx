import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About \u2014 telawa",
  description: "About the telawa project.",
  alternates: { canonical: buildCanonicalUrl("/about") },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-primary">من نحن</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none leading-loose space-y-5 text-base">
        <p>
          <span className="font-arabic text-2xl text-primary">ق</span>{" "}
          <strong>تلاوة (telawa)</strong> منصةٌ مفتوحةٌ لقراءة القرآن الكريم
          والاستماع إليه بأصوات نخبةٍ من القرّاء، مع التراجم والتفاسير
          ومواقيت الصلاة.
        </p>

        <p>
          هذا الموقع <strong>غير ربحيّ</strong>، ولا يحتوي على إعلانات،
          ولا يجمع بيانات شخصية. كل ما فيه متاحٌ مجاناً لكل مسلمٍ ومسلمة
          في أيّ مكانٍ من العالم.
        </p>

        <p>
          نسأل الله أن يجعله{" "}
          <strong>صدقةً جاريةً للمسلمين والمسلمات، الأحياءِ منهم والأموات</strong>،
          وأن يتقبّله منّا ومنكم، وأن ينفع به كلَّ من قرأ أو استمع أو شارك.
        </p>

        <blockquote className="border-r-4 border-primary pr-4 italic text-muted-foreground">
          «إذا مات الإنسانُ انقطع عمله إلا من ثلاث: صدقةٍ جارية، أو علمٍ يُنتفع به،
          أو ولدٍ صالحٍ يدعو له». — رواه مسلم
        </blockquote>

        <p className="text-sm text-muted-foreground">
          إن وجدت في الموقع نفعاً، فادعُ لكلّ من أسهم فيه بالخير.
        </p>
      </div>
    </div>
  );
}
