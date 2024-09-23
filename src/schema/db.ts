import { env } from "@/env.mjs";
import { LuciaAdapter } from "./lucia_adapter";
import { Session, User } from "./schema";
import { Client } from '@planetscale/database'
import { drizzle } from 'drizzle-orm/planetscale-serverless'

const client = new Client({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD
})

export const db = drizzle(client)
export const adapter = new LuciaAdapter(db, Session, User);
export type DB = typeof db
