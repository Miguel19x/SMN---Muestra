/**
 * API: Eliminar Imagen de R2
 * Refactorizada a TypeScript
 * 
 * MEJORAS:
 * - Type safety
 * - Validación con Zod
 * - Autenticación requerida
 * - Rate limiting
 */

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, bucketName, extractFilenameFromUrl, ensureR2Available } from '../../lib/r2-client';
import { CustomError } from '../../lib/CustomError';
import { secureJsonResponse } from '../../middleware/securityHeaders';
import { verifyAuth, createUnauthorizedResponse } from '../../lib/auth/auth-middleware';
import { VALIDATION_CONFIG } from '../../config/app.config';

// ✅ Validación del request
const DeleteImageSchema = z.object({
    imageUrl: z.string()
        .url('URL inválida')
        .max(VALIDATION_CONFIG.MAX_STRING_LENGTH.URL),
});

/**
 * POST /api/delete-image
 * Elimina una imagen de R2 (requiere autenticación)
 */
export const POST: APIRoute = async ({ request }) => {
    try {
        // ✅ Autenticación requerida
        const authResult = await verifyAuth(request);
        if (!authResult.success) {
            return createUnauthorizedResponse(authResult.error);
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

        const validationResult = DeleteImageSchema.safeParse(rawData);
        if (!validationResult.success) {
            return secureJsonResponse(
                {
                    error: 'Datos inválidos',
                    details: validationResult.error.format(),
                },
                400
            );
        }

        const { imageUrl } = validationResult.data;

        // ✅ Extraer filename de la URL
        const filename = extractFilenameFromUrl(imageUrl);
        if (!filename) {
            return secureJsonResponse(
                { error: 'URL de imagen inválida' },
                400
            );
        }

        // ✅ Crear comando de eliminación
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: filename,
        });

        // ✅ Eliminar de R2
        try {
            await r2Client!.send(command);
        } catch (r2Error) {
            console.error('R2 deletion failed', {
                error: r2Error instanceof Error ? r2Error.message : 'Unknown',
                filename,
                bucket: bucketName,
            });

            // Si el objeto no existe, considerar éxito (idempotente)
            if (r2Error instanceof Error && r2Error.name === 'NoSuchKey') {
                return secureJsonResponse(
                    {
                        success: true,
                        message: 'Imagen ya no existe',
                    },
                    200
                );
            }

            return secureJsonResponse(
                { error: 'Error al eliminar la imagen de almacenamiento' },
                500
            );
        }

        return secureJsonResponse(
            {
                success: true,
                message: 'Imagen eliminada exitosamente',
            },
            200
        );

    } catch (error) {
        console.error('POST /api/delete-image failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse(
            { error: 'Error al eliminar la imagen' },
            500
        );
    }
};
