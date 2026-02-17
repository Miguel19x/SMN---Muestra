/**
 * DTOs (Data Transfer Objects) compartidos
 * 
 * PORQUÉ:
 * - Contrato claro entre frontend y backend
 * - Type safety en todo el stack
 * - Documentación automática
 * - Previene data leaks (no expone campos internos)
 */

import type { ValidSexo, ValidExtranjero, ValidEstado, ValidEtiqueta } from '../config/app.config';

/**
 * ✅ DTO para crear desaparecido
 */
export interface CreateDesaparecidoDTO {
    nombre: string;
    cedula: string;
    edad: number;
    sexo: ValidSexo;
    extranjero: ValidExtranjero;
    nacionalidad?: string;
    profesion?: string;
    etnia?: string;
    condicion_de_salud?: string;
    discapacidad?: string;
    lugar_de_confinamiento?: string;
    lugar_de_desaparicion?: string;
    fecha: string; // ISO date string
    imagen?: string; // URL
    captchaToken?: string;
    'cf-turnstile-response'?: string;
}

/**
 * ✅ DTO de respuesta de desaparecido
 * CRÍTICO: NO incluye _id interno de MongoDB
 */
export interface DesaparecidoResponseDTO {
    id: string;  // ✅ ID público (no MongoDB _id)
    nombre: string;
    cedula: string;
    edad: number;
    sexo: string;
    nacionalidad: string;
    profesion?: string;
    etnia?: string;
    fecha: string;
    imagen?: string;
    estado_registro: ValidEstado;
    etiqueta: ValidEtiqueta;
    // Campos calculados
    ageStage: string;
    legalCondition: string;
    createdAt?: string;  // ISO timestamp
}

/**
 * ✅ DTO para crear solicitud de retiro
 */
export interface CreateRemovalRequestDTO {
    desaparecido_id: string;  // Public ID
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
    desaparecido?: {
        id: string;
        nombre: string;
        cedula: string;
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
        menores: number;
        mayores: number;
    };
    bySexo: {
        masculino: number;
        femenino: number;
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
export function isValidDesaparecidoResponse(obj: any): obj is DesaparecidoResponseDTO {
    return (
        typeof obj === 'object' &&
        typeof obj.id === 'string' &&
        typeof obj.nombre === 'string' &&
        typeof obj.cedula === 'string' &&
        typeof obj.edad === 'number'
    );
}

export function isErrorResponse(obj: any): obj is ErrorResponseDTO {
    return typeof obj === 'object' && typeof obj.error === 'string';
}
