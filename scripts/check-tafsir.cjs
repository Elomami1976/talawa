const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const c = await p.tafsir.count();
  const sample = await p.tafsir.findMany({ take: 3 });
  console.log("tafsir count:", c);
  console.log("sample:", JSON.stringify(sample, null, 2));
  await p.$disconnect();
})();
