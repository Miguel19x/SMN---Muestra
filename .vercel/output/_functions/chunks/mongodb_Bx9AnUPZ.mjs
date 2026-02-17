import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI) {
  throw new Error(
    'No está definido MONGODB_URI dentro del .env.local'
  )
}

/**
 * Global cache para singleton pattern en serverless
 * Previene múltiples conexiones en hot-reloading
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    lastConnected: null,
    retryCount: 0
  };
}

/**
 * Opciones optimizadas para entorno serverless (Vercel)
 * - Pools pequeños para evitar agotamiento de conexiones
 * - Timeouts cortos para fallar rápido en serverless
 * - Auto-reconexión deshabilitada (manejada manualmente)
 */
const MONGODB_OPTIONS = {
  bufferCommands: false, // Falla inmediatamente si no hay conexión
  maxPoolSize: 5,         // Reducido para serverless (5 en vez de 10)
  minPoolSize: 1,         // Mínimo reducido
  maxIdleTimeMS: 10000,   // Cierra conexiones inactivas más rápido (10s)
  serverSelectionTimeoutMS: 5000,  // 5 segundos para selección de servidor
  socketTimeoutMS: 30000,          // 30 segundos timeout de socket (reducido)
  family: 4,              // Fuerza IPv4 (más rápido en algunos entornos)
  retryWrites: true,      // Reintentar escrituras fallidas
  retryReads: true,       // Reintentar lecturas fallidas
};

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 segundo entre reintentos

/**
 * Verifica si la conexión existente sigue viva
 */
function isConnectionAlive() {
  if (!cached.conn) return false;

  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const isConnected = state === 1;

  // Verificar que la conexión no sea muy antigua (> 5 minutos en serverless)
  const connectionAge = Date.now() - (cached.lastConnected || 0);
  const isStale = connectionAge > 5 * 60 * 1000; // 5 minutos

  return isConnected && !isStale;
}

/**
 * Limpia la conexión en caché y reinicia el estado
 */
function resetConnection() {
  cached.conn = null;
  cached.promise = null;
  cached.retryCount = 0;
}

/**
 * Conecta a MongoDB con patrón singleton optimizado para serverless
 * 
 * Features:
 * - Reutiliza conexiones existentes
 * - Verifica estado de conexión antes de reutilizar
 * - Reintentos automáticos con backoff
 * - Logging detallado en desarrollo
 * - Limpieza de conexiones muertas
 * 
 * @returns {Promise<mongoose.Mongoose>} Conexión de mongoose
 * @throws {Error} Si falla después de MAX_RETRY_ATTEMPTS
 */
async function connectDB() {
  // Si ya existe una conexión válida, reutilizarla
  if (isConnectionAlive()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('♻️  MongoDB: Reutilizando conexión existente');
    }
    return cached.conn;
  }

  // Si la conexión está muerta pero existe en caché, limpiarla
  if (cached.conn && !isConnectionAlive()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 MongoDB: Conexión anterior expirada, reconectando...');
    }
    resetConnection();
  }

  // Si ya hay una promesa de conexión en progreso, esperarla
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      cached.lastConnected = Date.now();
      return cached.conn;
    } catch (error) {
      // Si falla la promesa en caché, resetear y reintentar
      resetConnection();
    }
  }

  // Crear nueva conexión con reintentos
  while (cached.retryCount < MAX_RETRY_ATTEMPTS) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔌 MongoDB: Conectando... (intento ${cached.retryCount + 1}/${MAX_RETRY_ATTEMPTS})`);
      }

      cached.promise = mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
      cached.conn = await cached.promise;
      cached.lastConnected = Date.now();
      cached.retryCount = 0; // Reset counter on success

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ MongoDB: Conectado exitosamente');
      }

      // Event listeners para monitorear la conexión
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB Error:', err);
        resetConnection();
      });

      mongoose.connection.on('disconnected', () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️  MongoDB: Desconectado');
        }
        resetConnection();
      });

      return cached.conn;

    } catch (error) {
      cached.retryCount++;
      cached.promise = null;

      console.error(`❌ MongoDB: Error en intento ${cached.retryCount}:`, error.message);

      if (cached.retryCount >= MAX_RETRY_ATTEMPTS) {
        resetConnection();
        throw new Error(
          `MongoDB: Falló después de ${MAX_RETRY_ATTEMPTS} intentos. Error: ${error.message}`
        );
      }

      // Esperar antes de reintentar (exponential backoff)
      const delay = RETRY_DELAY * Math.pow(2, cached.retryCount - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('MongoDB: No se pudo establecer conexión');
}

/**
 * Obtiene el estado actual de la conexión
 * @returns {Object} Estado de conexión con detalles
 */
function getConnectionStatus() {
  return {
    isConnected: isConnectionAlive(),
    readyState: mongoose.connection.readyState,
    readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    lastConnected: cached.lastConnected,
    retryCount: cached.retryCount,
    connectionAge: cached.lastConnected ? Date.now() - cached.lastConnected : null
  };
}

export { connectDB as c, getConnectionStatus as g };
