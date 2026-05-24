/**
 * Import Surahs from Quran Cloud API into PostgreSQL
 *
 * Usage: npm run import:surahs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const QURAN_CLOUD_API = "https://api.alquran.cloud/v1";

interface ApiSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

async function fetchSurahs(): Promise<ApiSurah[]> {
  const response = await fetch(`${QURAN_CLOUD_API}/surah`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (data.code !== 200) {
    throw new Error(`API returned code ${data.code}: ${data.status}`);
  }
  return data.data as ApiSurah[];
}

// Chronological order of revelation (Meccan/Medinan sequence)
const CHRONOLOGICAL_ORDER: Record<number, number> = {
  96: 1, 68: 2, 73: 3, 74: 4, 1: 5, 111: 6, 81: 7, 87: 8, 92: 9, 89: 10,
  93: 11, 94: 12, 103: 13, 100: 14, 108: 15, 102: 16, 107: 17, 109: 18,
  105: 19, 113: 20, 114: 21, 112: 22, 53: 23, 80: 24, 97: 25, 91: 26,
  85: 27, 95: 28, 106: 29, 101: 30, 75: 31, 104: 32, 77: 33, 50: 34,
  90: 35, 86: 36, 54: 37, 38: 38, 7: 39, 72: 40, 36: 41, 25: 42, 35: 43,
  19: 44, 20: 45, 56: 46, 26: 47, 27: 48, 28: 49, 17: 50, 10: 51, 11: 52,
  12: 53, 15: 54, 6: 55, 37: 56, 31: 57, 34: 58, 39: 59, 40: 60, 41: 61,
  42: 62, 43: 63, 44: 64, 45: 65, 46: 66, 51: 67, 88: 68, 18: 69, 16: 70,
  71: 71, 14: 72, 21: 73, 23: 74, 32: 75, 52: 76, 67: 77, 69: 78, 70: 79,
  78: 80, 79: 81, 82: 82, 84: 83, 30: 84, 29: 85, 83: 86, 2: 87, 8: 88,
  3: 89, 33: 90, 60: 91, 4: 92, 99: 93, 57: 94, 47: 95, 13: 96, 55: 97,
  76: 98, 65: 99, 98: 100, 59: 101, 24: 102, 22: 103, 63: 104, 58: 105,
  49: 106, 66: 107, 64: 108, 61: 109, 62: 110, 48: 111, 5: 112, 9: 113,
  110: 114,
};

async function importSurahs(): Promise<void> {
  console.log("🕌 Starting surah import...");

  let surahs: ApiSurah[];
  try {
    surahs = await fetchSurahs();
    console.log(`✅ Fetched ${surahs.length} surahs from API`);
  } catch (err) {
    console.error("❌ Failed to fetch surahs:", err);
    process.exit(1);
  }

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const surah of surahs) {
    try {
      // Normalize name_trans: extract transliteration from englishName
      // e.g. "Al-Faatiha" => "Al-Fatihah"
      const nameTrans = surah.englishName;

      await prisma.surah.upsert({
        where: { id: surah.number },
        create: {
          id: surah.number,
          nameAr: surah.name,
          nameEn: surah.englishName,
          nameTrans,
          englishTranslation: surah.englishNameTranslation,
          revelationType: surah.revelationType,
          ayahCount: surah.numberOfAyahs,
          chronologicalOrder: CHRONOLOGICAL_ORDER[surah.number] ?? surah.number,
          rukuCount: 0,
          sajdaCount: 0,
        },
        update: {
          nameAr: surah.name,
          nameEn: surah.englishName,
          nameTrans,
          englishTranslation: surah.englishNameTranslation,
          revelationType: surah.revelationType,
          ayahCount: surah.numberOfAyahs,
          chronologicalOrder: CHRONOLOGICAL_ORDER[surah.number] ?? surah.number,
        },
      });

      const isNew = !(await prisma.surah.findUnique({ where: { id: surah.number } }));
      if (isNew) {
        created++;
      } else {
        updated++;
      }

      process.stdout.write(`\r📖 Processing surah ${surah.number}/114...`);
    } catch (err) {
      console.error(`\n❌ Error on surah ${surah.number}:`, err);
      errors++;
    }
  }

  console.log("\n");
  console.log("═══════════════════════════════");
  console.log(`✅ Import complete!`);
  console.log(`📊 Stats:`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Errors:  ${errors}`);
  console.log("═══════════════════════════════");
}

importSurahs()
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
