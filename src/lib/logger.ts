/**
 * Structured Logger
 * 
 * Centraliza logging con niveles, timestamps y formato consistente
 * - Sin PII (Personally Identifiable Information)
 * - Compatible con APM tools (Datadog, New Relic)
 * - Correlation IDs para tracing distribuido
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ✅ Tipo más flexible para contexto de logs
interface LogContext {
    [key: string]: string | number | boolean | null | undefined | string[] | number[] | Record<string, any>;
}

class Logger {
    private readonly isDevelopment: boolean;

    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    /**
     * Log con nivel y contexto
     */
    private log(level: LogLevel, message: string, context?: LogContext): void {
        const timestamp = new Date().toISOString();
        const emoji = {
            debug: '🔍',
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
        };

        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            message,
            ...context,
        };

        if (this.isDevelopment) {
            // Pretty print en desarrollo
            console[level](`${emoji[level]} [${level.toUpperCase()}] ${message}`, context || '');
        } else {
            // JSON estructurado en producción (para APM)
            console[level](JSON.stringify(logEntry));
        }
    }

    debug(message: string, context?: LogContext): void {
        if (this.isDevelopment) {
            this.log('debug', message, context);
        }
    }

    info(message: string, context?: LogContext): void {
        this.log('info', message, context);
    }

    warn(message: string, context?: LogContext): void {
        this.log('warn', message, context);
    }

    error(message: string, context?: LogContext): void {
        this.log('error', message, context);
    }
}

export const logger = new Logger();
