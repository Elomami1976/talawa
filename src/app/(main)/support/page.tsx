import type { Metadata } from "next";
import { Heart, Server, Database, Radio, Code2 } from "lucide-react";
import { buildCanonicalUrl } from "@/lib/seo";

// Pure content, no DB and no request data. The root layout calls getLocale(),
// which would otherwise keep this page dynamic and re-render it per request.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "دعم الموقع - telawa",
  description:
    "تلاوة موقعٌ مجانيٌّ بلا إعلانات. تعرّف على تكاليف تشغيله وكيف تُسهم في استمراره وتشارك في أجره.",
  alternates: { canonical: buildCanonicalUrl("/support") },
};

const COSTS = [
  {
    icon: Server,
    title: "الاستضافة",
    body: "خوادم تعمل ليل نهار لتصل الصفحات إلى كل زائرٍ في أي بلدٍ وفي أي ساعة.",
  },
  {
    icon: Database,
    title: "قاعدة البيانات",
    body: "أكثر من ستة آلاف آية، مع التراجم والتفاسير، تُقرأ آلاف المرات كل يوم.",
  },
  {
    icon: Radio,
    title: "التلاوات الصوتية",
    body: "ملفات التلاوة الأثقل في الموقع، ويزداد استهلاكها كلما زاد المستمعون.",
  },
  {
    icon: Code2,
    title: "التطوير والصيانة",
    body: "إصلاح الأعطال، وإضافة القرّاء والمزايا الجديدة، وتحديث البيانات.",
  },
];

export default function SupportPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-primary">دعم الموقع</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none leading-loose space-y-5 text-base">
        <p>
          <strong>تلاوة</strong> موقعٌ مجانيٌّ بالكامل، لا إعلانات فيه، ولا
          اشتراكات، ولا يجمع بيانات زوّاره. أُنشئ ابتغاء وجه الله تعالى، وليبقى
          كذلك.
        </p>

        <p>
          لكنّ ما يصل إليك مجاناً ليس مجانيّاً في تشغيله. فلكلّ صفحةٍ تُفتح،
          ولكلّ آيةٍ تُقرأ، ولكلّ تلاوةٍ يُستمع إليها، كلفةٌ شهريةٌ تُدفع.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 my-10">
        {COSTS.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-lg border bg-card p-5 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-primary">
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <h2 className="font-semibold text-foreground m-0">{title}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed m-0">
              {body}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none leading-loose space-y-5 text-base">
        <p>
          فإن أردت أن يكون لك في هذا العمل نصيب، فمساهمتك، مهما صغرت، تُبقي
          الموقع قائماً، ويبلغك من أجر كلّ قارئٍ ومستمعٍ بمقدار ما أعنت.
        </p>

        <blockquote className="border-r-4 border-primary pr-4 italic text-muted-foreground">
          «مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ». (رواه مسلم)
        </blockquote>

        <p>
          وقال تعالى:{" "}
          <span className="font-arabic text-lg">
            ﴿مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ
            كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ
            مِّائَةُ حَبَّةٍ﴾
          </span>{" "}
          <span className="text-sm text-muted-foreground">[البقرة: 261]</span>
        </p>
      </div>

      <div className="my-10 rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
        <p className="mb-5 text-muted-foreground">
          يمكنك الدعم عبر PayPal، بأي مبلغٍ تيسّر، مرّةً واحدةً أو كلّما شئت.
        </p>
        <a
          href="https://www.paypal.com/paypalme/Elomami3M"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Heart className="h-5 w-5" aria-hidden="true" />
          ساهم في دعم تلاوة
        </a>
        <p className="mt-4 text-xs text-muted-foreground" dir="ltr">
          paypal.me/Elomami3M
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none leading-loose text-base">
        <p>
          ولا يقتصر الدعم على المال. فمشاركة الموقع مع من ينتفع به، أو التنبيه
          على خطأٍ وجدته، أو دعوةٌ بظهر الغيب، كلّها إعانةٌ لها أجرها.
        </p>

        <p className="text-sm text-muted-foreground">
          نسأل الله أن يتقبّل منّا ومنكم، وأن يجعله صدقةً جاريةً لنا ولكم
          وللمسلمين والمسلمات، الأحياءِ منهم والأموات.
        </p>
      </div>
    </div>
  );
}
