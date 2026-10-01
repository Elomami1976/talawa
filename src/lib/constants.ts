/**
 * Quran data constants and static data
 */

export const AVAILABLE_TRANSLATIONS: Array<{
  key: string;
  language: string;
  languageName: string;
  translator: string;
}> = [
  { key: "en.asad", language: "en", languageName: "English", translator: "Muhammad Asad" },
  { key: "en.sahih", language: "en", languageName: "English", translator: "Saheeh International" },
  { key: "en.pickthall", language: "en", languageName: "English", translator: "Pickthall" },
  { key: "en.yusufali", language: "en", languageName: "English", translator: "Yusuf Ali" },
  { key: "fr.hamidullah", language: "fr", languageName: "French", translator: "Hamidullah" },
  { key: "de.aburida", language: "de", languageName: "German", translator: "Abu Rida" },
  { key: "tr.diyanet", language: "tr", languageName: "Turkish", translator: "Diyanet İşleri" },
  { key: "ur.jalandhry", language: "ur", languageName: "Urdu", translator: "Fateh Muhammad Jalandhry" },
  { key: "ru.kuliev", language: "ru", languageName: "Russian", translator: "Kuliev" },
  { key: "id.indonesian", language: "id", languageName: "Indonesian", translator: "Indonesian MRA" },
];

export const AVAILABLE_TAFSIRS: Array<{
  key: string;
  name: string;
  language: string;
}> = [
  { key: "en.ibn-kathir", name: "Ibn Kathir", language: "en" },
  { key: "en.maariful-quran", name: "Maariful Quran", language: "en" },
  { key: "ar.ibn-kathir", name: "ابن كثير", language: "ar" },
  { key: "ar.muyassar", name: "الميسر", language: "ar" },
];

export const DEFAULT_RECITERS: Array<{
  identifier: string;
  name: string;
  style: string;
  audioBaseUrl: string;
  /**
   * URL pattern for the audio:
   *  - "global"     → `{base}/{1..6236}.mp3`        (default, alquran.cloud CDN)
   *  - "surah-ayah" → `{base}/{surah:03}{ayah:03}.mp3` (everyayah.com style)
   */
  audioFormat?: "global" | "surah-ayah";
  /**
   * Continuous full-surah recordings (mp3quran.net): `{base}/{surah:03}.mp3`.
   * Omitted when no complete recording exists for the reciter.
   */
  fullSurahBaseUrl?: string;
}> = [
  {
    identifier: "ar.yasseraldossari",
    name: "Yasser Al-Dosari",
    style: "Murattal",
    audioBaseUrl: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps",
    fullSurahBaseUrl: "https://server11.mp3quran.net/yasser",
    audioFormat: "surah-ayah",
  },
  {
    identifier: "ar.mahermuaiqly",
    name: "Maher Al-Muaiqly",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly",
    fullSurahBaseUrl: "https://server12.mp3quran.net/maher",
  },
  {
    identifier: "ar.saadalghamdi",
    name: "Saad Al-Ghamdi",
    style: "Murattal",
    audioBaseUrl: "https://everyayah.com/data/Ghamadi_40kbps",
    fullSurahBaseUrl: "https://server7.mp3quran.net/s_gmd",
    audioFormat: "surah-ayah",
  },
  {
    identifier: "ar.shaatree",
    name: "Abu Baker Ash-Shaatree",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.shaatree",
    fullSurahBaseUrl: "https://server11.mp3quran.net/shatri",
  },
  {
    identifier: "ar.minshawi",
    name: "Mohamed Siddiq AL-Minshawi",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawi",
    fullSurahBaseUrl: "https://server10.mp3quran.net/minsh",
  },
  {
    identifier: "ar.alafasy",
    name: "Mishary Rashid Alafasy",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy",
    fullSurahBaseUrl: "https://server8.mp3quran.net/afs",
  },
  {
    identifier: "ar.husary",
    name: "Mahmoud Khalil Al-Husary",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary",
    fullSurahBaseUrl: "https://server13.mp3quran.net/husr",
  },
  {
    identifier: "ar.husarymujawwad",
    name: "Mahmoud Al-Husary (Mujawwad)",
    style: "Mujawwad",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.husarymujawwad",
    fullSurahBaseUrl: "https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad",
  },
  {
    identifier: "ar.abdulsamad",
    name: "Abdul Basit Abdul Samad",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/64/ar.abdulsamad",
    fullSurahBaseUrl: "https://server7.mp3quran.net/basit",
  },
  {
    identifier: "ar.abdurrahmaansudais",
    name: "Abdul Rahman Al-Sudais",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/64/ar.abdurrahmaansudais",
    fullSurahBaseUrl: "https://server11.mp3quran.net/sds",
  },
  {
    identifier: "ar.hudhaify",
    name: "Ali Al-Hudhaify",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.hudhaify",
    fullSurahBaseUrl: "https://server9.mp3quran.net/hthfi",
  },
  {
    identifier: "ar.ahmedajamy",
    name: "Ahmed Al-Ajamy",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy",
    fullSurahBaseUrl: "https://server10.mp3quran.net/ajm",
  },
  {
    identifier: "ar.muhammadayyoub",
    name: "Muhammad Ayyoub",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.muhammadayyoub",
    fullSurahBaseUrl: "https://server8.mp3quran.net/ayyub",
  },
  {
    identifier: "ar.muhammadjibreel",
    name: "Muhammad Jibreel",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.muhammadjibreel",
    fullSurahBaseUrl: "https://server8.mp3quran.net/jbrl",
  },
  {
    identifier: "ar.hanirifai",
    name: "Hani Ar-Rifai",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/64/ar.hanirifai",
    fullSurahBaseUrl: "https://server8.mp3quran.net/hani",
  },
  {
    identifier: "ar.saoodshuraym",
    name: "Saud Al-Shuraim",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/64/ar.saoodshuraym",
    fullSurahBaseUrl: "https://server7.mp3quran.net/shur",
  },
  {
    identifier: "ar.abdullahbasfar",
    name: "Abdullah Basfar",
    style: "Murattal",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/64/ar.abdullahbasfar",
    fullSurahBaseUrl: "https://server6.mp3quran.net/bsfr",
  },
  {
    identifier: "ar.aymanswoaid",
    name: "Ayman Sowaid",
    style: "Mu'allim",
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/64/ar.aymanswoaid",
  },
];

export const JUZ_PAGE_MAP: Record<number, number> = {
  1: 1, 2: 22, 3: 42, 4: 62, 5: 82,
  6: 102, 7: 121, 8: 142, 9: 162, 10: 182,
  11: 201, 12: 222, 13: 242, 14: 262, 15: 282,
  16: 302, 17: 322, 18: 342, 19: 362, 20: 382,
  21: 402, 22: 422, 23: 442, 24: 462, 25: 482,
  26: 502, 27: 522, 28: 542, 29: 562, 30: 582,
};

/**
 * The surahs people actually search for, in rough order of search demand.
 * Used to build internal links (e.g. from reciter profiles) on statically
 * rendered pages, so it deliberately carries its own names rather than
 * hitting the database.
 */
export const POPULAR_SURAHS: Array<{
  id: number;
  nameEn: string;
  nameAr: string;
}> = [
  { id: 1, nameEn: "Al-Fatihah", nameAr: "الفاتحة" },
  { id: 2, nameEn: "Al-Baqarah", nameAr: "البقرة" },
  { id: 18, nameEn: "Al-Kahf", nameAr: "الكهف" },
  { id: 36, nameEn: "Ya-Sin", nameAr: "يس" },
  { id: 55, nameEn: "Ar-Rahman", nameAr: "الرحمن" },
  { id: 56, nameEn: "Al-Waqi'ah", nameAr: "الواقعة" },
  { id: 67, nameEn: "Al-Mulk", nameAr: "الملك" },
  { id: 78, nameEn: "An-Naba", nameAr: "النبأ" },
  { id: 112, nameEn: "Al-Ikhlas", nameAr: "الإخلاص" },
  { id: 113, nameEn: "Al-Falaq", nameAr: "الفلق" },
  { id: 114, nameEn: "An-Nas", nameAr: "الناس" },
];

export const QURAN_CLOUD_API = "https://api.alquran.cloud/v1";
export const FAWAZ_API = "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist";
export const ALADHAN_API = "https://api.aladhan.com/v1";
