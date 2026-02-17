/**
 * API: Aprobar Desaparecido
 * Refactorizada a TypeScript
 * 
 * MEJORAS:
 * - Type safety
 * - Validación con ObjectIdSchema
 * - Cache invalidation
 * - Logging estructurado
 * - Service layer integration
 */

import type { APIRoute } from 'astro';
import { connectDB } from '../../../../lib/mongodb';
import { CustomError } from '../../../../lib/CustomError';
import { Desaparecido } from '../../../../models/desaparecido';
import { verifyAuth, createUnauthorizedResponse } from '../../../../lib/auth/auth-middleware';
import { secureJsonResponse } from '../../../../middleware/securityHeaders';
import { ObjectIdSchema } from '../../../../validators/schemas';
import { DesaparecidoService } from '../../../../services/desaparecido.service';
import redis from '../../../../lib/redis';

const desaparecidoService = new DesaparecidoService();

/**
 * POST /api/desaparecidos/[id]/accept
 * Aprobar un registro de desaparecido (requiere autenticación)
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

        // ✅ Buscar y actualizar usando MongoDB ObjectId
        const desaparecido = await Desaparecido.findById(mongoId);
        if (!desaparecido) {
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        // ✅ Actualizar estado
        desaparecido.estado_registro = 'aprobado';
        desaparecido.etiqueta = undefined; // Eliminar etiqueta pendiente
        await desaparecido.save();

        // ✅ Invalidar caches relevantes
        await Promise.all([
            redis.del('desaparecidos:pendiente'),
            redis.del('desaparecidos:aprobado'),
        ]);

        // ✅ Logging estructurado (sin PII)
        console.log('Desaparecido approved', {
            id: id.substring(0, 8) + '...',
            timestamp: new Date().toISOString(),
        });

        return secureJsonResponse(
            {
                success: true,
                message: 'Registro aprobado con éxito',
                data: {
                    id,
                    estado_registro: 'aprobado',
                },
            },
            200
        );

    } catch (error) {
        console.error('POST /api/desaparecidos/[id]/accept failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse(
            { error: 'Error al procesar el registro' },
            500
        );
    }
};
