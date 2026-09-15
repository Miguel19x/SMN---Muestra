/**
 * Schemas de Validación con Zod
 * 
 * PORQUÉ:
 * - Runtime validation (previene ataques)
 * - Type inference automática
 * - Mensajes de error claros
 * - Fácil de testear
 */

import { z } from 'zod';
import { Types } from 'mongoose';
import { VALIDATION_CONFIG, BUSINESS_CONFIG } from '../config/app.config';

const { ObjectId } = Types;

/**
 * ✅ CRÍTICO: Validador de ObjectId que previene NoSQL injection
 */
export const ObjectIdSchema = z.string().refine(
    (val) => {
        // Debe ser string Y ObjectId válido
        // Previene: { $ne: null }, { $gt: "" }, etc.
        return typeof val === 'string' && ObjectId.isValid(val);
    },
    { message: 'ID inválido' }
);

/**
 * ✅ Validador de código de identificación
 */
export const CodigoSchema = z.string().regex(
    VALIDATION_CONFIG.PATTERNS.CEDULA,
    'Código inválido'
);

// ✅ Alias para compatibilidad
export const CedulaSchema = CodigoSchema;

/**
 * ✅ Validador de fecha ISO
 */
export const ISODateSchema = z.string().regex(
    VALIDATION_CONFIG.PATTERNS.DATE_ISO,
    'Fecha inválida. Formato: YYYY-MM-DD'
);

/**
 * ✅ Schema para crear registro
 */
export const CreateObjetoSchema = z.object({
    nombre: z.string()
        .min(2, 'Nombre muy corto')
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM, 'Nombre muy largo')
        .trim(),

    codigo: CodigoSchema,

    antiguedad: z.number()
        .int('Antigüedad debe ser entero')
        .min(0, 'Antigüedad no puede ser negativa')
        .max(500, 'Antigüedad inválida'),

    categoria: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT)
        .optional(),

    origen: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT)
        .optional(),

    pais_origen: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT)
        .optional(),

    tipo_objeto: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM)
        .optional(),

    clasificacion: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT)
        .optional(),

    condicion: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG)
        .optional(),

    estado_conservacion: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG)
        .optional(),

    ubicacion_actual: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG)
        .optional(),

    ultimo_lugar_conocido: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG)
        .optional(),

    fecha_registro: ISODateSchema,

    imagen: z.string()
        .url('URL de imagen inválida')
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.URL)
        .optional(),

    // CAPTCHA tokens
    'cf-turnstile-response': z.string().optional(),
    captchaToken: z.string().optional(),
})
    .refine(
        (data) => {
            // Si es importado (I), país de origen es obligatorio
            if (data.origen === 'I' && !data.pais_origen) {
                return false;
            }
            return true;
        },
        {
            message: 'País de origen es requerido para importados',
            path: ['pais_origen'],
        }
    )
    .refine(
        (data) => {
            // Debe tener al menos un token de CAPTCHA
            return !!(data['cf-turnstile-response'] || data.captchaToken);
        },
        {
            message: 'Token de verificación requerido',
            path: ['captchaToken'],
        }
    );

// ✅ Backward compatibility alias
export const CreateDesaparecidoSchema = CreateObjetoSchema;

/**
 * ✅ Schema para crear solicitud de retiro
 */
export const CreateRemovalRequestSchema = z.object({
    objeto_id: ObjectIdSchema,  // ✅ CRÍTICO: Previene NoSQL injection

    reason: z.string()
        .min(BUSINESS_CONFIG.REMOVAL_REQUEST.MIN_REASON_LENGTH, 'Razón muy corta')
        .max(BUSINESS_CONFIG.REMOVAL_REQUEST.MAX_REASON_LENGTH, 'Razón muy larga')
        .trim(),

    evidence_url: z.string()
        .url('URL de evidencia inválida')
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.URL)
        .optional(),

    requester_email: z.string()
        .email('Email inválido')
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM)
        .optional(),

    // Opcionales Twitter
    twitter_user_id: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT)
        .optional(),

    twitter_username: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT)
        .optional(),

    twitter_name: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM)
        .optional(),
});

/**
 * ✅ Schema para actualizar solicitud de retiro
 */
export const UpdateRemovalRequestSchema = z.object({
    requestId: ObjectIdSchema,  // ✅ CRÍTICO: Previene NoSQL injection

    status: z.enum(['approved', 'rejected']),

    admin_notes: z.string()
        .max(BUSINESS_CONFIG.REMOVAL_REQUEST.MAX_REASON_LENGTH)
        .optional(),
});

/**
 * ✅ Schema para query params de desaparecidos
 */
export const GetObjetosQuerySchema = z.object({
    estado_registro: z.enum(VALIDATION_CONFIG.VALID_ESTADOS).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
});

// ✅ Backward compatibility alias
export const GetDesaparecidosQuerySchema = GetObjetosQuerySchema;

/**
 * ✅ Schema para query params de removal requests
 */
export const GetRemovalRequestsQuerySchema = z.object({
    objeto_id: ObjectIdSchema.optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    admin: z.enum(['true', 'false']).optional(),
});

/**
 * ✅ Helper para validar payload size
 */
export function validatePayloadSize(contentLength: string | null): boolean {
    if (!contentLength) return true;  // Si no hay header, permitir

    const size = parseInt(contentLength, 10);
    if (isNaN(size)) return false;

    return size <= VALIDATION_CONFIG.MAX_REQUEST_SIZE_BYTES;
}

/**
 * ✅ Helper para sanitizar string (prevenir XSS básico)
 */
export function sanitizeString(str: string): string {
    return str
        .trim()
        .replace(/<script[^>]*>.*?<\/script>/gi, '')  // Remove scripts
        .replace(/<[^>]+>/g, '');  // Remove HTML tags
}

/**
 * ✅ Type inference helpers
 */
export type CreateObjetoInput = z.infer<typeof CreateObjetoSchema>;
export type CreateRemovalRequestInput = z.infer<typeof CreateRemovalRequestSchema>;
export type UpdateRemovalRequestInput = z.infer<typeof UpdateRemovalRequestSchema>;
export type GetObjetosQuery = z.infer<typeof GetObjetosQuerySchema>;
export type GetRemovalRequestsQuery = z.infer<typeof GetRemovalRequestsQuerySchema>;

// ✅ Backward compatibility aliases
export type CreateDesaparecidoInput = CreateObjetoInput;
export type GetDesaparecidosQuery = GetObjetosQuery;
