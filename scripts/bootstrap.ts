import { count, sql } from "drizzle-orm";

import { db } from "@/schema/db";
import { Model } from "@/schema/schema";

const models = [
  {
    id: "NousResearch/Meta-Llama-3.1-8B-Instruct",
    cpt: 1,
  },
];

const main = async () => {
  const [res] = await db.select({ count: count(Model.id) }).from(Model);
  if (res?.count === models.length) {
    console.log("Records already in db");
    return;
  }
  await db.delete(Model).where(sql`true`);
  await db.insert(Model).values(models);
  console.log("Bootstrap complete");
  return;
};
await main();
process.exit();
