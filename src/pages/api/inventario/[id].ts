/**
 * API: Desaparecidos por ID
 * Refactorizada a TypeScript
 * 
 * MEJORAS:
 * - Type safety
 * - Validación estricta de ObjectId
 * - Service layer
 * - DTOs para responses
 */

import type { APIRoute } from 'astro';
import { Types } from 'mongoose';
import { connectDB } from '../../../lib/mongodb';
import { CustomError } from '../../../lib/CustomError';
import { Objeto } from '../../../models/objeto';
import { verifyAuth, createUnauthorizedResponse } from '../../../lib/auth/auth-middleware';
import { secureJsonResponse } from '../../../middleware/securityHeaders';
import { ObjectIdSchema } from '../../../validators/schemas';
import { ObjetoService } from '../../../services/objeto.service';
import { createPublicId } from '../../../lib/security/idObfuscation';
import { getDemoObjetoById, updateDemoObjeto } from '../../../lib/demoData';

const { ObjectId } = Types;
const objetoService = new ObjetoService();

/**
 * GET /api/inventario/[id]
 * Obtener un desaparecido por ID
 */
export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return secureJsonResponse({ error: 'ID es requerido' }, 400);
        }

        if (id.startsWith('demo-')) {
            const demoObj = getDemoObjetoById(id);
            if (demoObj) {
                return secureJsonResponse(demoObj, 200);
            }
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        try {
            await connectDB();
        } catch (dbErr) {
            const fallback = getDemoObjetoById(id);
            if (fallback) {
                return secureJsonResponse(fallback, 200);
            }
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        // ✅ REFACTORIZACIÓN: Resolver ID público a MongoDB ObjectId
        // El frontend ahora envía IDs ofuscados en vez de ObjectIds
        const { publicIdMapper } = await import('../../../lib/security/idObfuscation');
        const mongoId = publicIdMapper.getMongoId(id);

        // Si no está en cache, usar findByPublicId del servicio
        let objeto;
        if (mongoId) {
            objeto = await Objeto.findById(mongoId).lean();
        } else {
            // Fallback: buscar usando public ID directamente
            objeto = await objetoService.findByPublicId(id);
        }

        if (!objeto) {
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        // Si encontramos por fallback, cachear para futuros requests
        if (!mongoId && objeto) {
            publicIdMapper.register(objeto._id.toString(), id);
        }

        const response = {
            id: createPublicId(objeto._id.toString()),
            _id: objeto._id.toString(),

            origen: objeto.origen || 'N',
            nombre: objeto.nombre,
            codigo: objeto.codigo || 'Desconocido',
            antiguedad: objeto.antiguedad,
            categoria: objeto.categoria,
            pais_origen: objeto.pais_origen,
            fecha_registro: objeto.fecha_registro,
            hora: (objeto as any).hora,
            imagen: objeto.imagen,

            estado: (objeto as any).estado,
            tipo_objeto: objeto.tipo_objeto,
            clasificacion: objeto.clasificacion,
            ultimo_lugar_conocido: objeto.ultimo_lugar_conocido,
            ubicacion_actual: objeto.ubicacion_actual,
            condicion: objeto.condicion,
            estado_conservacion: objeto.estado_conservacion,

            estado_registro: objeto.estado_registro,
            etiqueta: objeto.etiqueta,

            antiguedadStage: objetoService.getAntiguedadStage(objeto.antiguedad),
            condicionEstado: objetoService.getCondicionEstado(objeto.antiguedad),
        };

        return secureJsonResponse(response, 200);

    } catch (error) {
        console.error('GET /api/inventario/[id] failed', {
            error: error instanceof Error ? error.message : 'Unknown',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse({ error: 'Error al obtener el registro' }, 500);
    }
};

/**
 * PUT /api/inventario/[id]
 * Actualizar un desaparecido (requiere autenticación)
 */
export const PUT: APIRoute = async ({ params, request }) => {
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
            let body: any;
            try {
                body = await request.json();
            } catch {
                return secureJsonResponse({ error: 'JSON inválido' }, 400);
            }
            const updated = updateDemoObjeto(id, body);
            if (updated) {
                return secureJsonResponse({ success: true, message: 'Registro demo actualizado', data: updated }, 200);
            }
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        await connectDB();

        // ✅ Validación estricta de ObjectId
        const validationResult = ObjectIdSchema.safeParse(id);
        if (!validationResult.success) {
            return secureJsonResponse({ error: 'ID inválido' }, 400);
        }

        // ✅ Parse body
        let body: any;
        try {
            body = await request.json();
        } catch {
            return secureJsonResponse({ error: 'JSON inválido' }, 400);
        }

        // ✅ No permitir actualizar ciertos campos
        const { _id, __v, createdAt, ...updateData } = body;

        // Actualizar
        const updatedObjeto = await Objeto.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedObjeto) {
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        // ✅ Invalidar cache si cambió el estado
        if (updateData.estado_registro) {
            // TODO: Implementar invalidación de cache
        }

        // ✅ Transformar a DTO
        const response = {
            id: createPublicId(updatedObjeto._id.toString()),
            nombre: updatedObjeto.nombre,
            codigo: updatedObjeto.codigo,
            antiguedad: updatedObjeto.antiguedad,
            categoria: updatedObjeto.categoria,
            pais_origen: updatedObjeto.pais_origen,
            fecha_registro: updatedObjeto.fecha_registro,
            imagen: updatedObjeto.imagen,
            estado_registro: updatedObjeto.estado_registro,
            etiqueta: updatedObjeto.etiqueta,
        };

        return secureJsonResponse(
            {
                success: true,
                data: response,
            },
            200
        );

    } catch (error) {
        console.error('PUT /api/inventario/[id] failed', {
            error: error instanceof Error ? error.message : 'Unknown',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse({ error: 'Error al actualizar el registro' }, 500);
    }
};
