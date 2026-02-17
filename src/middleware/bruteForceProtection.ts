/**
 * Brute Force Protection
 * Implements login attempt limiting and progressive delays
 */

import redis from '../lib/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { securityEvent } from '../lib/security/secureLogger';

// Rate limiter for login attempts - stricter than normal
const loginRateLimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
    analytics: true,
    prefix: 'login_attempts',
});

// Rate limiter for API GET requests
const apiGetRateLimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
    analytics: true,
    prefix: 'api_get',
});

// Lockout tracking
const LOCKOUT_KEY_PREFIX = 'lockout:';
const LOCKOUT_DURATION = 30 * 60; // 30 minutes in seconds
const MAX_FAILED_ATTEMPTS = 10;

/**
 * Get client IP from request
 */
function getClientIp(request: Request): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    return 'unknown';
}

/**
 * Hash IP for storage (don't store raw IPs)
 */
function hashIp(ip: string): string {
    // Simple hash for IP - not for cryptographic purposes
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        const char = ip.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

/**
 * Check if IP is locked out
 */
export async function isLockedOut(request: Request): Promise<boolean> {
    const ip = getClientIp(request);
    const hashedIp = hashIp(ip);
    const key = `${LOCKOUT_KEY_PREFIX}${hashedIp}`;

    try {
        const lockout = await redis.get(key);
        return lockout !== null;
    } catch {
        return false;
    }
}

/**
 * Record a failed login attempt
 */
export async function recordFailedAttempt(request: Request): Promise<void> {
    const ip = getClientIp(request);
    const hashedIp = hashIp(ip);
    const key = `failed_attempts:${hashedIp}`;

    try {
        const attempts = await redis.incr(key);
        await redis.expire(key, LOCKOUT_DURATION);

        if (attempts >= MAX_FAILED_ATTEMPTS) {
            // Lock out this IP
            await redis.setex(`${LOCKOUT_KEY_PREFIX}${hashedIp}`, LOCKOUT_DURATION, '1');

            securityEvent('auth_failure', {
                reason: 'max_attempts_exceeded',
                hashedIp,
                attempts,
            });
        }
    } catch (error) {
        console.error('Error recording failed attempt');
    }
}

/**
 * Clear failed attempts after successful login
 */
export async function clearFailedAttempts(request: Request): Promise<void> {
    const ip = getClientIp(request);
    const hashedIp = hashIp(ip);

    try {
        await redis.del(`failed_attempts:${hashedIp}`);
        await redis.del(`${LOCKOUT_KEY_PREFIX}${hashedIp}`);
    } catch (error) {
        console.error('Error clearing failed attempts');
    }
}

/**
 * Rate limit login attempts
 */
export async function rateLimitLogin(request: Request): Promise<{
    success: boolean;
    message?: string;
    retryAfter?: number;
}> {
    // First check if locked out
    if (await isLockedOut(request)) {
        securityEvent('auth_failure', {
            reason: 'ip_locked_out',
        });

        return {
            success: false,
            message: 'Demasiados intentos fallidos. Intente más tarde.',
            retryAfter: LOCKOUT_DURATION,
        };
    }

    const ip = getClientIp(request);
    const hashedIp = hashIp(ip);

    const { success, reset } = await loginRateLimiter.limit(hashedIp);

    if (!success) {
        securityEvent('rate_limit', {
            endpoint: 'login',
        });

        return {
            success: false,
            message: 'Demasiados intentos de inicio de sesión. Intente más tarde.',
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
        };
    }

    return { success: true };
}

/**
 * Rate limit API GET requests
 */
export async function rateLimitApiGet(request: Request): Promise<{
    success: boolean;
    message?: string;
    headers?: Record<string, string>;
}> {
    const ip = getClientIp(request);
    const hashedIp = hashIp(ip);

    const { success, limit, remaining, reset } = await apiGetRateLimiter.limit(hashedIp);

    const headers = {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
    };

    if (!success) {
        securityEvent('rate_limit', {
            endpoint: 'api_get',
        });

        return {
            success: false,
            message: 'Límite de solicitudes excedido. Intente más tarde.',
            headers: {
                ...headers,
                'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
            },
        };
    }

    return { success: true, headers };
}
