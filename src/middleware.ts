/**
 * Astro Middleware
 * Applies security headers to all page responses
 */

import type { MiddlewareHandler } from 'astro';
import { getSecurityHeaders } from './middleware/securityHeaders';

export const onRequest: MiddlewareHandler = async (_context, next) => {
    const response = await next();

    // Apply security headers to all responses
    const securityHeaders = getSecurityHeaders();

    for (const [key, value] of Object.entries(securityHeaders)) {
        response.headers.set(key, value);
    }

    return response;
};
