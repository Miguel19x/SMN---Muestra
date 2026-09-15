/**
 * API: Subida de Imágenes a R2
 * Refactorizada a TypeScript
 * 
 * MEJORAS:
 * - Type safety
 * - Validación de input
 * - Mejor manejo de errores
 * - Logging estructurado (sin PII)
 * - Rate limiting
 */

import type { APIRoute } from 'astro';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { z } from 'zod';
import redis from '../../lib/redis';
import { CustomError } from '../../lib/CustomError';
import { r2Client, bucketName, ensureR2Available } from '../../lib/r2-client';
import { secureJsonResponse } from '../../middleware/securityHeaders';
import { rateLimit } from '../../middleware/rateLimiter';
import { R2_CONFIG, VALIDATION_CONFIG } from '../../config/app.config';

// ✅ Validación del request
const UploadImageSchema = z.object({
    key: z.string()
        .min(1, 'Key is required')
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM)
        .regex(/^[a-zA-Z0-9\-_\.]+$/, 'Invalid key format'),
});

// ✅ Interface para metadata
interface ImageMetadata {
    type: string;
    size?: number;
    name?: string;
}

/**
 * POST /api/upload-image
 * Sube una imagen desde Redis cache a R2
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

        // ✅ Validar que R2 esté configurado
        ensureR2Available();

        // ✅ Parse y validar input
        let rawData: unknown;
        try {
            rawData = await request.json();
        } catch {
            return secureJsonResponse({ error: 'JSON inválido' }, 400);
        }

        const validationResult = UploadImageSchema.safeParse(rawData);
        if (!validationResult.success) {
            return secureJsonResponse(
                {
                    error: 'Datos inválidos',
                    details: validationResult.error.issues,
                },
                400
            );
        }

        const { key } = validationResult.data;

        // ✅ Obtener datos de Redis con tipo
        const [imageData, metadataString] = await Promise.all([
            redis.get<string>(`${key}:data`),
            redis.get<string>(`${key}:metadata`),
        ]);

        if (!imageData || !metadataString) {
            return secureJsonResponse(
                { error: 'Imagen no encontrada en cache' },
                404
            );
        }

        // ✅ Parse metadata con validación
        let metadata: ImageMetadata;
        try {
            if (typeof metadataString === 'string') {
                metadata = JSON.parse(metadataString) as ImageMetadata;
            } else {
                metadata = metadataString as ImageMetadata;
            }

            // Validar que tenga el campo type
            if (!metadata.type || typeof metadata.type !== 'string') {
                throw new Error('Invalid metadata: type is required');
            }
        } catch (error) {
            console.error('Metadata parsing failed', {
                error: error instanceof Error ? error.message : 'Unknown',
                timestamp: new Date().toISOString(),
            });
            return secureJsonResponse(
                { error: 'Formato de metadata inválido' },
                500
            );
        }

        // ✅ Procesar base64 data
        const base64Data = imageData.includes('base64,')
            ? imageData.split('base64,')[1]
            : imageData;

        if (!base64Data) {
            return secureJsonResponse({ error: 'Datos de imagen inválidos' }, 400);
        }

        // ✅ Convertir a buffer
        let buffer: Buffer;
        try {
            buffer = Buffer.from(base64Data, 'base64');
        } catch {
            return secureJsonResponse(
                { error: 'Error al decodificar imagen' },
                400
            );
        }

        // ✅ Validar tamaño (10MB max)
        const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
        if (buffer.length > MAX_IMAGE_SIZE) {
            return secureJsonResponse(
                { error: 'Imagen demasiado grande (máx 10MB)' },
                413
            );
        }

        // ✅ Crear comando S3
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: metadata.type,
            ContentLength: buffer.length,
            // ✅ Metadata adicional
            Metadata: {
                uploadedAt: new Date().toISOString(),
            },
        });

        // ✅ Upload a R2
        await r2Client!.send(command);

        // ✅ Construir URL pública
        const imageUrl = `${R2_CONFIG.PUBLIC_URL}/${key}`;

        // ✅ Opcional: Eliminar de cache después de upload exitoso
        try {
            await Promise.all([
                redis.del(`${key}:data`),
                redis.del(`${key}:metadata`),
            ]);
        } catch (cacheError) {
            // No crítico si falla la limpieza de cache
            console.warn('Cache cleanup failed', {
                key,
                error: cacheError instanceof Error ? cacheError.message : 'Unknown',
            });
        }

        return secureJsonResponse(
            {
                success: true,
                url: imageUrl,
            },
            200
        );

    } catch (error) {
        // ✅ Logging estructurado (sin PII)
        console.error('POST /api/upload-image failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse(
            { error: 'Error al subir la imagen' },
            500
        );
    }
};
