import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env.mjs";
import { LuciaAdapter } from "./lucia_adapter";
import { Session, User } from "./schema";

let connection: postgres.Sql;

if (process.env.NODE_ENV === "production") {
  connection = postgres(env.DATABASE_URL, { prepare: false });
} else {
  const globalConnection = global as typeof globalThis & {
    connection: postgres.Sql;
  };

  if (!globalConnection.connection) {
    globalConnection.connection = postgres(env.DATABASE_URL, {
      prepare: false,
    });
  }

  connection = globalConnection.connection;
}

export const db = drizzle(connection);
export const adapter = new LuciaAdapter(db, Session, User);
