import { count, sql } from "drizzle-orm";

import { db } from "@/schema/db";
import { Models } from "@/schema/schema";

const models = [
  {
    id: "NousResearch/Meta-Llama-3.1-8B-Instruct",
    cpt: 1,
  },
];

const main = async () => {
  const [res] = await db.select({ count: count(Models.id) }).from(Models);
  if (res?.count === models.length) {
    console.log("Records already in db");
    return;
  }
  await db.delete(Models).where(sql`true`);
  await db.insert(Models).values(models);
  console.log("Bootstrap complete");
  return;
};
await main();
process.exit();
