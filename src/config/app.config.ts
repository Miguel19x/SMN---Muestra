/**
 * Configuración Centralizada de la Aplicación
 * 
 * PORQUÉ:
 * - Un solo lugar para todos los valores de configuración
 * - Fácil de modificar sin tocar lógica de negocio
 * - Type-safe con TypeScript
 * - Validación de env vars al inicio
 */

import { z } from 'zod';

// ✅ Schema de validación para variables de entorno
const EnvSchema = z.object({
    // MongoDB
    MONGODB_URL: z.string().url('MONGODB_URL debe ser una URL válida'),

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
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PUBLIC_SITE_URL: z.string().url().optional(),
});

// ✅ Validar env vars al importar este módulo
// Usamos safeParse para evitar crash si .env no está cargado aún (desarrollo)
const parsed = EnvSchema.safeParse(process.env);

let env: z.infer<typeof EnvSchema>;

if (!parsed.success) {
    // En desarrollo, permitir que algunas vars no existan (se cargan después)
    if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Algunas variables de entorno no están configuradas:',
            parsed.error.issues.map(i => i.path.join('.')).join(', ')
        );
        // Usar valores parciales + defaults
        env = {
            MONGODB_URL: process.env.MONGODB_URL || '',
            NODE_ENV: 'development',
            ...process.env as any
        };
    } else {
        // En producción, fallar inmediatamente
        console.error('❌ Variables de entorno inválidas:', parsed.error.format());
        throw new Error('Configuración de entorno inválida');
    }
} else {
    env = parsed.data;
}

/**
 * ✅ MEJORA: Configuración de Base de Datos
 */
export const DATABASE_CONFIG = {
    URI: env.MONGODB_URL,
    POOL_SIZE: {
        MAX: 5,
        MIN: 1,
    },
    TIMEOUTS: {
        IDLE_MS: 10_000,              // 10 segundos
        SERVER_SELECTION_MS: 5_000,   // 5 segundos
        SOCKET_MS: 30_000,            // 30 segundos
    },
    RETRY: {
        MAX_ATTEMPTS: 3,
        DELAY_MS: 1000,
    },
    MAX_CONNECTION_AGE_MS: 5 * 60 * 1000, // 5 minutos
} as const;

/**
 * ✅ MEJORA: Configuración de MongoDB
 */
export const MONGODB_CONFIG = {
    URI: env.MONGODB_URL,
    OPTIONS: {
        bufferCommands: false,
        maxPoolSize: 5,
        minPoolSize: 1,
        maxIdleTimeMS: 10_000,       // 10 segundos
        serverSelectionTimeoutMS: 5_000,  // 5 segundos
        socketTimeoutMS: 30_000,      // 30 segundos
        family: 4,
        retryWrites: true,
        retryReads: true,
    },
    RETRY: {
        maxAttempts: 3,
        delayMs: 1000,
    },
    CONNECTION_AGE_THRESHOLD_MS: 5 * 60 * 1000, // 5 minutos
} as const;

/**
 * ✅ MEJORA: Configuración de R2
 */
export const R2_CONFIG = {
    ACCOUNT_ID: env.R2_ACCOUNT_ID,
    ACCESS_KEY_ID: env.R2_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: env.R2_SECRET_ACCESS_KEY,
    BUCKET_NAME: env.R2_BUCKET_NAME,
    REGION: 'auto',
    PUBLIC_URL: 'https://images.datatracker-demo.com',
} as const;

/**
 * ✅ MEJORA: Configuración de Redis/Cache
 */
export const CACHE_CONFIG = {
    TTL: {
        DESAPARECIDOS: 300,         // 5 minutos
        STATS: 600,                  // 10 minutos
        USER_SESSION: 86400,         // 24 horas
    },
    KEYS: {
        DESAPARECIDOS: (estado: string) => `objetos:${estado}`,
        STATS: () => 'stats:global',
        RATE_LIMIT: (ip: string, endpoint: string) => `ratelimit:${endpoint}:${ip}`,
    },
} as const;

/**
 * ✅ MEJORA: Configuración de Rate Limiting
 */
export const RATE_LIMIT_CONFIG = {
    // Endpoints públicos
    PUBLIC: {
        GET: {
            maxRequests: 100,
            windowMs: 60_000,  // 1 minuto
        },
        POST: {
            maxRequests: 10,
            windowMs: 60_000,  // 1 minuto
        },
    },

    // Endpoints admin
    ADMIN: {
        maxRequests: 200,
        windowMs: 60_000,
    },

    // API de búsqueda
    SEARCH: {
        maxRequests: 30,
        windowMs: 60_000,
    },
} as const;

/**
 * ✅ MEJORA: Configuración de Validación
 */
export const VALIDATION_CONFIG = {
    // Request limits
    MAX_REQUEST_SIZE_BYTES: 1_048_576,  // 1MB
    MAX_JSON_DEPTH: 10,

    // Field lengths
    MAX_STRING_LENGTH: {
        SHORT: 50,
        MEDIUM: 100,
        LONG: 500,
        TEXT: 1000,
        URL: 2000,
    },

    // Regex patterns
    PATTERNS: {
        CEDULA: /^[VE]?-?[\d.]{6,12}$/, // Acepta V/E opcional, guión opcional, dígitos con puntos opcionales
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        OBJECTID: /^[0-9a-fA-F]{24}$/,
        DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
    },

    // Valid values
    VALID_SEXO: ['Masculino', 'Femenino'] as const,
    VALID_EXTRANJERO: ['V', 'E'] as const,
    VALID_ESTADOS: ['pendiente', 'aprobado', 'rechazado'] as const,
} as const;

/**
 * ✅ MEJORA: Configuración de Seguridad
 */
export const SECURITY_CONFIG = {
    // CSP
    CSP: {
        DEFAULT_SRC: ["'self'"],
        SCRIPT_SRC: ["'self'", "'unsafe-inline'", "https://challenges.cloudflare.com"],
        STYLE_SRC: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        FONT_SRC: ["'self'", "https://fonts.gstatic.com"],
        IMG_SRC: ["'self'", "data:", "blob:", "https://*.cloudflare.com", "https://images.datatracker.com"],
        CONNECT_SRC: ["'self'", "https://*.upstash.io", "https://*.cloudflare.com"],
        FRAME_SRC: ["https://challenges.cloudflare.com"],
        FRAME_ANCESTORS: ["'none'"],
        BASE_URI: ["'self'"],
        FORM_ACTION: ["'self'"],
    },

    // Cookies
    COOKIE: {
        MAX_AGE_SECONDS: 86400,  // 24 horas
        SAME_SITE: 'Strict' as const,
        HTTP_ONLY: true,
        SECURE_IN_PRODUCTION: true,
    },

    // IDs públicos
    PUBLIC_ID: {
        ALGORITHM: 'base64url' as const,
        SALT: 'datatracker-2024',  // Cambiar en producción
    },
} as const;

/**
 * ✅ MEJORA: Configuración de Business Logic
 */
export const BUSINESS_CONFIG = {
    // Edades
    LEGAL_AGE: 18,
    AGE_STAGES: {
        INFANT: { min: 0, max: 2, label: 'Infante' },
        CHILD: { min: 3, max: 12, label: 'Niño/a' },
        TEEN: { min: 13, max: 17, label: 'Adolescente' },
        YOUNG_ADULT: { min: 18, max: 35, label: 'Adulto Joven' },
        ADULT: { min: 36, max: 64, label: 'Adulto' },
        SENIOR: { min: 65, max: Infinity, label: 'Adulto Mayor' },
    },

    // Solicitudes de retiro
    REMOVAL_REQUEST: {
        DEADLINE_DAYS: 7,
        MIN_REASON_LENGTH: 10,
        MAX_REASON_LENGTH: 1000,
    },

    // Etiquetas de color
    ETIQUETAS: ['blue', 'green'] as const,
} as const;

/**
 * ✅ NUEVO: Helper para verificar si estamos en producción
 */
export const isProduction = () => env.NODE_ENV === 'production';

/**
 * ✅ NUEVO: Helper para verificar si estamos en desarrollo
 */
export const isDevelopment = () => env.NODE_ENV === 'development';

/**
 * ✅ NUEVO: Export del env validado
 */
export { env };

/**
 * ✅ NUEVO: Export de types inferidos
 */
export type ValidSexo = typeof VALIDATION_CONFIG.VALID_SEXO[number];
export type ValidExtranjero = typeof VALIDATION_CONFIG.VALID_EXTRANJERO[number];
export type ValidEstado = typeof VALIDATION_CONFIG.VALID_ESTADOS[number];
export type ValidEtiqueta = typeof BUSINESS_CONFIG.ETIQUETAS[number];
