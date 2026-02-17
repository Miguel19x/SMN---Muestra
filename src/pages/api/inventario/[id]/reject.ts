/**
 * API: Rechazar/Archivar Objeto
 * 
 * Soft-delete: cambia estado_registro a 'archivado' en vez de eliminar.
 * La imagen en R2 se mantiene para posible restauración.
 */

import type { APIRoute } from 'astro';
import { connectDB } from '../../../../lib/mongodb';
import { CustomError } from '../../../../lib/CustomError';
import { Objeto } from '../../../../models/objeto';
import { verifyAuth, createUnauthorizedResponse } from '../../../../lib/auth/auth-middleware';
import { secureJsonResponse } from '../../../../middleware/securityHeaders';
import { ObjectIdSchema } from '../../../../validators/schemas';
import redis from '../../../../lib/redis';

/**
 * POST /api/inventario/[id]/reject
 * Archivar un registro (soft-delete, requiere autenticación)
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

        // ✅ Leer motivo opcional del body
        let motivo = '';
        try {
            const body = await request.json();
            motivo = body?.motivo || '';
        } catch {
            // Body vacío es válido
        }

        // ✅ Soft-delete: cambiar estado a 'archivado'
        const archivedObjeto = await Objeto.findByIdAndUpdate(
            mongoId,
            {
                estado_registro: 'archivado',
                fecha_archivado: new Date(),
                ...(motivo && { motivo_archivado: motivo }),
            },
            { new: true }
        );

        if (!archivedObjeto) {
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        // ✅ Invalidar todos los caches relevantes
        await Promise.all([
            redis.del('objetos:pendiente'),
            redis.del('objetos:aprobado'),
            redis.del('objetos:archivado'),
            // Also invalidate namespaced cache keys
            redis.del('api:objetos:pendiente:v8'),
            redis.del('api:objetos:aprobado:v8'),
            redis.del('api:objetos:archivado:v8'),
        ]);

        // ✅ Logging estructurado (sin PII)
        console.log('Objeto archived (soft-delete)', {
            id: id.substring(0, 8) + '...',
            hadMotivo: !!motivo,
            timestamp: new Date().toISOString(),
        });

        return secureJsonResponse(
            {
                success: true,
                message: 'Registro archivado exitosamente',
            },
            200
        );

    } catch (error) {
        console.error('POST /api/inventario/[id]/reject failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse(
            { error: 'Error al procesar el archivo' },
            500
        );
    }
};
