/**
 * API: Cache de Imágenes en Redis
 * Refactorizada a TypeScript
 * 
 * MEJORAS:
 * - Type safety
 * - Validación con Zod
 * - Rate limiting
 * - Mejor manejo de errores
 */

import type { APIRoute } from 'astro';
import { z } from 'zod';
import redis from '../../lib/redis';
import { CustomError } from '../../lib/CustomError';
import { secureJsonResponse } from '../../middleware/securityHeaders';
import { rateLimit } from '../../middleware/rateLimiter';
import { VALIDATION_CONFIG } from '../../config/app.config';

// ✅ Configuración
const CACHE_TTL = 3600; // 1 hora
const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB

// ✅ Validación del archivo
const CacheImageSchema = z.object({
    file: z.object({
        data: z.string().min(1, 'File data is required'),
        type: z.string()
            .regex(/^image\/(jpeg|jpg|png|webp|gif)$/i, 'Invalid image type')
            .max(50),
        name: z.string()
            .min(1)
            .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM),
        size: z.number()
            .int()
            .min(1, 'File size must be positive')
            .max(MAX_FILE_SIZE, `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`),
    }),
});

/**
 * POST /api/cache-image
 * Almacena imagen en Redis temporalmente
 */
export const POST: APIRoute = async ({ request }) => {
    try {
        // ✅ Rate limiting
        const rateLimitResult = await rateLimit(request);
        if (!rateLimitResult.success) {
            return secureJsonResponse(
                { error: rateLimitResult.message },
                429,
                rateLimitResult.headers
            );
        }

        // ✅ Validar Content-Length
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
            return secureJsonResponse(
                { error: `Archivo demasiado grande (máx ${MAX_FILE_SIZE / 1024 / 1024}MB)` },
                413
            );
        }

        // ✅ Parse y validar input
        let rawData: unknown;
        try {
            rawData = await request.json();
        } catch {
            return secureJsonResponse({ error: 'JSON inválido' }, 400);
        }

        const validationResult = CacheImageSchema.safeParse(rawData);
        if (!validationResult.success) {
            return secureJsonResponse(
                {
                    error: 'Datos inválidos',
                    details: validationResult.error.format(),
                },
                400
            );
        }

        const { file } = validationResult.data;

        // ✅ Generar key única y segura
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const imageKey = `temp_${timestamp}_${randomSuffix}_${sanitizedName}`;

        // ✅ Procesar imageData (puede ser base64 o Buffer)
        let imageData = file.data;

        // Si es un objeto con type='Buffer', convertir
        if (
            typeof imageData === 'object' &&
            imageData !== null &&
            'type' in imageData &&
            (imageData as any).type === 'Buffer' &&
            'data' in imageData
        ) {
            imageData = Buffer.from((imageData as any).data).toString('base64');
        }

        // ✅ Almacenar en Redis con TTL
        try {
            await Promise.all([
                redis.set(`${imageKey}:data`, imageData, { ex: CACHE_TTL }),
                redis.set(
                    `${imageKey}:metadata`,
                    JSON.stringify({
                        type: file.type,
                        size: file.size,
                        name: file.name,
                        cachedAt: new Date().toISOString(),
                    }),
                    { ex: CACHE_TTL }
                ),
            ]);
        } catch (redisError) {
            console.error('Redis storage failed', {
                error: redisError instanceof Error ? redisError.message : 'Unknown',
                key: imageKey,
            });

            return secureJsonResponse(
                { error: 'Error al almacenar imagen temporalmente' },
                500
            );
        }

        // ✅ Respuesta exitosa
        return secureJsonResponse(
            {
                success: true,
                key: imageKey,
                type: file.type,
                name: file.name,
                size: file.size,
                expiresAt: new Date(Date.now() + CACHE_TTL * 1000).toISOString(),
            },
            200
        );

    } catch (error) {
        console.error('POST /api/cache-image failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse(
            { error: 'Error al procesar la imagen' },
            500
        );
    }
};
