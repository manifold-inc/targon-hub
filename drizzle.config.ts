import { defineConfig } from "drizzle-kit";

import { env } from "@/env.mjs";

const url = new URL(`https://${env.DATABASE_HOST}/${env.DATABASE_NAME}`);
url.password = env.DATABASE_PASSWORD;
url.username = env.DATABASE_USERNAME;
url.searchParams.set("rejectUnathorized", "true");

export default defineConfig({
  verbose: true,
  dialect: "mysql",
  schema: "./src/schema/schema.ts",
  dbCredentials: {
    url: url.toString(),
  },
});
