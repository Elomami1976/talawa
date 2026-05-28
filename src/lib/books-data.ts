/**
 * Static catalog of classical Islamic books available as PDF.
 * Files are hosted on Internet Archive (archive.org) — public-domain works.
 */

export interface IslamicBook {
  slug: string;
  titleEn: string;
  titleAr: string;
  authorEn: string;
  authorAr: string;
  descriptionEn: string;
  descriptionAr: string;
  categoryEn: string;
  categoryAr: string;
  /** Direct PDF download URL (https). */
  pdfUrl?: string;
  /** Approximate file size shown to the user (e.g. "40 MB"). */
  pdfSize?: string;
  /** Archive.org details page (always shown as fallback / mirror). */
  detailsUrl: string;
  /** Optional: multi-volume items expose a list of per-volume PDFs. */
  volumes?: Array<{ label: string; url: string; size?: string }>;
}

export const ISLAMIC_BOOKS: IslamicBook[] = [
  {
    slug: "sahih-al-bukhari",
    titleEn: "Sahih Al-Bukhari",
    titleAr: "صحيح البخاري",
    authorEn: "Imam Muhammad ibn Ismail Al-Bukhari (194–256 AH)",
    authorAr: "الإمام محمد بن إسماعيل البخاري (194–256هـ)",
    descriptionEn:
      "The most authentic book of hadith after the Qur'an, containing the rigorously verified sayings, actions and approvals of the Prophet Muhammad ﷺ, compiled by Imam Al-Bukhari over sixteen years.",
    descriptionAr:
      "أصحُّ كتاب بعد كتاب الله تعالى، جمع فيه الإمام البخاري أحاديث النبي ﷺ الصحيحة على مدى ستّ عشرة سنة، وعليه المعوَّل عند أهل العلم بالحديث.",
    categoryEn: "Hadith",
    categoryAr: "الحديث",
    pdfUrl: "https://archive.org/download/sahih-bukhari-arabic/99184.pdf",
    pdfSize: "40 MB",
    detailsUrl: "https://archive.org/details/sahih-bukhari-arabic",
  },
  {
    slug: "sahih-muslim",
    titleEn: "Sahih Muslim",
    titleAr: "صحيح مسلم",
    authorEn: "Imam Muslim ibn Al-Hajjaj An-Nisaburi (206–261 AH)",
    authorAr: "الإمام مسلم بن الحجاج النيسابوري (206–261هـ)",
    descriptionEn:
      "The second of the two most authentic hadith collections (the Sahihayn). Renowned for its meticulous arrangement and the strict authentication of its chains of transmission.",
    descriptionAr:
      "ثاني أصحّ كتب الحديث بعد صحيح البخاري، ويتميّز بدقّة ترتيبه وجمعه طرق الحديث الواحد في موضع واحد، مع شدّة الإمام مسلم في اشتراط الصحة.",
    categoryEn: "Hadith",
    categoryAr: "الحديث",
    pdfUrl:
      "https://archive.org/download/SahihMuslimKarmi/Sahih_Muslim_Karmi.pdf",
    pdfSize: "37 MB",
    detailsUrl: "https://archive.org/details/SahihMuslimKarmi",
  },
  {
    slug: "muwatta-malik",
    titleEn: "Al-Muwatta",
    titleAr: "الموطّأ",
    authorEn: "Imam Malik ibn Anas (93–179 AH)",
    authorAr: "الإمام مالك بن أنس (93–179هـ)",
    descriptionEn:
      "The earliest surviving written collection of hadith and Islamic jurisprudence, compiled by Imam Malik, the founder of the Maliki school, over forty years in the city of Madinah.",
    descriptionAr:
      "أوّل كتاب صُنِّف في الحديث والفقه على الإطلاق، جمعه الإمام مالك إمام دار الهجرة على مدى أربعين سنة، وهو عمدة المذهب المالكي وأصل من أصوله.",
    categoryEn: "Hadith & Fiqh",
    categoryAr: "الحديث والفقه",
    detailsUrl: "https://archive.org/details/AlMuwatae",
    volumes: [
      {
        label: "الجزء الأول",
        url: "https://archive.org/download/AlMuwatae/MuwataeVol.1.pdf",
      },
      {
        label: "الجزء الثاني",
        url: "https://archive.org/download/AlMuwatae/MuwataeVol.2.pdf",
      },
    ],
  },
  {
    slug: "musnad-ahmad",
    titleEn: "Musnad Imam Ahmad",
    titleAr: "مسند الإمام أحمد بن حنبل",
    authorEn: "Imam Ahmad ibn Hanbal (164–241 AH)",
    authorAr: "الإمام أحمد بن حنبل (164–241هـ)",
    descriptionEn:
      "The largest classical musnad collection of hadith, containing over 27,000 narrations arranged by the Companion who related them — compiled by the imam of Ahl al-Sunnah, Imam Ahmad.",
    descriptionAr:
      "أعظم كتب المسانيد على الإطلاق، يحوي أكثر من سبعة وعشرين ألف حديث مرتّبة على مسانيد الصحابة، جمعه إمام أهل السنة الإمام أحمد بن حنبل رحمه الله.",
    categoryEn: "Hadith",
    categoryAr: "الحديث",
    pdfUrl:
      "https://archive.org/download/musnad-ahmad-bin-hanbal/Musnad%20Ahmad%20bin%20Hanbal.pdf",
    pdfSize: "191 MB",
    detailsUrl: "https://archive.org/details/musnad-ahmad-bin-hanbal",
  },
  {
    slug: "seerah-ibn-hisham",
    titleEn: "Al-Seerah Al-Nabawiyyah by Ibn Hisham",
    titleAr: "السيرة النبوية لابن هشام",
    authorEn: "Abd Al-Malik ibn Hisham (d. 213 AH)",
    authorAr: "أبو محمد عبد الملك بن هشام (ت 213هـ)",
    descriptionEn:
      "The foundational biography of the Prophet Muhammad ﷺ, edited by Ibn Hisham from the earlier Seerah of Ibn Ishaq. The primary classical source for the Prophet's life.",
    descriptionAr:
      "أشهر كتب السيرة النبوية وأقدمها، هذّبها ابن هشام من سيرة ابن إسحاق، وهي العمدة في معرفة سيرة النبي ﷺ ومغازيه عند المتقدّمين والمتأخّرين.",
    categoryEn: "Seerah",
    categoryAr: "السيرة النبوية",
    pdfUrl: "https://archive.org/download/SeerahIbnHisham/sirat_ibn_hisham.pdf",
    pdfSize: "12 MB",
    detailsUrl: "https://archive.org/details/SeerahIbnHisham",
  },
];
