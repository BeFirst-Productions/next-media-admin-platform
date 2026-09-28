import "dotenv/config";
import { z } from "zod";

/**
 * All environment variables are validated at boot time.
 * If anything required is missing/invalid, the process fails fast
 * with a clear message instead of crashing later at random.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default("/api/v1"),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 chars"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 chars"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(20).default(12),

  SUPERADMIN_EMAIL: z.string().email().default("superadmin@next.com"),
  SUPERADMIN_PASSWORD: z.string().min(6).default("Admin@12345"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),

  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const fieldErrors = parsed.error.flatten().fieldErrors;
  // eslint-disable-next-line no-console
  console.error("\n  ╭────────────────────────────────────────────────────────────────────────────╮");
  // eslint-disable-next-line no-console
  console.error("  │  [FAILED] INVALID ENVIRONMENT CONFIGURATION                                │");
  // eslint-disable-next-line no-console
  console.error("  ├────────────────────────────────────────────────────────────────────────────┤");
  // eslint-disable-next-line no-console
  console.error("  │  The following environment variables failed validation at boot:            │");
  // eslint-disable-next-line no-console
  console.error("  │                                                                            │");
  for (const [field, errors] of Object.entries(fieldErrors)) {
    const errorMsg = (errors ?? []).join("; ");
    const line = `  • ${field.padEnd(25)} : ${errorMsg}`;
    // eslint-disable-next-line no-console
    console.error(`  │  ${line.padEnd(72).slice(0, 72)}  │`);
  }
  // eslint-disable-next-line no-console
  console.error("  │                                                                            │");
  // eslint-disable-next-line no-console
  console.error("  │  Please check your apps/api/.env file and provide the required values.     │");
  // eslint-disable-next-line no-console
  console.error("  ╰────────────────────────────────────────────────────────────────────────────╯\n");
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === "production";
export const isDev = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";
