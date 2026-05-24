/**
 * Import Tafsir from Quran API (Fawaz Ahmed) into PostgreSQL
 *
 * Usage: npm run import:tafsir
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TAFSIR_API = "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir";
const BATCH_SIZE = 50;

const TAFSIRS_TO_IMPORT = [
  // NOTE: upstream repo uses the misspelled slug "en-tafisr-ibn-kathir".
  { slug: "en-tafisr-ibn-kathir", source: "en.ibn-kathir", language: "en" },
  { slug: "en-tafsir-maarif-ul-quran", source: "en.maariful-quran", language: "en" },
  { slug: "ar-tafsir-ibn-kathir", source: "ar.ibn-kathir", language: "ar" },
  { slug: "ar-tafsir-muyassar", source: "ar.muyassar", language: "ar" },
];

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

interface TafsirApiAyah {
  ayah: number;
  surah: number;
  text: string;
}

interface TafsirApiResponse {
  ayahs?: TafsirApiAyah[];
}

async function fetchTafsirForSurah(
  slug: string,
  surahId: number
): Promise<TafsirApiResponse | null> {
  const url = `${TAFSIR_API}/${slug}/${surahId}.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as TafsirApiResponse;
  } catch {
    return null;
  }
}

async function importTafsir(): Promise<void> {
  console.log("📚 Starting tafsir import...");
  console.log("Note: This imports tafsir for all 114 surahs. Takes ~10-15 minutes.\n");

  // Load ayah ID map
  console.log("Loading ayah IDs...");
  const allAyahs = await prisma.ayah.findMany({
    select: { id: true, ayahKey: true },
  });
  const ayahIdMap = new Map<string, number>();
  for (const a of allAyahs) ayahIdMap.set(a.ayahKey, a.id);
  console.log(`✅ Loaded ${ayahIdMap.size} ayah IDs\n`);

  for (const tafsir of TAFSIRS_TO_IMPORT) {
    console.log(`\n📖 Importing: ${tafsir.source}`);
    let totalCount = 0;

    for (let surahId = 1; surahId <= 114; surahId++) {
      const data = await fetchTafsirForSurah(tafsir.slug, surahId);
      if (!data || !Array.isArray(data.ayahs) || data.ayahs.length === 0) {
        process.stdout.write(`\r   Surah ${surahId}/114 - no data`);
        await sleep(100);
        continue;
      }

      const records: { ayahId: number; source: string; language: string; text: string }[] = [];

      for (const entry of data.ayahs) {
        const ayahNum = entry.ayah;
        if (!ayahNum || !entry.text) continue;
        const key = `${surahId}:${ayahNum}`;
        const ayahId = ayahIdMap.get(key);
        if (!ayahId) continue;
        records.push({
          ayahId,
          source: tafsir.source,
          language: tafsir.language,
          text: entry.text,
        });
      }

      const batches = chunk(records, BATCH_SIZE);
      for (const batch of batches) {
        await prisma.$transaction(
          batch.map((r) =>
            prisma.tafsir.upsert({
              where: { ayahId_source: { ayahId: r.ayahId, source: r.source } },
              create: r,
              update: { text: r.text },
            })
          )
        );
      }

      totalCount += records.length;
      process.stdout.write(
        `\r   Progress: Surah ${surahId}/114 | ${totalCount} tafsirs saved`
      );

      await sleep(200);
    }

    console.log(`\n   ✅ ${tafsir.source}: ${totalCount} tafsir entries saved`);
    await sleep(1000);
  }

  console.log("\n═══════════════════════════════");
  console.log("✅ Tafsir import complete!");
  console.log("═══════════════════════════════");
}

importTafsir()
  .catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
