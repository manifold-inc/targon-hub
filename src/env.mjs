import { createEnv } from "@t3-oss/env-nextjs";
import { configDotenv } from "dotenv";
import { z } from "zod";

configDotenv({ path: "./../.env" });

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).optional(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_REDIRECT_URI: z.string(),

    DATABASE_HOST: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_USERNAME: z.string(),
    DATABASE_PASSWORD: z.string(),

    STRIPE_SECRET_KEY: z.string(),
    STRIPE_CREDIT_PRICE_ID: z.string(),
    STRIPE_PUBLISHABLE_KEY: z.string(),
    STRIPE_ENDPOINT_SECRET: z.string(),

    VERCEL_URL: z.string(),

    INFLUX_URL: z.string(),
    INFLUX_TOKEN: z.string(),
    INFLUX_ORG: z.string(),
    INFULX_BUCKET: z.string(),
  },
  client: {
    NEXT_PUBLIC_HUB_API_ENDPOINT: z.string(),
    NEXT_PUBLIC_DEPOSIT_ADDRESS: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    NEXT_PUBLIC_DEPOSIT_ADDRESS: process.env.NEXT_PUBLIC_DEPOSIT_ADDRESS,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_CREDIT_PRICE_ID: process.env.STRIPE_CREDIT_PRICE_ID,
    STRIPE_ENDPOINT_SECRET: process.env.STRIPE_ENDPOINT_SECRET,
    NEXT_PUBLIC_HUB_API_ENDPOINT: process.env.NEXT_PUBLIC_HUB_API_ENDPOINT,
    VERCEL_URL: process.env.VERCEL_ENV ?? "http://localhost:3000",
    INFLUX_URL: process.env.INFLUX_URL,
    INFLUX_TOKEN: process.env.INFLUX_TOKEN,
    INFLUX_ORG: process.env.INFLUX_ORG,
    INFULX_BUCKET: process.env.INFLUX_BUCKET,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
