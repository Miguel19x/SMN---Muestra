import redis from '../lib/redis'

const WINDOW_SIZE_IN_SECONDS = 600; // 10 minutos
const MAX_REQUESTS_PER_WINDOW = 5;

export async function rateLimit(ip) {
  const current = await redis.get(ip);

  if (current === null) {
    await redis.set(ip, 1, { ex: WINDOW_SIZE_IN_SECONDS });
    return { success: true };
  }

  if (current >= MAX_REQUESTS_PER_WINDOW) {
    return { success: false };
  }

  await redis.incr(ip);
  return { success: true };
}