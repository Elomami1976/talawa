const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const grouped = await p.translation.groupBy({
    by: ["language", "translator"],
    _count: { _all: true },
  });
  console.log("Translations in DB:");
  for (const g of grouped) {
    console.log(`  ${g.language} / ${g.translator}: ${g._count._all}`);
  }
  await p.$disconnect();
})();
