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
export const CedulaSchema = z.string().regex(
    VALIDATION_CONFIG.PATTERNS.CEDULA,
    'Código inválido. Formato: V-12345678 o E-12345678'
);

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
export const CreateDesaparecidoSchema = z.object({
    nombre: z.string()
        .min(2, 'Nombre muy corto')
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM, 'Nombre muy largo')
        .trim(),

    cedula: CedulaSchema,

    edad: z.number()
        .int('Edad debe ser entero')
        .min(0, 'Edad no puede ser negativa')
        .max(150, 'Edad inválida'),

    sexo: z.enum(VALIDATION_CONFIG.VALID_SEXO),

    extranjero: z.enum(VALIDATION_CONFIG.VALID_EXTRANJERO),

    nacionalidad: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT)
        .optional(),

    profesion: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM)
        .optional(),

    etnia: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT)
        .optional(),

    condicion_de_salud: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG)
        .optional(),

    discapacidad: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG)
        .optional(),

    lugar_de_confinamiento: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG)
        .optional(),

    lugar_de_desaparicion: z.string()
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG)
        .optional(),

    fecha: ISODateSchema,

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
            // Si es extranjero (E), nacionalidad es obligatoria
            if (data.extranjero === 'E' && !data.nacionalidad) {
                return false;
            }
            return true;
        },
        {
            message: 'Origen es requerido para importados',
            path: ['nacionalidad'],
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

/**
 * ✅ Schema para crear solicitud de retiro
 */
export const CreateRemovalRequestSchema = z.object({
    desaparecido_id: ObjectIdSchema,  // ✅ CRÍTICO: Previene NoSQL injection

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
export const GetDesaparecidosQuerySchema = z.object({
    estado_registro: z.enum(VALIDATION_CONFIG.VALID_ESTADOS).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
});

/**
 * ✅ Schema para query params de removal requests
 */
export const GetRemovalRequestsQuerySchema = z.object({
    desaparecido_id: ObjectIdSchema.optional(),
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
export type CreateDesaparecidoInput = z.infer<typeof CreateDesaparecidoSchema>;
export type CreateRemovalRequestInput = z.infer<typeof CreateRemovalRequestSchema>;
export type UpdateRemovalRequestInput = z.infer<typeof UpdateRemovalRequestSchema>;
export type GetDesaparecidosQuery = z.infer<typeof GetDesaparecidosQuerySchema>;
export type GetRemovalRequestsQuery = z.infer<typeof GetRemovalRequestsQuerySchema>;
