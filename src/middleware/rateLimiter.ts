import redis from '../lib/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { verifyTurnstileToken } from '../lib/turnstile'

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, '1 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
})

const WHITELIST = ['upstash.com', 'images.datatracker.com']

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown-ip'
}

export async function rateLimit(request: Request) {
  const ip = getClientIp(request)

  if (WHITELIST.some(domain => ip.includes(domain))) {
    return { success: true }
  }

  const { success, limit, remaining, reset } = await ratelimit.limit(ip)

  if (!success) {
    return {
      success: false,
      message: 'Demasiadas solicitudes. Por favor, intente más tarde.',
      headers: {
        'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    }
  }

  return { success: true }
}

export async function validateCaptcha(request: Request) {
  const data = await request.json()
  const turnstileToken = data['cf-turnstile-response'] || data.captchaToken
  const ip = getClientIp(request)

  if (!turnstileToken) {
    return { success: false, message: 'Falta el token de verificación' }
  }

  const turnstileVerification = await verifyTurnstileToken(turnstileToken, ip)
  if (!turnstileVerification.success) {
    return { success: false, message: 'Verificación de captcha fallida' }
  }

  return { success: true }
}