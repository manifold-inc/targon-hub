import { sql } from "drizzle-orm";
import {
  boolean,
  int,
  json,
  mysqlTable,
  serial,
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
  credits: int("credits").notNull().default(DEFAULT_CREDITS),
  coldkey: varchar("coldkey", {length: 48})
});

export const Request = mysqlTable("request", {
  id: serial("id").primaryKey(),
  pubId: varchar("pub_id", { length: 32 }),
  userId: varchar("user_id", {
    length: 32,
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  creditsUsed: int("credits_used").notNull().default(0),
  tokens: int("tokens").notNull().default(0),
  request: json("request").notNull(),
  response: json("response"),
  model: varchar("model_id", {
    length: 128,
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
});

export const ApiKey = mysqlTable("api_key", {
  key: varchar("id", {
    length: 32,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 32,
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
});

export const Session = mysqlTable("session", {
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

export const CheckoutSessions = mysqlTable("checkoutSessions", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 32,
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  credits: int("credits").notNull().default(DEFAULT_CREDITS),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const Model = mysqlTable("model", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  miners: int("miners").default(0).notNull(),
  success: int("success").default(0).notNull(),
  failure: int("failure").default(0).notNull(),
  cpt: int("cpt").default(1).notNull(), // cpt: credits per token
  enabled: boolean("enabled").default(true),
});
