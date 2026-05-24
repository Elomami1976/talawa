// ============================================
// Surah Types
// ============================================
export interface Surah {
  id: number;
  nameAr: string;
  nameEn: string;
  nameTrans: string;
  englishTranslation: string;
  revelationType: "Meccan" | "Medinan";
  ayahCount: number;
  chronologicalOrder: number;
  rukuCount: number;
  sajdaCount: number;
}

// ============================================
// Ayah Types
// ============================================
export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  ayahKey: string;
  juz: number;
  hizb: number;
  page: number;
  textAr: string;
  textSimple: string;
  sajda: boolean;
  surah?: Pick<Surah, "id" | "nameAr" | "nameEn" | "ayahCount">;
  translations?: Translation[];
  tafsirs?: Tafsir[];
}

export interface AyahWithDetails extends Ayah {
  translations: Translation[];
  tafsirs: Tafsir[];
}

// ============================================
// Translation Types
// ============================================
export interface Translation {
  id: number;
  ayahId: number;
  language: string;
  translator: string;
  text: string;
}

export interface TranslationOption {
  key: string; // e.g. "en.asad"
  language: string;
  translator: string;
  languageName: string;
}

// ============================================
// Tafsir Types
// ============================================
export interface Tafsir {
  id: number;
  ayahId: number;
  source: string;
  language: string;
  text: string;
}

export interface TafsirOption {
  key: string;
  name: string;
  language: string;
}

// ============================================
// Reciter Types
// ============================================
export interface Reciter {
  id: number;
  identifier: string;
  name: string;
  style: string;
  language: string;
  audioBaseUrl: string;
  format: string;
  isDefault: boolean;
}

// ============================================
// Local Bookmark Types (stored in localStorage)
// ============================================
export interface LocalBookmark {
  ayahId: number;
  ayahKey: string;
  surahId: number;
  ayahNumber: number;
  surahNameEn: string;
  surahNameAr: string;
  textAr: string;
  translation?: string;
  note?: string;
  createdAt: string;
}

// ============================================
// Local Reading Progress Types (stored in localStorage)
// ============================================
export interface LocalReadingProgress {
  surahId: number;
  ayahNumber: number;
  lastReadAt: string;
}

// ============================================
// User Settings Types (stored in localStorage)
// ============================================
export interface UserSettings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  arabicFontSize: "medium" | "large" | "xlarge" | "2xlarge";
  defaultTranslation: string;
  defaultReciter: string;
  displayMode: "page" | "continuous";
  showTranslation: boolean;
  showTafsir: boolean;
  autoPlayNext: boolean;
}

// ============================================
// Prayer Times Types
// ============================================
export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  [key: string]: string;
}

export interface PrayerTimesData {
  timings: PrayerTimes;
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string; ar: string };
      month: { number: number; en: string; ar: string };
      year: string;
      designation: { abbreviated: string; expanded: string };
      holidays: string[];
    };
    gregorian: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string };
      month: { number: number; en: string };
      year: string;
      designation: { abbreviated: string; expanded: string };
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
    };
  };
}

// ============================================
// Search Types
// ============================================
export interface SearchResult {
  ayahId: number;
  ayahKey: string;
  surahId: number;
  surahNameEn: string;
  surahNameAr: string;
  ayahNumber: number;
  textAr: string;
  textSimple: string;
  translation?: string;
  relevance?: number;
}

export interface SearchParams {
  query: string;
  language?: string;
  translator?: string;
  surahId?: number;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
  query: string;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Audio Player Types
// ============================================
export interface AudioQueueItem {
  key: string;
  number: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentAyahKey: string | null;
  currentAyahNumber: number | null;
  reciterId: string;
  duration: number;
  currentTime: number;
  volume: number;
  isLoading: boolean;
  isRepeat: boolean;
  autoPlay: boolean;
  playQueue: AudioQueueItem[];
  playQueueIndex: number | null;
}

// ============================================
// Navigation Types
// ============================================
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================
// Quran API types (for import scripts)
// ============================================
export interface QuranApiSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface QuranApiAyah {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface QuranApiEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string | null;
}
