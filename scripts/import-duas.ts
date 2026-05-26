/**
 * Downloads Hisn al-Muslim duas data from hisnmuslim.com API
 * and saves a single consolidated JSON file at src/data/duas.json
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

interface IndexItem {
  ID: number;
  TITLE: string;
  AUDIO_URL: string;
  TEXT: string;
}

interface DuaItem {
  ID: number;
  ARABIC_TEXT: string;
  TRANSLATED_TEXT?: string;
  TRANSLITERATED_TEXT?: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT?: string;
  REPEAT?: number | string;
  AUDIO?: string;
}

interface Category {
  id: number;
  title: string;
  audioUrl: string;
  duas: Array<{
    id: number;
    arabic: string;
    repeat: string;
    reference: string;
  }>;
}

const INDEX_URL = "https://www.hisnmuslim.com/api/ar/husn_ar.json";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const text = await res.text();
  // Strip BOM if present
  const cleaned = text.replace(/^\uFEFF/, "");
  return JSON.parse(cleaned) as T;
}

async function main() {
  console.log("Fetching index...");
  const indexRaw = await fetchJson<Record<string, IndexItem[]>>(INDEX_URL);
  const indexKey = Object.keys(indexRaw)[0];
  const items = indexRaw[indexKey];
  console.log(`Found ${items.length} categories`);

  const categories: Category[] = [];

  for (const item of items) {
    process.stdout.write(`  [${item.ID}] ${item.TITLE}... `);
    try {
      const catRaw = await fetchJson<Record<string, DuaItem[]>>(item.TEXT);
      const catKey = Object.keys(catRaw)[0];
      const duas = catRaw[catKey] || [];

      categories.push({
        id: item.ID,
        title: item.TITLE.trim(),
        audioUrl: item.AUDIO_URL,
        duas: duas.map((d) => ({
          id: d.ID,
          arabic: (d.ARABIC_TEXT || "").trim(),
          repeat: String(d.LANGUAGE_ARABIC_TRANSLATED_TEXT || d.REPEAT || "").trim(),
          reference: (d.TRANSLATED_TEXT || "").trim(),
        })),
      });
      console.log(`OK (${duas.length})`);
    } catch (err) {
      console.log(`FAIL ${(err as Error).message}`);
    }
  }

  // Sort by ID for stable order
  categories.sort((a, b) => a.id - b.id);

  const outDir = join(process.cwd(), "src", "data");
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, "duas.json");
  await writeFile(outPath, JSON.stringify(categories, null, 2), "utf8");
  console.log(`\nWrote ${categories.length} categories to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
