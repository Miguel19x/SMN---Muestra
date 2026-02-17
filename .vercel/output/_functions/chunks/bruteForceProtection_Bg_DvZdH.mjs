import { r as redis } from './redis_CYcAgJqj.mjs';
import { Ratelimit } from '@upstash/ratelimit';

const SENSITIVE_FIELDS = [
  "password",
  "token",
  "jwt",
  "secret",
  "key",
  "cedula",
  "nombre",
  "email",
  "telefono",
  "direccion",
  "ip",
  "cookie",
  "authorization"
];
const REDACT_PATTERNS = [
  /\b[VE]-?\d{6,8}\b/gi,
  // Venezuelan cedula
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  // Phone numbers
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Emails
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  // IP addresses (IPv4)
  /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g
  // JWT tokens
];
function redactString(str) {
  let result = str;
  for (const pattern of REDACT_PATTERNS) {
    result = result.replace(pattern, "[REDACTED]");
  }
  return result;
}
function sanitizeForLogging(obj) {
  if (obj === null || obj === void 0) {
    return obj;
  }
  if (typeof obj === "string") {
    return redactString(obj);
  }
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForLogging(item));
  }
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some((field) => lowerKey.includes(field))) {
      result[key] = "[REDACTED]";
      continue;
    }
    result[key] = sanitizeForLogging(value);
  }
  return result;
}
function securityEvent(eventType, details) {
  const entry = {
    type: "SECURITY_EVENT",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    eventType,
    details: sanitizeForLogging(details)
  };
  console.warn(JSON.stringify(entry));
}

new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  // 5 attempts per 15 minutes
  analytics: true,
  prefix: "login_attempts"
});
const apiGetRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  // 60 requests per minute
  analytics: true,
  prefix: "api_get"
});
function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  return "unknown";
}
function hashIp(ip) {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
async function rateLimitApiGet(request) {
  const ip = getClientIp(request);
  const hashedIp = hashIp(ip);
  const { success, limit, remaining, reset } = await apiGetRateLimiter.limit(hashedIp);
  const headers = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString()
  };
  if (!success) {
    securityEvent("rate_limit", {
      endpoint: "api_get"
    });
    return {
      success: false,
      message: "Límite de solicitudes excedido. Intente más tarde.",
      headers: {
        ...headers,
        "Retry-After": String(Math.ceil((reset - Date.now()) / 1e3))
      }
    };
  }
  return { success: true, headers };
}

export { rateLimitApiGet as r };
