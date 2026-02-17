import mongoose from 'mongoose';
import { D as DATABASE_CONFIG } from './app.config_BO63yO4S.mjs';
import { l as logger } from './logger_CX-LuAmG.mjs';

let cached = global.mongoose || {
  conn: null,
  promise: null,
  lastConnected: null,
  retryCount: 0,
  consecutiveFailures: 0
  // ✅ NUEVO
};
if (!global.mongoose) {
  global.mongoose = cached;
}
function getMongoURI() {
  const uri = process.env.MONGODB_URL || "mongodb+srv://leohxone_db_user:nbRmwP2ZkHpbK0Jh@cluster0.jl8povi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  return uri;
}
const MONGODB_OPTIONS = {
  bufferCommands: false,
  maxPoolSize: DATABASE_CONFIG.POOL_SIZE.MAX,
  minPoolSize: DATABASE_CONFIG.POOL_SIZE.MIN,
  maxIdleTimeMS: DATABASE_CONFIG.TIMEOUTS.IDLE_MS,
  serverSelectionTimeoutMS: DATABASE_CONFIG.TIMEOUTS.SERVER_SELECTION_MS,
  socketTimeoutMS: DATABASE_CONFIG.TIMEOUTS.SOCKET_MS,
  family: 4,
  retryWrites: true,
  retryReads: true
};
const MAX_RETRY_ATTEMPTS = DATABASE_CONFIG.RETRY.MAX_ATTEMPTS;
const RETRY_DELAY = DATABASE_CONFIG.RETRY.DELAY_MS;
const MAX_CONNECTION_AGE = DATABASE_CONFIG.MAX_CONNECTION_AGE_MS;
const CIRCUIT_BREAKER = {
  FAILURE_THRESHOLD: 5,
  // Close circuit after 2 successes
  TIMEOUT_MS: 6e4
  // Reset after 60s
};
let circuitBreakerState = "CLOSED";
let circuitOpenTime = null;
function canAttemptConnection() {
  if (circuitBreakerState === "CLOSED") {
    return true;
  }
  if (circuitBreakerState === "OPEN") {
    if (circuitOpenTime && Date.now() - circuitOpenTime > CIRCUIT_BREAKER.TIMEOUT_MS) {
      circuitBreakerState = "HALF_OPEN";
      logger.info("Circuit breaker entering HALF_OPEN state");
      return true;
    }
    return false;
  }
  return true;
}
function recordConnectionResult(success) {
  if (success) {
    cached.consecutiveFailures = 0;
    if (circuitBreakerState === "HALF_OPEN") {
      circuitBreakerState = "CLOSED";
      logger.info("Circuit breaker CLOSED");
    }
  } else {
    cached.consecutiveFailures++;
    if (cached.consecutiveFailures >= CIRCUIT_BREAKER.FAILURE_THRESHOLD) {
      circuitBreakerState = "OPEN";
      circuitOpenTime = Date.now();
      logger.error("Circuit breaker OPEN", {
        failures: cached.consecutiveFailures
      });
    }
  }
}
function isConnectionAlive() {
  if (!cached.conn) return false;
  const state = mongoose.connection.readyState;
  const isConnected = state === 1;
  const connectionAge = Date.now() - (cached.lastConnected || 0);
  const isStale = connectionAge > MAX_CONNECTION_AGE;
  return isConnected && !isStale;
}
function resetConnection() {
  cached.conn = null;
  cached.promise = null;
  cached.retryCount = 0;
}
function sanitizeError(error) {
  let message = error.message;
  message = message.replace(/mongodb(\+srv)?:\/\/[^@]+@[^\s]+/gi, "mongodb://***:***@***/***");
  message = message.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "***.***.***. ***");
  return message;
}
async function connectDB() {
  if (!canAttemptConnection()) {
    throw new Error("MongoDB circuit breaker is OPEN. Service temporarily unavailable.");
  }
  if (isConnectionAlive()) {
    logger.debug("Reusing existing MongoDB connection");
    return cached.conn;
  }
  if (cached.conn && !isConnectionAlive()) {
    logger.warn("Stale connection detected, reconnecting");
    resetConnection();
  }
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      cached.lastConnected = Date.now();
      return cached.conn;
    } catch (error) {
      logger.error("Pending connection promise failed");
      resetConnection();
    }
  }
  while (cached.retryCount < MAX_RETRY_ATTEMPTS) {
    try {
      logger.info("Attempting MongoDB connection", {
        attempt: cached.retryCount + 1,
        maxAttempts: MAX_RETRY_ATTEMPTS
      });
      cached.promise = mongoose.connect(getMongoURI(), MONGODB_OPTIONS);
      cached.conn = await cached.promise;
      cached.lastConnected = Date.now();
      cached.retryCount = 0;
      logger.info("MongoDB connected successfully");
      mongoose.connection.once("error", (err) => {
        const sanitized = sanitizeError(err);
        logger.error("MongoDB error", { error: sanitized });
        resetConnection();
        recordConnectionResult(false);
      });
      mongoose.connection.once("disconnected", () => {
        logger.warn("MongoDB disconnected");
        resetConnection();
      });
      mongoose.connection.once("connected", () => {
        logger.info("MongoDB connection established");
      });
      recordConnectionResult(true);
      return cached.conn;
    } catch (error) {
      cached.retryCount++;
      cached.promise = null;
      const sanitizedMessage = error instanceof Error ? sanitizeError(error) : "Unknown error";
      logger.error("MongoDB connection attempt failed", {
        attempt: cached.retryCount,
        error: sanitizedMessage
      });
      if (cached.retryCount >= MAX_RETRY_ATTEMPTS) {
        resetConnection();
        recordConnectionResult(false);
        throw new Error(
          `MongoDB: Failed after ${MAX_RETRY_ATTEMPTS} attempts. Error: ${sanitizedMessage}`
          // ✅ Safe error
        );
      }
      const delay = RETRY_DELAY * Math.pow(2, cached.retryCount - 1);
      logger.warn("Retrying connection", { delayMs: delay });
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  recordConnectionResult(false);
  throw new Error("MongoDB: Could not establish connection");
}
function getConnectionStatus() {
  const readyState = mongoose.connection.readyState;
  let readyStateText;
  switch (readyState) {
    case 0:
      readyStateText = "disconnected";
      break;
    case 1:
      readyStateText = "connected";
      break;
    case 2:
      readyStateText = "connecting";
      break;
    case 3:
      readyStateText = "disconnecting";
      break;
    default:
      readyStateText = "disconnected";
  }
  return {
    isConnected: isConnectionAlive(),
    readyState,
    readyStateText,
    lastConnected: cached.lastConnected,
    retryCount: cached.retryCount,
    connectionAge: cached.lastConnected ? Date.now() - cached.lastConnected : null,
    circuitState: circuitBreakerState
    // ✅ NUEVO
  };
}

export { connectDB as c, getConnectionStatus as g };
