/**
 * Security Headers Middleware
 * Implements OWASP recommended security headers
 */

export interface SecurityHeaders {
    [key: string]: string;
}

/**
 * Generate security headers for all responses
 */
export function getSecurityHeaders(): SecurityHeaders {
    return {
        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',

        // Prevent clickjacking - deny all framing
        'X-Frame-Options': 'DENY',

        // Enable XSS filter (legacy browsers)
        'X-XSS-Protection': '1; mode=block',

        // Referrer policy - don't leak full URLs
        'Referrer-Policy': 'strict-origin-when-cross-origin',

        // Permissions policy - restrict browser features
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',

        // HSTS - force HTTPS (1 year, include subdomains)
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

        // Content Security Policy
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://*.cloudflare.com https://images.datatracker.com",
            "connect-src 'self' https://*.upstash.io https://*.cloudflare.com",
            "frame-src https://challenges.cloudflare.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; '),
    };
}

/**
 * Apply security headers to a Response object
 */
export function applySecurityHeaders(response: Response): Response {
    const headers = getSecurityHeaders();
    const newHeaders = new Headers(response.headers);

    for (const [key, value] of Object.entries(headers)) {
        newHeaders.set(key, value);
    }

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
}

/**
 * Create a JSON response with security headers
 */
export function secureJsonResponse(
    data: unknown,
    status: number = 200,
    additionalHeaders: Record<string, string> = {}
): Response {
    const headers = {
        'Content-Type': 'application/json',
        ...getSecurityHeaders(),
        ...additionalHeaders,
    };

    return new Response(JSON.stringify(data), {
        status,
        headers,
    });
}

/**
 * Create secure cookie options
 */
export function getSecureCookieOptions(maxAge: number = 86400): string {
    const isProduction = process.env.NODE_ENV === 'production';

    const options = [
        `Max-Age=${maxAge}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Strict',
    ];

    if (isProduction) {
        options.push('Secure');
    }

    return options.join('; ');
}

/**
 * Build a secure Set-Cookie header value
 */
export function buildSecureCookie(name: string, value: string, maxAge: number = 86400): string {
    return `${name}=${value}; ${getSecureCookieOptions(maxAge)}`;
}
