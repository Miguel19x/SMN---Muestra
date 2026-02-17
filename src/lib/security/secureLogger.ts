/**
 * Secure Logging Utility
 * Prevents PII (Personally Identifiable Information) from being logged
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Fields that should NEVER be logged
const SENSITIVE_FIELDS = [
    'password',
    'token',
    'jwt',
    'secret',
    'key',
    'cedula',
    'nombre',
    'email',
    'telefono',
    'direccion',
    'ip',
    'cookie',
    'authorization',
];

// Patterns to redact (regex)
const REDACT_PATTERNS = [
    /\b[VE]-?\d{6,8}\b/gi,                    // Venezuelan cedula
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,         // Phone numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Emails
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IP addresses (IPv4)
    /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, // JWT tokens
];

/**
 * Redact sensitive data from a string
 */
export function redactString(str: string): string {
    let result = str;

    for (const pattern of REDACT_PATTERNS) {
        result = result.replace(pattern, '[REDACTED]');
    }

    return result;
}

/**
 * Sanitize an object for logging (deep cloning and redacting)
 */
export function sanitizeForLogging(obj: unknown): unknown {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'string') {
        return redactString(obj);
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeForLogging(item));
    }

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();

        // Check if this is a sensitive field
        if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
            result[key] = '[REDACTED]';
            continue;
        }

        // Recursively sanitize nested objects
        result[key] = sanitizeForLogging(value);
    }

    return result;
}

/**
 * Create a secure logger instance
 */
export const secureLog = {
    debug: (message: string, data?: unknown) => log('debug', message, data),
    info: (message: string, data?: unknown) => log('info', message, data),
    warn: (message: string, data?: unknown) => log('warn', message, data),
    error: (message: string, data?: unknown) => log('error', message, data),
};

function log(level: LogLevel, message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    const sanitizedData = data ? sanitizeForLogging(data) : undefined;
    const sanitizedMessage = redactString(message);

    const logEntry = {
        timestamp,
        level,
        message: sanitizedMessage,
        ...(sanitizedData ? { data: sanitizedData } : {}),
    };

    switch (level) {
        case 'debug':
            if (process.env.NODE_ENV !== 'production') {
                console.debug(JSON.stringify(logEntry));
            }
            break;
        case 'info':
            console.log(JSON.stringify(logEntry));
            break;
        case 'warn':
            console.warn(JSON.stringify(logEntry));
            break;
        case 'error':
            console.error(JSON.stringify(logEntry));
            break;
    }
}

/**
 * Create an audit log entry (for security events)
 */
export function auditLog(
    action: string,
    result: 'success' | 'failure',
    details?: Record<string, unknown>
): void {
    const entry = {
        type: 'AUDIT',
        timestamp: new Date().toISOString(),
        action,
        result,
        ...(details ? { details: sanitizeForLogging(details) } : {}),
    };

    console.log(JSON.stringify(entry));
}

/**
 * Security event logger for intrusion detection
 */
export function securityEvent(
    eventType: 'auth_failure' | 'rate_limit' | 'csrf_failure' | 'suspicious_request',
    details: Record<string, unknown>
): void {
    const entry = {
        type: 'SECURITY_EVENT',
        timestamp: new Date().toISOString(),
        eventType,
        details: sanitizeForLogging(details),
    };

    console.warn(JSON.stringify(entry));
}
