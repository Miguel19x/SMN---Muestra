/**
 * API: Restaurar Objeto Archivado
 * 
 * Cambia estado_registro de 'archivado' a 'aprobado'
 * y limpia los campos de archivado.
 */

import type { APIRoute } from 'astro';
import { connectDB } from '../../../../lib/mongodb';
import { CustomError } from '../../../../lib/CustomError';
import { Objeto } from '../../../../models/objeto';
import { verifyAuth, createUnauthorizedResponse } from '../../../../lib/auth/auth-middleware';
import { secureJsonResponse } from '../../../../middleware/securityHeaders';
import { ObjectIdSchema } from '../../../../validators/schemas';
import redis from '../../../../lib/redis';
import { restoreDemoObjeto } from '../../../../lib/demoData';

/**
 * POST /api/inventario/[id]/restore
 * Restaurar un objeto archivado a estado aprobado (requiere autenticación)
 */
export const POST: APIRoute = async ({ params, request }) => {
    try {
        // ✅ Autenticación requerida
        const authResult = await verifyAuth(request);
        if (!authResult.success) {
            return createUnauthorizedResponse(authResult.error);
        }

        const { id } = params;

        if (!id) {
            return secureJsonResponse({ error: 'ID es requerido' }, 400);
        }

        if (id.startsWith('demo-')) {
            restoreDemoObjeto(id);
            return secureJsonResponse({
                success: true,
                message: 'Objeto restaurado exitosamente (Modo Demo)',
                id,
            }, 200);
        }

        await connectDB();

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

        // ✅ Verificar que el objeto existe y está archivado
        const objeto = await Objeto.findById(mongoId);
        if (!objeto) {
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        if (objeto.estado_registro !== 'archivado') {
            return secureJsonResponse(
                { error: 'Solo se pueden restaurar registros archivados' },
                400
            );
        }

        // ✅ Restaurar: cambiar estado a aprobado y limpiar campos de archivado
        objeto.estado_registro = 'aprobado';
        objeto.fecha_archivado = undefined;
        objeto.motivo_archivado = undefined;
        await objeto.save();

        // ✅ Invalidar todos los caches relevantes
        await Promise.all([
            redis.del('objetos:pendiente'),
            redis.del('objetos:aprobado'),
            redis.del('objetos:archivado'),
            redis.del('api:objetos:pendiente:v8'),
            redis.del('api:objetos:aprobado:v8'),
            redis.del('api:objetos:archivado:v8'),
        ]);

        // ✅ Logging estructurado (sin PII)
        console.log('Objeto restored from archive', {
            id: id.substring(0, 8) + '...',
            timestamp: new Date().toISOString(),
        });

        return secureJsonResponse(
            {
                success: true,
                message: 'Registro restaurado exitosamente',
                data: {
                    id,
                    estado_registro: 'aprobado',
                },
            },
            200
        );

    } catch (error) {
        console.error('POST /api/inventario/[id]/restore failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse(
            { error: 'Error al restaurar el registro' },
            500
        );
    }
};
