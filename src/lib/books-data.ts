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
  {
    slug: "fath-al-bari",
    titleEn: "Fath Al-Bari (Commentary on Sahih Al-Bukhari)",
    titleAr: "فتح الباري بشرح صحيح البخاري",
    authorEn: "Al-Hafiz Ibn Hajar Al-Asqalani (773–852 AH)",
    authorAr: "الحافظ ابن حجر العسقلاني (773–852هـ)",
    descriptionEn:
      "The greatest and most comprehensive commentary on Sahih Al-Bukhari, authored by the Shaykh al-Islam Ibn Hajar Al-Asqalani over more than twenty-five years. An indispensable reference in hadith sciences, jurisprudence and Arabic linguistics.",
    descriptionAr:
      "أعظم شروح صحيح البخاري وأجمعها، صنّفه شيخ الإسلام الحافظ ابن حجر العسقلاني في نحو خمسٍ وعشرين سنة، وهو مرجعٌ لا غنى عنه في علوم الحديث والفقه واللغة، وقيل فيه: «لا هجرة بعد الفتح».",
    categoryEn: "Hadith Commentary",
    categoryAr: "شروح الحديث",
    detailsUrl: "https://archive.org/details/fath_albari_bolak",
    volumes: [
      { label: "المقدمة (هدي الساري)", url: "https://archive.org/download/fath_albari_bolak/hady_assari.pdf", size: "30 MB" },
      { label: "الجزء الأول", url: "https://archive.org/download/fath_albari_bolak/fath_albari_01.pdf", size: "39 MB" },
      { label: "الجزء الثاني", url: "https://archive.org/download/fath_albari_bolak/fath_albari_02.pdf", size: "35 MB" },
      { label: "الجزء الثالث", url: "https://archive.org/download/fath_albari_bolak/fath_albari_03.pdf", size: "33 MB" },
      { label: "الجزء الرابع", url: "https://archive.org/download/fath_albari_bolak/fath_albari_04.pdf", size: "33 MB" },
      { label: "الجزء الخامس", url: "https://archive.org/download/fath_albari_bolak/fath_albari_05.pdf", size: "23 MB" },
      { label: "الجزء السادس", url: "https://archive.org/download/fath_albari_bolak/fath_albari_06.pdf", size: "35 MB" },
      { label: "الجزء السابع", url: "https://archive.org/download/fath_albari_bolak/fath_albari_07.pdf", size: "25 MB" },
      { label: "الجزء الثامن", url: "https://archive.org/download/fath_albari_bolak/fath_albari_08.pdf", size: "47 MB" },
      { label: "الجزء التاسع", url: "https://archive.org/download/fath_albari_bolak/fath_albari_09.pdf", size: "40 MB" },
      { label: "الجزء العاشر", url: "https://archive.org/download/fath_albari_bolak/fath_albari_10.pdf", size: "32 MB" },
      { label: "الجزء الحادي عشر", url: "https://archive.org/download/fath_albari_bolak/fath_albari_11.pdf", size: "35 MB" },
      { label: "الجزء الثاني عشر", url: "https://archive.org/download/fath_albari_bolak/fath_albari_12.pdf", size: "28 MB" },
      { label: "الجزء الثالث عشر", url: "https://archive.org/download/fath_albari_bolak/fath_albari_13.pdf", size: "29 MB" },
    ],
  },
  {
    slug: "sharh-riyad-al-salihin",
    titleEn: "Sharh Riyad Al-Salihin",
    titleAr: "شرح رياض الصالحين",
    authorEn: "Shaykh Muhammad ibn Salih Al-Uthaymeen (1929–2001 CE)",
    authorAr: "الشيخ محمد بن صالح العثيمين (1347–1421هـ)",
    descriptionEn:
      "A clear and beneficial explanation of Imam Al-Nawawi's famous Riyad Al-Salihin by the renowned scholar Shaykh Ibn Al-Uthaymeen, combining sound creed, jurisprudence and refined manners in an accessible style.",
    descriptionAr:
      "شرحٌ ميسّرٌ نافعٌ لكتاب «رياض الصالحين» للإمام النووي، بقلم العلامة الشيخ محمد بن صالح العثيمين رحمه الله، جمع فيه بين صحّة العقيدة وفقه الأحكام وأدب السلوك بأسلوبٍ سهلٍ واضح.",
    categoryEn: "Hadith Commentary",
    categoryAr: "شروح الحديث",
    detailsUrl: "https://archive.org/details/ail_1_201902",
    volumes: [
      { label: "الجزء الأول", url: "https://archive.org/download/ail_1_201902/1.pdf", size: "11 MB" },
      { label: "الجزء الثاني", url: "https://archive.org/download/ail_1_201902/2.pdf", size: "14 MB" },
      { label: "الجزء الثالث", url: "https://archive.org/download/ail_1_201902/3.pdf", size: "12 MB" },
      { label: "الجزء الرابع", url: "https://archive.org/download/ail_1_201902/4.pdf", size: "11 MB" },
      { label: "الجزء الخامس", url: "https://archive.org/download/ail_1_201902/5.pdf", size: "10 MB" },
      { label: "الجزء السادس", url: "https://archive.org/download/ail_1_201902/6.pdf", size: "13 MB" },
    ],
  },
  {
    slug: "zad-al-maad",
    titleEn: "Zad Al-Ma'ad",
    titleAr: "زاد المعاد في هدي خير العباد",
    authorEn: "Imam Ibn Qayyim Al-Jawziyyah (691–751 AH)",
    authorAr: "الإمام ابن قيّم الجوزية (691–751هـ)",
    descriptionEn:
      "A masterpiece on the guidance (hady) of the Prophet Muhammad ﷺ in worship, dealings, medicine and conduct, written by Imam Ibn Al-Qayyim. It blends seerah, fiqh and prophetic wisdom into one profound work.",
    descriptionAr:
      "من روائع مصنّفات الإمام ابن القيّم رحمه الله، جمع فيه هَدي النبي ﷺ في عباداته ومعاملاته وطبّه وأخلاقه وسياسته، فامتزجت فيه السيرة بالفقه وحكمة النبوة في سِفرٍ عظيم النفع.",
    categoryEn: "Seerah & Fiqh",
    categoryAr: "السيرة والفقه",
    detailsUrl: "https://archive.org/details/zadalmaad",
    pdfUrl: "https://archive.org/download/zadalmaad/zadalmaad.pdf",
    pdfSize: "38 MB",
  },
];
