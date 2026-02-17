/**
 * 🔧 API de Inventario - Optimizada y Securizada
 * 
 * ✅ Campos renombrados para sistema de inventario de objetos
 */

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { connectDB } from '../../lib/mongodb';
import { Objeto } from '../../models/objeto';
import type { IObjeto } from '../../types/objeto.types';
import { CustomError } from '../../lib/CustomError';
import { validateDataProfanity } from '../../lib/profanity-filter';
import { verifyTurnstileToken } from '../../lib/turnstile';
import { rateLimit } from '../../middleware/rateLimiter';
import { rateLimitApiGet } from '../../middleware/bruteForceProtection';
import { secureJsonResponse } from '../../middleware/securityHeaders';
import redis from '../../lib/redis';
import { publicIdMapper } from '../../lib/security/idObfuscation';
import { ObjetoService } from '../../services/objeto.service';
import { CACHE_CONFIG, VALIDATION_CONFIG } from '../../config/app.config';
import { logger } from '../../lib/logger';

// ✅ Namespaced cache keys
const CACHE_NAMESPACE = 'api:objetos';
const getCacheKey = (estado: string) => `${CACHE_NAMESPACE}:${estado}:v8`;

const CONFIG = {
    CACHE_TTL: CACHE_CONFIG.TTL.DESAPARECIDOS,
    MAX_REQUEST_SIZE: VALIDATION_CONFIG.MAX_REQUEST_SIZE_BYTES,
    VALID_CATEGORIAS: ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'] as const,
    VALID_ORIGENES: ['N', 'I'] as const,
    VALID_CLASIFICACIONES: ['Clase A', 'Clase B', 'Clase C', 'Clase D'] as const,
    VALID_ESTADOS: VALIDATION_CONFIG.VALID_ESTADOS,
    DEFAULT_ESTADO_REGISTRO: 'aprobado' as const,
} as const;

// ✅ Validation for pais_origen
const PaisOrigenSchema = z.string()
    .min(1, 'País de origen no puede estar vacío')
    .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT)
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'País de origen contiene caracteres inválidos');

// ✅ Create schema with object-inventory fields
const CreateObjetoSchema = z.object({
    nombre: z.string().min(2).max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM),
    codigo: z.preprocess(
        (val) => val === '' || val === undefined ? undefined : val,
        z.string().regex(/^[A-Za-z0-9\-_.]+$/).optional()
    ),
    antiguedad: z.union([
        z.number().int().min(0).max(200),
        z.string().transform(val => {
            if (val === '' || val === undefined) return undefined;
            const num = parseInt(val, 10);
            return isNaN(num) ? undefined : num;
        })
    ]).optional(),
    categoria: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
    origen: z.enum(CONFIG.VALID_ORIGENES).optional(),
    pais_origen: PaisOrigenSchema.optional(),
    tipo_objeto: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).optional(),
    clasificacion: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
    condicion: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).optional(),
    estado_conservacion: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).optional(),
    ubicacion_actual: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG).optional(),
    ultimo_lugar_conocido: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG).optional(),
    estado: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
    fecha_registro: z.preprocess(
        (val) => val === '' || val === undefined ? undefined : val,
        z.string().regex(VALIDATION_CONFIG.PATTERNS.DATE_ISO).optional()
    ),
    hora_registro: z.preprocess(
        (val) => val === '' || val === undefined ? undefined : val,
        z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional()
    ),
    imagen: z.preprocess(
        (val) => val === '' || val === undefined ? undefined : val,
        z.string().url().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.URL).optional()
    ),
    'cf-turnstile-response': z.string().optional(),
    captchaToken: z.string().optional(),
}).refine(
    (data) => {
        if (data.origen === 'I' && !data.pais_origen) {
            return false;
        }
        return true;
    },
    {
        message: 'El país de origen es requerido para objetos importados',
        path: ['pais_origen'],
    }
);

// ✅ Response DTO with object-inventory fields
interface ObjetoResponseDTO {
    id: string;
    _id: string;
    origen: 'N' | 'I';
    nombre: string;
    codigo: string;
    antiguedad: number;
    categoria: string;
    pais_origen: string;
    tipo_objeto?: string;
    clasificacion?: string;
    condicion?: string;
    estado_conservacion?: string;
    ubicacion_actual?: string;
    ultimo_lugar_conocido?: string;
    estado?: string;
    fecha_registro: string;
    hora_registro?: string;
    imagen?: string;
    estado_registro: string;
    etiqueta?: string;
    antiguedadStage: string;
    condicionEstado: string;
}

const objetoService = new ObjetoService();

function toResponseDTO(doc: IObjeto): ObjetoResponseDTO {
    const publicId = publicIdMapper.createAndRegister(doc._id.toString());
    const docAny = doc as any;

    return {
        id: publicId,
        _id: doc._id.toString(),
        origen: (doc.origen && doc.origen.trim() !== '') ? doc.origen : 'N',
        nombre: doc.nombre,
        codigo: (doc.codigo && doc.codigo.trim() !== '') ? doc.codigo : 'Sin código',
        antiguedad: doc.antiguedad,
        categoria: docAny.categoria || '',
        pais_origen: doc.pais_origen || 'Nacional',
        tipo_objeto: docAny.tipo_objeto,
        clasificacion: docAny.clasificacion,
        condicion: docAny.condicion,
        estado_conservacion: docAny.estado_conservacion,
        ubicacion_actual: docAny.ubicacion_actual,
        ultimo_lugar_conocido: doc.ultimo_lugar_conocido,
        estado: docAny.estado,
        fecha_registro: doc.fecha_registro,
        hora_registro: docAny.hora_registro,
        imagen: doc.imagen,
        estado_registro: doc.estado_registro,
        etiqueta: doc.etiqueta,
        antiguedadStage: objetoService.getAntiguedadStage(doc.antiguedad),
        condicionEstado: objetoService.getCondicionEstado(doc.antiguedad),
    };
}

/**
 * GET /api/inventario
 */
export const GET: APIRoute = async ({ request }) => {
    const startTime = Date.now();

    try {
        const rateLimitResult = await rateLimitApiGet(request);
        if (!rateLimitResult.success) {
            return secureJsonResponse(
                { error: 'Demasiadas solicitudes' },
                429,
                rateLimitResult.headers
            );
        }

        const url = new URL(request.url);
        const estado_registro = url.searchParams.get('estado_registro') || CONFIG.DEFAULT_ESTADO_REGISTRO;

        if (!CONFIG.VALID_ESTADOS.includes(estado_registro as any)) {
            return secureJsonResponse({ error: 'Estado inválido' }, 400);
        }

        const cacheKey = getCacheKey(estado_registro);
        const bypassCache = url.searchParams.get('nocache') === '1';

        if (!bypassCache) {
            const cached = await redis.get<ObjetoResponseDTO[]>(cacheKey);
            if (cached) {
                logger.debug('Cache HIT', {
                    key: cacheKey,
                    size: cached.length,
                    latency: Date.now() - startTime
                });

                return secureJsonResponse(
                    { objetos: cached, source: 'cache' },
                    200,
                    { ...rateLimitResult.headers, 'X-Cache': 'HIT' }
                );
            }
        } else {
            logger.info('Cache bypassed via query param');
        }

        await connectDB();

        const objetos = await Objeto
            .find({ estado_registro })
            .lean<IObjeto[]>()
            .exec();

        if (objetos.length === 0) {
            logger.info('Empty result set', { estado_registro });
            return secureJsonResponse(
                { objetos: [], source: 'database' },
                200,
                { ...rateLimitResult.headers, 'X-Cache': 'MISS' }
            );
        }

        const responseData = objetos.map(toResponseDTO);

        if (responseData.length > 0 && objetos.length > 0) {
            logger.debug('First DTO sample', {
                dto: {
                    id: responseData[0].id,
                    origen: responseData[0].origen,
                    codigo: responseData[0].codigo,
                    estado: responseData[0].estado,
                }
            });
        }

        await redis.set(
            cacheKey,
            JSON.stringify(responseData),
            { ex: CONFIG.CACHE_TTL }
        );

        logger.info('Query executed', {
            estado_registro,
            count: objetos.length,
            latency: Date.now() - startTime
        });

        return secureJsonResponse(
            { objetos: responseData, source: 'database' },
            200,
            { ...rateLimitResult.headers, 'X-Cache': 'MISS' }
        );

    } catch (error) {
        logger.error('GET /api/inventario failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            latency: Date.now() - startTime,
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: 'Error del servidor' }, error.statusCode);
        }

        return secureJsonResponse({ error: 'Error interno' }, 500);
    }
};

/**
 * POST /api/inventario
 */
export const POST: APIRoute = async ({ request }) => {
    const startTime = Date.now();

    try {
        const rateLimitResult = await rateLimit(request);
        if (!rateLimitResult.success) {
            return secureJsonResponse(
                { error: 'Límite de solicitudes alcanzado' },
                429,
                rateLimitResult.headers
            );
        }

        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > CONFIG.MAX_REQUEST_SIZE) {
            return secureJsonResponse({ error: 'Request demasiado grande' }, 413);
        }

        let rawData: unknown;
        try {
            rawData = await request.json();
        } catch (error) {
            return secureJsonResponse({ error: 'JSON inválido' }, 400);
        }

        const validationResult = CreateObjetoSchema.safeParse(rawData);
        if (!validationResult.success) {
            logger.warn('Validation failed', {
                errors: validationResult.error.issues.map(i => i.path.join('.'))
            });

            return secureJsonResponse(
                { error: 'Datos inválidos' },
                400
            );
        }

        const data = validationResult.data;

        // Profanity check
        const textFieldsToCheck = [
            'nombre', 'tipo_objeto', 'clasificacion', 'ultimo_lugar_conocido', 'pais_origen'
        ] as const;

        const profanityValidation = validateDataProfanity(data, textFieldsToCheck);
        if (!profanityValidation.isValid) {
            return secureJsonResponse(
                { error: 'Contenido inapropiado detectado' },
                400
            );
        }

        // Turnstile verification
        const turnstileToken = data['cf-turnstile-response'] || data.captchaToken;
        if (!turnstileToken) {
            return secureJsonResponse({ error: 'Verificación requerida' }, 400);
        }

        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        const turnstileVerification = await verifyTurnstileToken(turnstileToken, ip);
        if (!turnstileVerification.success) {
            return secureJsonResponse({ error: 'Verificación fallida' }, 400);
        }

        await connectDB();

        const paisOrigenSeguro: string = data.origen === 'N'
            ? 'Nacional'
            : (data.pais_origen || 'Desconocido');

        if (typeof paisOrigenSeguro !== 'string') {
            throw new Error('País de origen inválido');
        }

        const objetoData = {
            nombre: data.nombre,
            codigo: data.codigo || '',
            antiguedad: data.antiguedad || 0,
            categoria: data.categoria || '',
            origen: data.origen || 'N',
            pais_origen: paisOrigenSeguro,
            tipo_objeto: data.tipo_objeto,
            clasificacion: data.clasificacion,
            condicion: data.condicion,
            estado_conservacion: data.estado_conservacion,
            ubicacion_actual: data.ubicacion_actual,
            ultimo_lugar_conocido: data.ultimo_lugar_conocido,
            estado: data.estado,
            fecha_registro: data.fecha_registro || new Date().toISOString().split('T')[0],
            hora_registro: data.hora_registro,
            imagen: data.imagen,
            estado_registro: 'pendiente' as const,
        };

        const newObjeto = await objetoService.createObjeto(objetoData);

        try {
            await Promise.all([
                redis.del(getCacheKey('pendiente')),
                redis.del(getCacheKey('aprobado')),
            ]);
        } catch (cacheError) {
            logger.warn('Cache invalidation failed', {
                error: cacheError instanceof Error ? cacheError.message : 'Unknown'
            });
        }

        logger.info('Record created', {
            id: newObjeto._id.toString(),
            latency: Date.now() - startTime
        });

        return secureJsonResponse(
            {
                success: true,
                data: toResponseDTO(newObjeto),
            },
            201
        );

    } catch (error) {
        logger.error('POST /api/inventario failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            latency: Date.now() - startTime,
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: 'Error del servidor' }, error.statusCode);
        }

        return secureJsonResponse({ error: 'Error al crear registro' }, 500);
    }
};
