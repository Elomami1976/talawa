/**
 * Prayer times utilities using AlAdhan API
 */

import type { PrayerTimesData } from "@/types";

const ALADHAN_BASE = "https://api.aladhan.com/v1";

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  date?: string,
  method = 2
): Promise<PrayerTimesData> {
  const today = date || new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  const url = `${ALADHAN_BASE}/timings/${today}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache 1 hour
  });

  if (!response.ok) {
    throw new Error(`AlAdhan API error: ${response.status}`);
  }

  const json = await response.json();
  return json.data as PrayerTimesData;
}

export async function fetchPrayerTimesByCity(
  city: string,
  country: string,
  date?: string,
  method = 2
): Promise<PrayerTimesData> {
  const url = `${ALADHAN_BASE}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`AlAdhan API error: ${response.status}`);
  }

  const json = await response.json();
  return json.data as PrayerTimesData;
}

export const PRAYER_METHODS = [
  { id: 1, name: "University of Islamic Sciences, Karachi" },
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 3, name: "Muslim World League" },
  { id: 4, name: "Umm Al-Qura University, Makkah" },
  { id: 5, name: "Egyptian General Authority of Survey" },
  { id: 7, name: "Institute of Geophysics, University of Tehran" },
  { id: 8, name: "Gulf Region" },
  { id: 9, name: "Kuwait" },
  { id: 10, name: "Qatar" },
  { id: 11, name: "Majlis Ugama Islam Singapura, Singapore" },
  { id: 12, name: "Union Organization Islamic de France" },
  { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
  { id: 14, name: "Spiritual Administration of Muslims of Russia" },
] as const;

export const PRAYER_NAMES: Record<string, string> = {
  Fajr: "Fajr",
  Sunrise: "Sunrise",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
  Midnight: "Midnight",
};

export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

function minutesUntil(targetMinutes: number, currentMinutes: number): string {
  let diff = targetMinutes - currentMinutes;
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function getNextPrayer(
  timings: Record<string, string>
): { name: PrayerName; time: string; timeUntil: string } | null {
  const prayerKeys: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const key of prayerKeys) {
    const timeStr = timings[key];
    if (!timeStr) continue;
    const [hours, minutes] = timeStr.replace(" (UTC+3)", "").split(":").map(Number);
    const prayerMinutes = hours * 60 + minutes;
    if (prayerMinutes > currentMinutes) {
      return { name: key, time: timeStr, timeUntil: minutesUntil(prayerMinutes, currentMinutes) };
    }
  }

  // Wrap to next day Fajr
  const fajrStr = timings["Fajr"] || "";
  const [fh, fm] = fajrStr.split(":").map(Number);
  const fajrMinutes = (fh || 0) * 60 + (fm || 0);
  return { name: "Fajr", time: fajrStr, timeUntil: minutesUntil(fajrMinutes + 24 * 60, currentMinutes) };
}

export function formatPrayerTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
}
