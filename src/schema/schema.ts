import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

import { DEFAULT_CREDITS } from "@/constants";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz");
export const genId = {
  user: () => "u_" + nanoid(30),
  session: () => "s_" + nanoid(30),
  apikey: () => "sn4_" + nanoid(28),
  organicRequest: () => "oreq_" + nanoid(27),
};

export const ValidatorRequest = pgTable("validator_request", {
  r_nanoid: varchar("r_nanoid", { length: 48 }).primaryKey(),
  block: integer("block").notNull(),
  timestamp: timestamp("timestamp"),
  sampling_params: jsonb("sampling_params"),
  ground_truth: jsonb("ground_truth"),
  version: integer("version").notNull(),
});

export const MinerResponse = pgTable("miner_response", {
  id: serial("id").primaryKey(),
  r_nanoid: varchar("r_nanoid", { length: 48 }).notNull(),
  hotkey: varchar("hotkey", { length: 48 }).notNull(),
  coldkey: varchar("coldkey", { length: 48 }).notNull(),
  uid: integer("uid").notNull(),
  stats: jsonb("stats"),
});

export const User = pgTable("user", {
  id: varchar("id", {
    length: 32,
  }).primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  googleId: varchar("google_id", { length: 36 }).unique(),
  emailConfirmed: boolean("email_confirmed").notNull().default(true),
  password: varchar("password", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 32 }),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  credits: integer("credits").notNull().default(DEFAULT_CREDITS),
});

export const OrganicRequest = pgTable("organic_request", {
  id: serial("id").primaryKey(),
  pubId: varchar("pub_id"),
  userId: varchar("user_id", {
    length: 32,
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  creditsUsed: integer("credits_used").notNull().default(0),
  tokens: integer("tokens").notNull().default(0),
  request: jsonb("request").notNull(),
  response: text("response"),
  model: varchar("model_id", {
    length: 128,
  })
    .notNull()
    .references(() => Model.id),
  createdAt: timestamp("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  uid: integer("uid"),
  hotkey: varchar("hotkey"),
  coldkey: varchar("coldkey"),
  minerAddress: varchar("miner_address"),
  attempt: varchar("attempt"),
  metadata: jsonb("metadata"),
  scored: boolean("scored").default(false),
  jaro: real("jaro"),
});

export const ApiKey = pgTable("api_key", {
  key: varchar("id", {
    length: 32,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 32,
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
});

export const Session = pgTable("session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 32,
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const CheckoutSessions = pgTable("checkoutSessions", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 32,
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  credits: integer("credits").notNull().default(DEFAULT_CREDITS),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const Model = pgTable("model", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  miners: integer("miners").default(0).notNull(),
  success: integer("success").default(0).notNull(),
  failure: integer("failure").default(0).notNull(),
  cpt: integer("cpt").default(1).notNull(), // cpt: credits per token
  enabled: boolean("enabled").default(true),
});
