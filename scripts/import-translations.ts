/**
 * Import Translations from Quran Cloud API into PostgreSQL
 *
 * Usage: npm run import:translations
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const QURAN_CLOUD_API = "https://api.alquran.cloud/v1";
const BATCH_SIZE = 100;

interface ApiAyah {
  number: number;
  text: string;
  surah: { number: number };
  numberInSurah: number;
}

const EDITIONS_TO_IMPORT = [
  { identifier: "en.asad", language: "en", translator: "Muhammad Asad" },
  { identifier: "en.sahih", language: "en", translator: "Saheeh International" },
  { identifier: "en.pickthall", language: "en", translator: "Pickthall" },
  { identifier: "en.yusufali", language: "en", translator: "Yusuf Ali" },
  { identifier: "fr.hamidullah", language: "fr", translator: "Hamidullah" },
  { identifier: "de.aburida", language: "de", translator: "Abu Rida" },
  { identifier: "tr.diyanet", language: "tr", translator: "Diyanet İşleri" },
  { identifier: "ur.jalandhry", language: "ur", translator: "Fateh Muhammad Jalandhry" },
  { identifier: "ru.kuliev", language: "ru", translator: "Kuliev" },
  { identifier: "id.indonesian", language: "id", translator: "Indonesian MRA" },
];

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

async function fetchEdition(identifier: string): Promise<ApiAyah[]> {
  const res = await fetch(`${QURAN_CLOUD_API}/quran/${identifier}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${identifier}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(`API error for ${identifier}: ${json.status}`);
  const surahs = json.data.surahs as Array<{
    number: number;
    ayahs: Array<Omit<ApiAyah, "surah"> & { surah?: { number: number } }>;
  }>;
  const flat: ApiAyah[] = [];
  for (const s of surahs) {
    for (const a of s.ayahs) {
      flat.push({ ...a, surah: { number: s.number } } as ApiAyah);
    }
  }
  return flat;
}

async function importTranslations(): Promise<void> {
  console.log("🌍 Starting translation import...\n");

  // Pre-fetch all ayah IDs keyed by ayahKey
  console.log("Loading ayah IDs from database...");
  const allAyahs = await prisma.ayah.findMany({
    select: { id: true, ayahKey: true },
  });
  const ayahIdMap = new Map<string, number>();
  for (const a of allAyahs) ayahIdMap.set(a.ayahKey, a.id);
  console.log(`✅ Loaded ${ayahIdMap.size} ayah IDs\n`);

  for (const edition of EDITIONS_TO_IMPORT) {
    console.log(`\n📥 Importing: ${edition.identifier} (${edition.translator})`);

    let ayahs: ApiAyah[];
    try {
      ayahs = await fetchEdition(edition.identifier);
      console.log(`   Fetched ${ayahs.length} ayahs`);
    } catch (err) {
      console.error(`   ❌ Failed: ${err}`);
      await sleep(2000);
      continue;
    }

    const batches = chunk(ayahs, BATCH_SIZE);
    let count = 0;

    for (const batch of batches) {
      const records = batch
        .map((ayah) => {
          const key = `${ayah.surah.number}:${ayah.numberInSurah}`;
          const ayahId = ayahIdMap.get(key);
          if (!ayahId) return null;
          return {
            ayahId,
            language: edition.language,
            translator: edition.translator,
            text: ayah.text,
          };
        })
        .filter(Boolean) as {
          ayahId: number;
          language: string;
          translator: string;
          text: string;
        }[];

      if (records.length === 0) continue;

      // Upsert in batch using transaction
      await prisma.$transaction(
        records.map((r) =>
          prisma.translation.upsert({
            where: {
              ayahId_language_translator: {
                ayahId: r.ayahId,
                language: r.language,
                translator: r.translator,
              },
            },
            create: r,
            update: { text: r.text },
          })
        )
      );

      count += records.length;
      process.stdout.write(`\r   Progress: ${count}/${ayahs.length}`);
    }

    console.log(`\n   ✅ ${edition.identifier}: ${count} translations saved`);
    await sleep(1500); // Be nice to the API
  }

  // Build FTS vectors for English translations
  console.log("\n🔍 Building English translation FTS vectors...");
  try {
    await prisma.$executeRaw`
      UPDATE translations
      SET search_vector = to_tsvector('english', text)
      WHERE language = 'en' AND search_vector IS NULL
    `;
    console.log("✅ English FTS vectors built");
  } catch {
    console.warn("⚠️  Could not build FTS vectors");
  }

  console.log("\n═══════════════════════════════");
  console.log("✅ Translation import complete!");
  console.log("═══════════════════════════════");
}

importTranslations()
  .catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
