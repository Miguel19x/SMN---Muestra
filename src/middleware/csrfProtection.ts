/**
 * CSRF Protection Middleware
 * Implements token-based CSRF protection
 */

import crypto from 'crypto';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_COOKIE_NAME = 'csrf_token';

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCSRFToken(): string {
    return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Validate CSRF token from request
 * Compares header token with cookie token
 */
export function validateCSRFToken(request: Request): { valid: boolean; error?: string } {
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    const cookieHeader = request.headers.get('Cookie') || '';

    // Extract token from cookie
    const cookieToken = extractCookieValue(cookieHeader, CSRF_COOKIE_NAME);

    if (!headerToken) {
        return { valid: false, error: 'Missing CSRF token in header' };
    }

    if (!cookieToken) {
        return { valid: false, error: 'Missing CSRF token cookie' };
    }

    // Use timing-safe comparison to prevent timing attacks
    const isValid = timingSafeEqual(headerToken, cookieToken);

    if (!isValid) {
        return { valid: false, error: 'Invalid CSRF token' };
    }

    return { valid: true };
}

/**
 * Extract value from cookie header string
 */
function extractCookieValue(cookieHeader: string, name: string): string | null {
    const cookies = cookieHeader.split(';').map(c => c.trim());

    for (const cookie of cookies) {
        const [cookieName, ...valueParts] = cookie.split('=');
        if (cookieName.trim() === name) {
            return valueParts.join('=');
        }
    }

    return null;
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false;
    }

    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);

    return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Build CSRF cookie header value
 */
export function buildCSRFCookie(token: string, maxAge: number = 3600): string {
    const isProduction = process.env.NODE_ENV === 'production';

    const options = [
        `${CSRF_COOKIE_NAME}=${token}`,
        `Max-Age=${maxAge}`,
        'Path=/',
        'SameSite=Strict',
    ];

    if (isProduction) {
        options.push('Secure');
    }

    // Note: NOT HttpOnly - needs to be readable by JavaScript
    return options.join('; ');
}

/**
 * CSRF protection middleware for API routes
 * Use for POST, PUT, DELETE, PATCH methods
 */
export async function csrfProtection(request: Request): Promise<{ success: boolean; error?: string }> {
    const method = request.method.toUpperCase();

    // Skip CSRF check for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        return { success: true };
    }

    const validation = validateCSRFToken(request);

    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    return { success: true };
}

/**
 * Create a response that sets a new CSRF token
 */
export function setCSRFTokenResponse(response: Response): Response {
    const token = generateCSRFToken();
    const headers = new Headers(response.headers);

    headers.set('Set-Cookie', buildCSRFCookie(token));
    headers.set(CSRF_HEADER_NAME, token);

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}
