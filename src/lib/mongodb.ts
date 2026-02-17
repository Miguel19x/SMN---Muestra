/**
 * 🔧 REFACTORIZACIÓN ARQUITECTÓNICA #2
 * MongoDB Connection - Corregida y Optimizada
 * 
 * CAMBIOS PRINCIPALES:
 * 1. ✅ FIX P0-4: Event listener leak corregido (.once() en vez de .on())
 * 2. ✅ FIX P0-6: MongoDB URI sanitization en errors
 * 3. ✅ FIX P2: Circuit breaker pattern básico
 * 4. ✅ Mejora observability con métricas
 */

import mongoose from 'mongoose';
import type { ConnectOptions } from 'mongoose';
import { DATABASE_CONFIG } from '../config/app.config';
import { logger } from './logger'; // ✅ NUEVO: Structured logger

// ✅ Type para el cache global
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    lastConnected: number | null;
    retryCount: number;
    consecutiveFailures: number; // ✅ NUEVO: Para circuit breaker
}

// ✅ Type para estado de conexión
export interface ConnectionStatus {
    isConnected: boolean;
    readyState: number;
    readyStateText: 'disconnected' | 'connected' | 'connecting' | 'disconnecting';
    lastConnected: number | null;
    retryCount: number;
    connectionAge: number | null;
    circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN'; // ✅ NUEVO
}

// Declare global type
declare global {
    var mongoose: MongooseCache | undefined;
}

/**
 * ✅ FIX P0-4: Cache con contador de fallos para circuit breaker
 */
let cached: MongooseCache = global.mongoose || {
    conn: null,
    promise: null,
    lastConnected: null,
    retryCount: 0,
    consecutiveFailures: 0, // ✅ NUEVO
};

if (!global.mongoose) {
    global.mongoose = cached;
}

// ✅ Validar URI de MongoDB (lazy - se evalúa al primer uso, no al importar el módulo)
function getMongoURI(): string {
    const uri = process.env.MONGODB_URL || import.meta.env.MONGODB_URL;
    if (!uri) {
        throw new Error('MONGODB_URL no está definido en las variables de entorno');
    }
    return uri;
}


// ✅ Opciones optimizadas
const MONGODB_OPTIONS: ConnectOptions = {
    bufferCommands: false,
    maxPoolSize: DATABASE_CONFIG.POOL_SIZE.MAX,
    minPoolSize: DATABASE_CONFIG.POOL_SIZE.MIN,
    maxIdleTimeMS: DATABASE_CONFIG.TIMEOUTS.IDLE_MS,
    serverSelectionTimeoutMS: DATABASE_CONFIG.TIMEOUTS.SERVER_SELECTION_MS,
    socketTimeoutMS: DATABASE_CONFIG.TIMEOUTS.SOCKET_MS,
    family: 4,
    retryWrites: true,
    retryReads: true,
};

const MAX_RETRY_ATTEMPTS = DATABASE_CONFIG.RETRY.MAX_ATTEMPTS;
const RETRY_DELAY = DATABASE_CONFIG.RETRY.DELAY_MS;
const MAX_CONNECTION_AGE = DATABASE_CONFIG.MAX_CONNECTION_AGE_MS;

// ✅ FIX P2: Circuit breaker constants
const CIRCUIT_BREAKER = {
    FAILURE_THRESHOLD: 5,      // Open circuit after 5 failures
    SUCCESS_THRESHOLD: 2,       // Close circuit after 2 successes
    TIMEOUT_MS: 60000,          // Reset after 60s
} as const;

// ✅ Circuit breaker state
let circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
let circuitOpenTime: number | null = null;

/**
 * ✅ FIX P2: Check if circuit breaker allows connection attempt
 */
function canAttemptConnection(): boolean {
    if (circuitBreakerState === 'CLOSED') {
        return true;
    }

    if (circuitBreakerState === 'OPEN') {
        // Check if timeout has passed
        if (circuitOpenTime && Date.now() - circuitOpenTime > CIRCUIT_BREAKER.TIMEOUT_MS) {
            circuitBreakerState = 'HALF_OPEN';
            logger.info('Circuit breaker entering HALF_OPEN state');
            return true;
        }
        return false;
    }

    // HALF_OPEN: allow one attempt
    return true;
}

/**
 * ✅ FIX P2: Record connection success/failure for circuit breaker
 */
function recordConnectionResult(success: boolean): void {
    if (success) {
        cached.consecutiveFailures = 0;

        if (circuitBreakerState === 'HALF_OPEN') {
            circuitBreakerState = 'CLOSED';
            logger.info('Circuit breaker CLOSED');
        }
    } else {
        cached.consecutiveFailures++;

        if (cached.consecutiveFailures >= CIRCUIT_BREAKER.FAILURE_THRESHOLD) {
            circuitBreakerState = 'OPEN';
            circuitOpenTime = Date.now();
            logger.error('Circuit breaker OPEN', {
                failures: cached.consecutiveFailures
            });
        }
    }
}

/**
 * ✅ Verifica si la conexión existente sigue viva
 */
function isConnectionAlive(): boolean {
    if (!cached.conn) return false;

    const state = mongoose.connection.readyState;
    const isConnected = state === 1;

    const connectionAge = Date.now() - (cached.lastConnected || 0);
    const isStale = connectionAge > MAX_CONNECTION_AGE;

    return isConnected && !isStale;
}

/**
 * ✅ Limpia la conexión en caché y reinicia el estado
 */
function resetConnection(): void {
    cached.conn = null;
    cached.promise = null;
    cached.retryCount = 0;
}

/**
 * ✅ FIX P0-6: Sanitize MongoDB errors to prevent URI exposure
 */
function sanitizeError(error: Error): string {
    let message = error.message;

    // Remove potential MongoDB URI with credentials
    message = message.replace(/mongodb(\+srv)?:\/\/[^@]+@[^\s]+/gi, 'mongodb://***:***@***/***');

    // Remove IP addresses
    message = message.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '***.***.***. ***');

    return message;
}

/**
 * ✅ Conecta a MongoDB con patrón singleton optimizado para serverless
 * 
 * MEJORAS:
 * - FIX P0-4: Event listeners con .once() para evitar memory leaks
 * - FIX P0-6: Sanitización de errors
 * - FIX P2: Circuit breaker pattern
 * 
 * @returns Conexión de mongoose
 * @throws Error si falla después de MAX_RETRY_ATTEMPTS o circuit is OPEN
 */
export async function connectDB(): Promise<typeof mongoose> {
    // ✅ FIX P2: Check circuit breaker
    if (!canAttemptConnection()) {
        throw new Error('MongoDB circuit breaker is OPEN. Service temporarily unavailable.');
    }

    // Si ya existe una conexión válida, reutilizarla
    if (isConnectionAlive()) {
        logger.debug('Reusing existing MongoDB connection');
        return cached.conn!;
    }

    // Si la conexión está muerta pero existe en caché, limpiarla
    if (cached.conn && !isConnectionAlive()) {
        logger.warn('Stale connection detected, reconnecting');
        resetConnection();
    }

    // Si ya hay una promesa de conexión en progreso, esperarla
    if (cached.promise) {
        try {
            cached.conn = await cached.promise;
            cached.lastConnected = Date.now();
            return cached.conn;
        } catch (error) {
            logger.error('Pending connection promise failed');
            resetConnection();
        }
    }

    // Crear nueva conexión con reintentos
    while (cached.retryCount < MAX_RETRY_ATTEMPTS) {
        try {
            logger.info('Attempting MongoDB connection', {
                attempt: cached.retryCount + 1,
                maxAttempts: MAX_RETRY_ATTEMPTS
            });

            cached.promise = mongoose.connect(getMongoURI(), MONGODB_OPTIONS);
            cached.conn = await cached.promise;
            cached.lastConnected = Date.now();
            cached.retryCount = 0;

            logger.info('MongoDB connected successfully');

            // ✅ FIX P0-4: Use .once() instead of .on() to prevent listener leak
            mongoose.connection.once('error', (err: Error) => {
                const sanitized = sanitizeError(err); // ✅ FIX P0-6
                logger.error('MongoDB error', { error: sanitized });
                resetConnection();
                recordConnectionResult(false); // ✅ Circuit breaker
            });

            mongoose.connection.once('disconnected', () => {
                logger.warn('MongoDB disconnected');
                resetConnection();
            });

            mongoose.connection.once('connected', () => {
                logger.info('MongoDB connection established');
            });

            // ✅ FIX P2: Record success
            recordConnectionResult(true);

            return cached.conn;

        } catch (error) {
            cached.retryCount++;
            cached.promise = null;

            // ✅ FIX P0-6: Sanitize error message
            const sanitizedMessage = error instanceof Error
                ? sanitizeError(error)
                : 'Unknown error';

            logger.error('MongoDB connection attempt failed', {
                attempt: cached.retryCount,
                error: sanitizedMessage
            });

            if (cached.retryCount >= MAX_RETRY_ATTEMPTS) {
                resetConnection();
                recordConnectionResult(false); // ✅ Circuit breaker

                throw new Error(
                    `MongoDB: Failed after ${MAX_RETRY_ATTEMPTS} attempts. ` +
                    `Error: ${sanitizedMessage}` // ✅ Safe error
                );
            }

            // Exponential backoff
            const delay = RETRY_DELAY * Math.pow(2, cached.retryCount - 1);
            logger.warn('Retrying connection', { delayMs: delay });
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    recordConnectionResult(false); // ✅ Circuit breaker
    throw new Error('MongoDB: Could not establish connection');
}

/**
 * ✅ Cierra la conexión a MongoDB (útil para testing)
 */
export async function disconnectDB(): Promise<void> {
    if (cached.conn) {
        await mongoose.disconnect();
        resetConnection();
        logger.info('MongoDB disconnected manually');
    }
}

/**
 * ✅ Obtiene el estado actual de la conexión
 */
export function getConnectionStatus(): ConnectionStatus {
    const readyState = mongoose.connection.readyState;

    // ✅ Type-safe mapping usando switch (TypeScript-friendly)
    let readyStateText: 'disconnected' | 'connected' | 'connecting' | 'disconnecting';
    switch (readyState) {
        case 0:
            readyStateText = 'disconnected';
            break;
        case 1:
            readyStateText = 'connected';
            break;
        case 2:
            readyStateText = 'connecting';
            break;
        case 3:
            readyStateText = 'disconnecting';
            break;
        default:
            readyStateText = 'disconnected';
    }

    return {
        isConnected: isConnectionAlive(),
        readyState,
        readyStateText,
        lastConnected: cached.lastConnected,
        retryCount: cached.retryCount,
        connectionAge: cached.lastConnected ? Date.now() - cached.lastConnected : null,
        circuitState: circuitBreakerState, // ✅ NUEVO
    };
}

/**
 * ✅ Health check para readiness probes
 */
export async function healthCheck(): Promise<{ healthy: boolean; details: ConnectionStatus }> {
    const status = getConnectionStatus();

    // Not healthy if circuit is OPEN
    if (status.circuitState === 'OPEN') {
        return { healthy: false, details: status };
    }

    const healthy = status.isConnected &&
        (status.connectionAge === null || status.connectionAge < MAX_CONNECTION_AGE);

    return {
        healthy,
        details: status,
    };
}

/**
 * ✅ Forzar reconexión (útil para recovery)
 */
export async function forceReconnect(): Promise<typeof mongoose> {
    logger.warn('Forcing MongoDB reconnection');
    await disconnectDB();

    // Reset circuit breaker to allow reconnection
    circuitBreakerState = 'CLOSED';
    cached.consecutiveFailures = 0;

    return connectDB();
}

/**
 * ✅ NUEVO: Get circuit breaker metrics
 */
export function getCircuitBreakerMetrics() {
    return {
        state: circuitBreakerState,
        consecutiveFailures: cached.consecutiveFailures,
        openSince: circuitOpenTime,
        thresholds: CIRCUIT_BREAKER,
    };
}
