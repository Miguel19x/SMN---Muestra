import { r as redis } from './redis_CYcAgJqj.mjs';
import { Ratelimit } from '@upstash/ratelimit';
import './turnstile_B4As6Fer.mjs';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "1 s"),
  analytics: true,
  prefix: "@upstash/ratelimit"
});
const WHITELIST = ["upstash.com", "images.datatracker.com"];
function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown-ip";
}
async function rateLimit(request) {
  const ip = getClientIp(request);
  if (WHITELIST.some((domain) => ip.includes(domain))) {
    return { success: true };
  }
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  if (!success) {
    return {
      success: false,
      message: "Demasiadas solicitudes. Por favor, intente más tarde.",
      headers: {
        "Retry-After": String(Math.ceil((reset - Date.now()) / 1e3)),
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString()
      }
    };
  }
  return { success: true };
}

export { rateLimit as r };
