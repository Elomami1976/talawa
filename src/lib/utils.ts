import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a surah + ayah into an ayah key string like "1:1"
 */
export function formatAyahKey(surahId: number, ayahNumber: number): string {
  return `${surahId}:${ayahNumber}`;
}

/**
 * Parse an ayah key like "1:1" into [surahId, ayahNumber]
 */
export function parseAyahKey(key: string): [number, number] {
  const [surah, ayah] = key.split(":").map(Number);
  return [surah, ayah];
}

/**
 * Format a number as a padded 3-digit string for audio URL construction
 */
export function padAyahNumber(n: number): string {
  return String(n).padStart(3, "0");
}

/**
 * Build the audio URL for a reciter + ayah.
 *
 * Two CDN patterns are supported:
 *  - "global" (default, used by cdn.islamic.network):
 *      `{base}/{globalAyahNumber}.mp3`   where globalAyahNumber ∈ 1..6236
 *  - "surah-ayah" (used by everyayah.com):
 *      `{base}/{surah:03}{ayah:03}.mp3`
 *
 * `reciterIdOrBaseUrl` may be either a reciter identifier (e.g. "ar.alafasy")
 * or a full base URL.
 */
export function buildAudioUrl(
  reciterIdOrBaseUrl: string,
  globalAyahNumber: number,
  surahNumber?: number,
  ayahNumberInSurah?: number,
  format: "global" | "surah-ayah" = "global"
): string {
  const base = reciterIdOrBaseUrl.startsWith("http")
    ? reciterIdOrBaseUrl
    : `https://cdn.islamic.network/quran/audio/128/${reciterIdOrBaseUrl}`;
  if (format === "surah-ayah" && surahNumber && ayahNumberInSurah) {
    const s = String(surahNumber).padStart(3, "0");
    const a = String(ayahNumberInSurah).padStart(3, "0");
    return `${base}/${s}${a}.mp3`;
  }
  return `${base}/${globalAyahNumber}.mp3`;
}

/**
 * Format seconds into mm:ss display
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Convert a Western Arabic numeral string to Eastern Arabic numerals
 */
export function toArabicNumeral(n: number | string): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n)
    .split("")
    .map((d) => (/[0-9]/.test(d) ? arabicNumerals[parseInt(d)] : d))
    .join("");
}

/**
 * Debounce a function call
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => unknown,
  delay: number
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Truncate text to a given character limit with ellipsis
 */
export function truncateText(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + "…";
}

/**
 * Convert a juz number to its display name
 */
export function getJuzName(juz: number): string {
  const juzNames: Record<number, string> = {
    1: "Alif Lam Mim",
    2: "Sayaqool",
    3: "Tilkar Rusul",
    4: "Lan Tana Loo",
    5: "Wal Mohsanat",
    6: "La Yuhibbullah",
    7: "Wa Iza Samiu",
    8: "Wa Lau Annana",
    9: "Qalal Malao",
    10: "Wa Alamu",
    11: "Yatazeroon",
    12: "Wa Ma Min Dabbah",
    13: "Wa Ma Ubrioo",
    14: "Rubama",
    15: "Subhanallazi",
    16: "Qal Alam",
    17: "Aqtarabo",
    18: "Qad Aflaha",
    19: "Wa Qalallazina",
    20: "Amman Khalaq",
    21: "Utlu Ma Oohi",
    22: "Wa Manyaqnut",
    23: "Wa Mali",
    24: "Faman Azlam",
    25: "Elahe Yuruddo",
    26: "Ha Meem",
    27: "Qala Fama Khatbukum",
    28: "Qad Sami Allah",
    29: "Tabarakallazi",
    30: "Amma",
  };
  return juzNames[juz] || `Juz ${juz}`;
}

/**
 * Get the revelation type badge label
 */
export function getRevelationLabel(type: string): string {
  return type === "Meccan" ? "Meccan" : "Medinan";
}

/**
 * Sleep utility for import scripts
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Chunk an array into smaller arrays of given size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
