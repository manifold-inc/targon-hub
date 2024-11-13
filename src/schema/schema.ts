import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  float,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { customAlphabet } from "nanoid";

import { DEFAULT_CREDITS } from "@/constants";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz");
export const genId = {
  user: () => "u_" + nanoid(30),
  session: () => "s_" + nanoid(30),
  apikey: () => "sn4_" + nanoid(28),
  request: () => "oreq_" + nanoid(27),
};

export const User = mysqlTable("user", {
  id: serial("id").primaryKey(),
  pubId: varchar("pub_id", {
    length: 32,
  }).unique(),
  email: varchar("email", { length: 255 }).unique(),
  googleId: varchar("google_id", { length: 36 }).unique(),
  verified: boolean("verified").notNull().default(true),
  password: varchar("password", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 32 }),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  credits: bigint("credits", { mode: "number", unsigned: true })
    .notNull()
    .default(DEFAULT_CREDITS),
  ss58: varchar("ss58", { length: 48 }),
  challenge: varchar("challenge", { length: 48 }),
});

const ENDPOINTS = ["CHAT", "COMPLETION"] as const;

export const Request = mysqlTable("request", {
  id: serial("id").primaryKey(),
  pubId: varchar("pub_id", { length: 32 }),
  userId: bigint("user_id", {
    unsigned: true,
    mode: "number",
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  creditsUsed: int("credits_used").notNull().default(0),
  tokens: int("tokens").notNull().default(0),
  request: json("request").notNull(),
  response: json("response"),
  model: bigint("model_id", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => Model.id),
  createdAt: timestamp("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  uid: int("uid"),
  hotkey: varchar("hotkey", { length: 48 }),
  coldkey: varchar("coldkey", { length: 48 }),
  minerAddress: varchar("miner_address", { length: 48 }),
  attempt: int("attempt"),
  metadata: json("metadata"),
  scored: boolean("scored").default(false),
  endpoint: mysqlEnum("endpoint", ENDPOINTS).notNull(),
});

export const ApiKey = mysqlTable("api_key", {
  key: varchar("id", {
    length: 32,
  }).primaryKey(),
  userId: bigint("user_id", {
    unsigned: true,
    mode: "number",
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const Session = mysqlTable("session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: bigint("user_id", {
    unsigned: true,
    mode: "number",
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const CheckoutSession = mysqlTable("checkout_sessions", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: bigint("user_id", {
    unsigned: true,
    mode: "number",
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  credits: bigint("credits", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  cardLast4: varchar("card_last4", { length: 4 }),
  cardBrand: varchar("card_brand", { length: 20 }),
});

export const TaoTransfers = mysqlTable("tao_transfers", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", {
    unsigned: true,
    mode: "number",
  }).references(() => User.id, { onDelete: "cascade" }),
  credits: bigint("credits", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  rao: float("rao").notNull(),
  block_hash: varchar("block_hash", { length: 255 }),
  tx_hash: varchar("tx_hash", { length: 255 }),
  priced_at: float("priced_at"),
  success: boolean("success").default(true),
});

const MODALITIES = ["text-generation", "text-to-image"] as const;

export const Model = mysqlTable("model", {
  id: serial("id").primaryKey(),
  name: varchar("name", {
    length: 128,
  }).unique(),
  miners: int("miners").default(0).notNull(),
  success: int("success").default(0).notNull(),
  failure: int("failure").default(0).notNull(),
  cpt: int("cpt").default(1).notNull(), // cpt: credits per token
  enabled: boolean("enabled").default(false),
  createdAt: timestamp("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  requiredGpus: int("required_gpus").default(0).notNull(),
  modality: mysqlEnum("modality", MODALITIES).notNull(),
  description: text("description").default("No description provided"),
  supportedEndpoints: json("supported_endpoints").notNull().$type<string[]>(),
  enabledDate: timestamp("enabled_date", { mode: "date" }),
});
