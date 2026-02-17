/**
 * Security Module Index
 * Central export for all security utilities
 */

// Middleware
export {
    getSecurityHeaders,
    applySecurityHeaders,
    secureJsonResponse,
    getSecureCookieOptions,
    buildSecureCookie,
} from '../../middleware/securityHeaders';

export {
    generateCSRFToken,
    validateCSRFToken,
    csrfProtection,
    buildCSRFCookie,
    setCSRFTokenResponse,
} from '../../middleware/csrfProtection';

export {
    rateLimitLogin,
    rateLimitApiGet,
    isLockedOut,
    recordFailedAttempt,
    clearFailedAttempts,
} from '../../middleware/bruteForceProtection';

// ID Obfuscation Utilities
export {
    createPublicId,
    isValidPublicId,
    decodePublicIdHash,
    publicIdMapper,
    PublicIdMapper,
    generateUUID,
    isValidUUID,
} from './idObfuscation';

// Logging Utilities
export {
    secureLog,
    auditLog,
    securityEvent,
    sanitizeForLogging,
    redactString,
} from './secureLogger';
