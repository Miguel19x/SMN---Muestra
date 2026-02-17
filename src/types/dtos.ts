/**
 * DTOs (Data Transfer Objects) compartidos
 * 
 * PORQUÉ:
 * - Contrato claro entre frontend y backend
 * - Type safety en todo el stack
 * - Documentación automática
 * - Previene data leaks (no expone campos internos)
 */

import type { ValidEstado, ValidEtiqueta } from '../config/app.config';

/**
 * ✅ DTO para crear objeto
 */
export interface CreateObjetoDTO {
    nombre: string;
    codigo: string;
    antiguedad: number;
    categoria: string;
    origen: string;
    pais_origen?: string;
    tipo_objeto?: string;
    clasificacion?: string;
    condicion?: string;
    estado_conservacion?: string;
    ubicacion_actual?: string;
    ultimo_lugar_conocido?: string;
    fecha_registro: string; // ISO date string
    imagen?: string; // URL
    captchaToken?: string;
    'cf-turnstile-response'?: string;
}

/**
 * ✅ DTO de respuesta de desaparecido
 * CRÍTICO: NO incluye _id interno de MongoDB
 */
export interface ObjetoResponseDTO {
    id: string;  // ✅ ID público (no MongoDB _id)
    nombre: string;
    codigo: string;
    antiguedad: number;
    categoria: string;
    pais_origen: string;
    tipo_objeto?: string;
    clasificacion?: string;
    fecha_registro: string;
    imagen?: string;
    estado_registro: ValidEstado;
    etiqueta: ValidEtiqueta;
    // Campos calculados
    antiguedadStage: string;
    condicionEstado: string;
    createdAt?: string;  // ISO timestamp
}

/**
 * ✅ DTO para crear solicitud de retiro
 */
export interface CreateRemovalRequestDTO {
    objeto_id: string;  // Public ID
    reason: string;
    evidence_url?: string;
    requester_email?: string;
    // Opcionales Twitter
    twitter_user_id?: string;
    twitter_username?: string;
    twitter_name?: string;
}

/**
 * ✅ DTO de respuesta de solicitud de retiro
 */
export interface RemovalRequestResponseDTO {
    id: string;  // Public ID
    objeto?: {
        id: string;
        nombre: string;
        codigo: string;
        imagen?: string;
    };
    requester: {
        twitter_username: string;
        twitter_name: string;
        email?: string;
    };
    reason: string;
    evidence_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    deadline: string;  // ISO timestamp
    createdAt: string;  // ISO timestamp
    processedAt?: string;  // ISO timestamp
    admin_notes?: string;
}

/**
 * ✅ DTO para actualizar solicitud de retiro (admin)
 */
export interface UpdateRemovalRequestDTO {
    requestId: string;
    status: 'approved' | 'rejected';
    admin_notes?: string;
}

/**
 * ✅ DTO de respuesta genérica de error
 */
export interface ErrorResponseDTO {
    error: string;
    details?: Record<string, any>;
    timestamp?: string;
    path?: string;
}

/**
 * ✅ DTO de respuesta exitosa genérica
 */
export interface SuccessResponseDTO<T = any> {
    success: true;
    data?: T;
    message?: string;
    metadata?: {
        page?: number;
        limit?: number;
        total?: number;
        source?: 'cache' | 'database';
    };
}

/**
 * ✅ DTO para estadísticas
 */
export interface StatsResponseDTO {
    total: number;
    byEstado: {
        pendiente: number;
        aprobado: number;
        rechazado: number;
    };
    byAge: {
        nuevos: number;
        antiguos: number;
    };
    byCategoria: {
        tipoA: number;
        tipoB: number;
    };
    updatedAt: string;  // ISO timestamp
}

/**
 * ✅ DTO para rate limiting
 */
export interface RateLimitResponseDTO {
    success: boolean;
    message?: string;
    headers: {
        'X-RateLimit-Limit': string;
        'X-RateLimit-Remaining': string;
        'X-RateLimit-Reset': string;
    };
}

/**
 * ✅ DTO para auth
 */
export interface AuthResponseDTO {
    success: boolean;
    userId?: string;
    role?: 'admin' | 'user';
    error?: string;
}

/**
 * ✅ DTO para health check
 */
export interface HealthCheckResponseDTO {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string;
    services: {
        database: {
            status: 'connected' | 'disconnected' | 'error';
            responseTime?: number;
        };
        cache?: {
            status: 'connected' | 'disconnected' | 'error';
            responseTime?: number;
        };
        storage?: {
            status: 'available' | 'unavailable';
        };
    };
    version?: string;
}

/**
 * ✅ Type guards para runtime checks
 */
export function isValidObjetoResponse(obj: any): obj is ObjetoResponseDTO {
    return (
        typeof obj === 'object' &&
        typeof obj.id === 'string' &&
        typeof obj.nombre === 'string' &&
        typeof obj.codigo === 'string' &&
        typeof obj.antiguedad === 'number'
    );
}

export function isErrorResponse(obj: any): obj is ErrorResponseDTO {
    return typeof obj === 'object' && typeof obj.error === 'string';
}
