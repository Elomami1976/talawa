const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const s = await p.surah.count();
  const a = await p.ayah.count();
  const t = await p.translation.count();
  const r = await p.reciter.count();
  console.log({ surahs: s, ayahs: a, translations: t, reciters: r });
  await p.$disconnect();
})();
