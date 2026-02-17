import { z } from 'zod';

const EnvSchema = z.object({
  // MongoDB
  MONGODB_URL: z.string().url("MONGODB_URL debe ser una URL válida"),
  // R2 / Cloudflare
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  // Redis / Upstash
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  // Turnstile (Cloudflare CAPTCHA)
  TURNSTILE_SECRET_KEY: z.string().optional(),
  // App
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PUBLIC_SITE_URL: z.string().url().optional()
});
const parsed = EnvSchema.safeParse(process.env);
let env;
if (!parsed.success) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "⚠️ Algunas variables de entorno no están configuradas:",
      parsed.error.issues.map((i) => i.path.join(".")).join(", ")
    );
    env = {
      MONGODB_URL: process.env.MONGODB_URL || "",
      NODE_ENV: "development",
      ...process.env
    };
  } else {
    console.error("❌ Variables de entorno inválidas:", parsed.error.format());
    throw new Error("Configuración de entorno inválida");
  }
} else {
  env = parsed.data;
}
const DATABASE_CONFIG = {
  URI: env.MONGODB_URL,
  POOL_SIZE: {
    MAX: 5,
    MIN: 1
  },
  TIMEOUTS: {
    IDLE_MS: 1e4,
    // 10 segundos
    SERVER_SELECTION_MS: 5e3,
    // 5 segundos
    SOCKET_MS: 3e4
    // 30 segundos
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1e3
  },
  MAX_CONNECTION_AGE_MS: 5 * 60 * 1e3
  // 5 minutos
};
({
  URI: env.MONGODB_URL});
const R2_CONFIG = {
  ACCOUNT_ID: env.R2_ACCOUNT_ID,
  ACCESS_KEY_ID: env.R2_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: env.R2_SECRET_ACCESS_KEY,
  BUCKET_NAME: env.R2_BUCKET_NAME,
  REGION: "auto",
  PUBLIC_URL: "https://images.datatracker-demo.com"
};
const CACHE_CONFIG = {
  TTL: {
    DESAPARECIDOS: 300}};
const VALIDATION_CONFIG = {
  // Request limits
  MAX_REQUEST_SIZE_BYTES: 1048576,
  // Field lengths
  MAX_STRING_LENGTH: {
    SHORT: 50,
    MEDIUM: 100,
    LONG: 500,
    URL: 2e3
  },
  // Regex patterns
  PATTERNS: {
    CEDULA: /^[VE]?-?[\d.]{6,12}$/,
    DATE_ISO: /^\d{4}-\d{2}-\d{2}$/
  },
  VALID_ESTADOS: ["pendiente", "aprobado", "rechazado", "archivado"]
};
const SECURITY_CONFIG = {
  // IDs públicos
  PUBLIC_ID: {
    SALT: "datatracker-2024"
    // Cambiar en producción
  }
};
const BUSINESS_CONFIG = {
  // Solicitudes de retiro
  REMOVAL_REQUEST: {
    MIN_REASON_LENGTH: 10,
    MAX_REASON_LENGTH: 1e3
  }};

export { BUSINESS_CONFIG as B, CACHE_CONFIG as C, DATABASE_CONFIG as D, R2_CONFIG as R, SECURITY_CONFIG as S, VALIDATION_CONFIG as V };
