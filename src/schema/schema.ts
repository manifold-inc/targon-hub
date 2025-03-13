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
  usedCredits: bigint("used_credits", {
    mode: "number",
    unsigned: true,
  }).notNull().default(0),
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
  scored: boolean("scored").default(false),
  endpoint: mysqlEnum("endpoint", ENDPOINTS).notNull(),
  success: boolean("success").notNull().default(false),
  modelName: varchar("model_name", { length: 64 }),
  totalTime: int("total_time"),
  timeToFirstToken: int("time_to_first_token"),
  responseTokens: int("response_tokens"),
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
  name: varchar("name", { length: 128 }),
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

export const ModelSubscription = mysqlTable("model_subscription", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", {
    unsigned: true,
    mode: "number",
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  modelId: bigint("model_id", {
    unsigned: true,
    mode: "number",
  })
    .notNull()
    .references(() => Model.id),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 255,
  }).notNull(),
  status: mysqlEnum("status", [
    "incomplete", // Initial state when subscription is being set up
    "incomplete_expired", // Failed to complete setup
    "active", // Successfully paying
    "past_due", // Payment failed but retrying
    "canceled", // Subscription ended
  ]).notNull(),
  gpuCount: int("gpu_count").notNull(),
  currentPeriodStart: timestamp("current_period_start", {
    mode: "date",
  }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }).notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  priceId: varchar("price_id", { length: 255 }).notNull(),
  defaultPaymentMethod: varchar("default_payment_method", { length: 255 }),
  latestInvoice: varchar("latest_invoice", { length: 255 }),
  collectionMethod: mysqlEnum("collection_method", [
    "charge_automatically",
    "send_invoice",
  ]).default("charge_automatically"),
  createdAt: timestamp("created_at", { mode: "date" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
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

export const MODALITIES = ["text-generation", "text-to-image"] as const;

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
  modality: mysqlEnum("modality", MODALITIES),
  description: text("description").default("No description provided"),
  supportedEndpoints: json("supported_endpoints").notNull().$type<string[]>(),
  enabledDate: timestamp("enabled_date", { mode: "date" }),
  customBuild: boolean("custom_build").default(false),
  forceEnabled: boolean("force_enabled").default(false).notNull(),
  supported: boolean("supported").default(true).notNull(),
  contextLength: int("context_length"),
  fallbackServer: varchar("fallback_server", { length: 48 }),
});

export const DailyModelTokenCounts = mysqlTable("daily_model_token_counts", {
  id: serial("id").primaryKey(),
  modelName: varchar("model_name", { length: 64 }).notNull(),
  totalTokens: bigint("total_tokens", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  avgTPS: float("avg_tps").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
});

export const ModelLeasing = mysqlTable("model_leasing", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", {
    unsigned: true,
    mode: "number",
  })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  modelName: varchar("model_name", { length: 64 }).notNull(),
  amount: bigint("amount", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  type: mysqlEnum("type", ["onetime", "subscription"])
    .notNull()
    .default("onetime"),
  invoiceId: varchar("invoice_id", { length: 255 }),
});
