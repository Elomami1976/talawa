/**
 * Import Ayahs from Quran Cloud API into PostgreSQL
 *
 * Usage: npm run import:ayahs
 *
 * Fetches the full Quran text in Arabic (Uthmani script) and
 * simple (no diacritics) editions, then saves all 6236 ayahs.
 * Also sets up PostgreSQL full-text search vector.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const QURAN_CLOUD_API = "https://api.alquran.cloud/v1";
const BATCH_SIZE = 50;

interface ApiAyah {
  number: number;
  text: string;
  surah: { number: number };
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

async function fetchEdition(edition: string): Promise<ApiAyah[]> {
  console.log(`  Fetching edition: ${edition}...`);
  const response = await fetch(`${QURAN_CLOUD_API}/quran/${edition}`);
  if (!response.ok) {
    throw new Error(`API error ${response.status} for edition ${edition}`);
  }
  const data = await response.json();
  if (data.code !== 200) {
    throw new Error(`API code ${data.code}: ${data.status}`);
  }
  // API returns { data: { surahs: [{ number, ayahs: [...] }, ...] } }
  const surahs = data.data.surahs as Array<{
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

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function importAyahs(): Promise<void> {
  console.log("📖 Starting ayah import...");
  console.log("This will import 6236 ayahs. Please wait...\n");

  // Fetch both editions
  let arabicAyahs: ApiAyah[];
  let simpleAyahs: ApiAyah[];

  try {
    arabicAyahs = await fetchEdition("quran-uthmani");
    await sleep(1000);
    simpleAyahs = await fetchEdition("quran-simple-clean");
    console.log(`\n✅ Fetched ${arabicAyahs.length} Arabic ayahs`);
    console.log(`✅ Fetched ${simpleAyahs.length} simple ayahs\n`);
  } catch (err) {
    console.error("❌ Failed to fetch Quran data:", err);
    process.exit(1);
  }

  // Build a map for simple text lookup
  const simpleMap = new Map<number, string>();
  for (const ayah of simpleAyahs) {
    simpleMap.set(ayah.number, ayah.text);
  }

  const batches = chunkArray(arabicAyahs, BATCH_SIZE);
  let total = 0;
  let errors = 0;

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];

    await prisma.$transaction(
      batch.map((ayah) => {
        const isSajda =
          typeof ayah.sajda === "boolean"
            ? ayah.sajda
            : typeof ayah.sajda === "object" && ayah.sajda !== null;

        return prisma.ayah.upsert({
          where: { ayahKey: `${ayah.surah.number}:${ayah.numberInSurah}` },
          create: {
            surahId: ayah.surah.number,
            ayahNumber: ayah.numberInSurah,
            ayahKey: `${ayah.surah.number}:${ayah.numberInSurah}`,
            juz: ayah.juz,
            hizb: ayah.hizbQuarter,
            page: ayah.page,
            textAr: ayah.text,
            textSimple: simpleMap.get(ayah.number) || ayah.text,
            sajda: isSajda,
          },
          update: {
            textAr: ayah.text,
            textSimple: simpleMap.get(ayah.number) || ayah.text,
            juz: ayah.juz,
            hizb: ayah.hizbQuarter,
            page: ayah.page,
            sajda: isSajda,
          },
        });
      })
    );

    total += batch.length;
    const progress = Math.round((total / arabicAyahs.length) * 100);
    process.stdout.write(
      `\r⬛ Progress: ${total}/${arabicAyahs.length} ayahs (${progress}%)`
    );

    // Small delay to avoid overwhelming the DB
    if (batchIdx < batches.length - 1) {
      await sleep(50);
    }
  }

  console.log("\n\n🔍 Building full-text search vectors...");

  // Update search vectors using PostgreSQL's built-in FTS
  try {
    await prisma.$executeRaw`
      UPDATE ayahs
      SET search_vector = to_tsvector('arabic', text_simple)
      WHERE search_vector IS NULL
    `;
    console.log("✅ Arabic FTS vectors built");
  } catch {
    console.warn("⚠️  Could not build FTS vectors (migration may be needed)");
  }

  console.log("\n═══════════════════════════════");
  console.log(`✅ Ayah import complete!`);
  console.log(`📊 Total imported: ${total}`);
  console.log(`❌ Errors: ${errors}`);
  console.log("═══════════════════════════════");
}

importAyahs()
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
