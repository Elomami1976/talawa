/**
 * Verify that audio URL for each reciter is reachable.
 * Tests ayah 1 (Bismillah of Al-Fatiha) and ayah 6236 (last) for each.
 *
 * Usage: node scripts/verify-audio.mjs
 */

const RECITERS = [
  { id: "ar.yasseraldossari",  base: "https://cdn.islamic.network/quran/audio/128/ar.yasseraldossari" },
  { id: "ar.mahermuaiqly",     base: "https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly" },
  { id: "ar.saadalghamdi",     base: "https://cdn.islamic.network/quran/audio/128/ar.saadalghamdi" },
  { id: "ar.shaatree",         base: "https://cdn.islamic.network/quran/audio/128/ar.shaatree" },
  { id: "ar.minshawi",         base: "https://cdn.islamic.network/quran/audio/128/ar.minshawi" },
  { id: "ar.alafasy",          base: "https://cdn.islamic.network/quran/audio/128/ar.alafasy" },
  { id: "ar.husary",           base: "https://cdn.islamic.network/quran/audio/128/ar.husary" },
  { id: "ar.husarymujawwad",   base: "https://cdn.islamic.network/quran/audio/128/ar.husarymujawwad" },
  { id: "ar.abdulsamad",       base: "https://cdn.islamic.network/quran/audio/64/ar.abdulsamad" },
  { id: "ar.abdurrahmaansudais", base: "https://cdn.islamic.network/quran/audio/64/ar.abdurrahmaansudais" },
  { id: "ar.hudhaify",         base: "https://cdn.islamic.network/quran/audio/128/ar.hudhaify" },
  { id: "ar.ahmedajamy",       base: "https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy" },
  { id: "ar.muhammadayyoub",   base: "https://cdn.islamic.network/quran/audio/128/ar.muhammadayyoub" },
  { id: "ar.muhammadjibreel",  base: "https://cdn.islamic.network/quran/audio/128/ar.muhammadjibreel" },
  { id: "ar.hanirifai",        base: "https://cdn.islamic.network/quran/audio/64/ar.hanirifai" },
  { id: "ar.saoodshuraym",     base: "https://cdn.islamic.network/quran/audio/64/ar.saoodshuraym" },
  { id: "ar.abdullahbasfar",   base: "https://cdn.islamic.network/quran/audio/64/ar.abdullahbasfar" },
  { id: "ar.aymanswoaid",      base: "https://cdn.islamic.network/quran/audio/64/ar.aymanswoaid" },
];

// Ayahs to test:
// - 1 (Al-Fatiha 1:1)
// - 6 (Al-Fatiha 1:6 — middle of opener)
// - 3000 (mid-Quran sample)
// - 6236 (last ayah - An-Nas 114:6)
const TEST_AYAHS = [1, 6, 3000, 6236];

async function head(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
    clearTimeout(t);
    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  }
}

async function verify() {
  console.log(`🎧 Verifying ${RECITERS.length} reciters × ${TEST_AYAHS.length} ayahs = ${RECITERS.length * TEST_AYAHS.length} requests\n`);

  const failed = [];
  for (const r of RECITERS) {
    const results = await Promise.all(
      TEST_AYAHS.map((a) => head(`${r.base}/${a}.mp3`).then((x) => ({ a, ...x })))
    );
    const okCount = results.filter((x) => x.ok).length;
    const flag = okCount === results.length ? "✅" : okCount === 0 ? "❌" : "⚠️ ";
    console.log(`${flag} ${r.id.padEnd(26)} ${okCount}/${results.length}`);
    if (okCount < results.length) {
      const bad = results.filter((x) => !x.ok);
      bad.forEach((b) => console.log(`     ↳ ayah ${b.a}: HTTP ${b.status}${b.error ? ` (${b.error})` : ""}`));
      failed.push({ id: r.id, bad });
    }
  }

  console.log("\n═══════════════════════════════");
  if (failed.length === 0) {
    console.log(`✅ All ${RECITERS.length} reciters work for every tested ayah.`);
  } else {
    console.log(`❌ ${failed.length} reciter(s) had failures:`);
    failed.forEach((f) => console.log(`   - ${f.id}`));
  }
  console.log("═══════════════════════════════");
}

verify();
