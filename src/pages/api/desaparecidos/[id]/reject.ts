/**
 * API: Rechazar Desaparecido
 * Refactorizada a TypeScript
 * 
 * MEJORAS:
 * - Type safety
 * - Validación con ObjectIdSchema
 * - Eliminación segura de imagen en R2
 * - Cache invalidation
 * - Logging estructurado
 */

import type { APIRoute } from 'astro';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { connectDB } from '../../../../lib/mongodb';
import { CustomError } from '../../../../lib/CustomError';
import { Desaparecido } from '../../../../models/desaparecido';
import { r2Client, bucketName, extractFilenameFromUrl, ensureR2Available } from '../../../../lib/r2-client';
import { verifyAuth, createUnauthorizedResponse } from '../../../../lib/auth/auth-middleware';
import { secureJsonResponse } from '../../../../middleware/securityHeaders';
import { ObjectIdSchema } from '../../../../validators/schemas';
import redis from '../../../../lib/redis';

/**
 * Helper: Eliminar imagen de R2
 * - Idempotente (no falla si ya fue eliminada)
 * - Logging de errores
 */
async function deleteImageFromR2(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    const filename = extractFilenameFromUrl(imageUrl);
    if (!filename) {
        console.warn('Invalid image URL for deletion', { imageUrl });
        return;
    }

    ensureR2Available();

    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filename,
    });

    try {
        await r2Client!.send(command);
        console.log('Image deleted from R2', {
            filename: filename.substring(0, 20) + '...',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        // ✅ No crítico si la imagen no existe
        if (error instanceof Error && error.name === 'NoSuchKey') {
            console.log('Image already deleted or not found in R2', { filename });
            return;
        }

        console.error('Error deleting image from R2', {
            error: error instanceof Error ? error.message : 'Unknown',
            filename,
        });
    }
}

/**
 * POST /api/desaparecidos/[id]/reject
 * Rechazar y eliminar un registro de desaparecido (requiere autenticación)
 */
export const POST: APIRoute = async ({ params, request }) => {
    try {
        // ✅ Autenticación requerida
        const authResult = await verifyAuth(request);
        if (!authResult.success) {
            return createUnauthorizedResponse(authResult.error);
        }

        await connectDB();

        const { id } = params;

        if (!id) {
            return secureJsonResponse({ error: 'ID es requerido' }, 400);
        }

        // ✅ Convert Public ID to MongoDB ObjectId
        const { publicIdMapper } = await import('../../../../lib/security/idObfuscation');
        const mongoId = publicIdMapper.getMongoId(id);

        if (!mongoId) {
            return secureJsonResponse({ error: 'ID inválido' }, 400);
        }

        // ✅ Validación estricta de MongoDB ObjectId
        const validationResult = ObjectIdSchema.safeParse(mongoId);
        if (!validationResult.success) {
            return secureJsonResponse({ error: 'ID inválido' }, 400);
        }

        // ✅ Eliminar registro usando MongoDB ObjectId
        const deletedDesaparecido = await Desaparecido.findByIdAndDelete(mongoId);
        if (!deletedDesaparecido) {
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        // ✅ Eliminar imagen asociada de R2 (si existe)
        if (deletedDesaparecido.imagen) {
            await deleteImageFromR2(deletedDesaparecido.imagen);
        }

        // ✅ Invalidar todos los caches
        await Promise.all([
            redis.del('desaparecidos:pendiente'),
            redis.del('desaparecidos:aprobado'),
            redis.del('desaparecidos:rechazado'),
        ]);

        // ✅ Logging estructurado (sin PII)
        console.log('Desaparecido rejected and deleted', {
            id: id.substring(0, 8) + '...',
            hadImage: !!deletedDesaparecido.imagen,
            timestamp: new Date().toISOString(),
        });

        return secureJsonResponse(
            {
                success: true,
                message: 'Registro rechazado y eliminado exitosamente',
            },
            200
        );

    } catch (error) {
        console.error('POST /api/desaparecidos/[id]/reject failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse(
            { error: 'Error al procesar el rechazo' },
            500
        );
    }
};
