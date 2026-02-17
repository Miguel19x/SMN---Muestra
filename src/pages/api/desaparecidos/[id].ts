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
import { Desaparecido } from '../../../models/desaparecido';
import { verifyAuth, createUnauthorizedResponse } from '../../../lib/auth/auth-middleware';
import { secureJsonResponse } from '../../../middleware/securityHeaders';
import { ObjectIdSchema } from '../../../validators/schemas';
import { DesaparecidoService } from '../../../services/desaparecido.service';
import { createPublicId } from '../../../lib/security/idObfuscation';

const { ObjectId } = Types;
const desaparecidoService = new DesaparecidoService();

/**
 * GET /api/desaparecidos/[id]
 * Obtener un desaparecido por ID
 */
export const GET: APIRoute = async ({ params }) => {
    try {
        await connectDB();

        const { id } = params;

        if (!id) {
            return secureJsonResponse({ error: 'ID es requerido' }, 400);
        }

        // ✅ REFACTORIZACIÓN: Resolver ID público a MongoDB ObjectId
        // El frontend ahora envía IDs ofuscados en vez de ObjectIds
        const { publicIdMapper } = await import('../../../lib/security/idObfuscation');
        const mongoId = publicIdMapper.getMongoId(id);

        // Si no está en cache, usar findByPublicId del servicio
        let desaparecido;
        if (mongoId) {
            desaparecido = await Desaparecido.findById(mongoId).lean();
        } else {
            // Fallback: buscar usando public ID directamente
            desaparecido = await desaparecidoService.findByPublicId(id);
        }

        if (!desaparecido) {
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        // Si encontramos por fallback, cachear para futuros requests
        if (!mongoId && desaparecido) {
            publicIdMapper.register(desaparecido._id.toString(), id);
        }

        // ✅ Transformar a DTO completo (incluir TODOS los campos)
        const response = {
            // IDs
            id: createPublicId(desaparecido._id.toString()),
            _id: desaparecido._id.toString(), // Keep for backward compatibility

            // Core fields
            extranjero: desaparecido.extranjero || 'V',
            nombre: desaparecido.nombre,
            cedula: desaparecido.cedula || 'Desconocida',
            edad: desaparecido.edad,
            sexo: desaparecido.sexo,
            nacionalidad: desaparecido.nacionalidad,
            fecha: desaparecido.fecha,
            hora: (desaparecido as any).hora,
            imagen: desaparecido.imagen,

            // Location and details
            estado: (desaparecido as any).estado, // ✅ Estado geográfico (Anzoátegui, Carabobo, etc.)
            profesion: desaparecido.profesion,
            etnia: desaparecido.etnia,
            lugar_de_desaparicion: desaparecido.lugar_de_desaparicion,
            lugar_de_confinamiento: desaparecido.lugar_de_confinamiento,
            condicion_de_salud: desaparecido.condicion_de_salud,
            discapacidad: desaparecido.discapacidad,

            // Status
            estado_registro: desaparecido.estado_registro,
            etiqueta: desaparecido.etiqueta,

            // Campos calculados
            ageStage: desaparecidoService.getAgeStage(desaparecido.edad),
            legalCondition: desaparecidoService.getLegalCondition(desaparecido.edad),
        };

        return secureJsonResponse(response, 200);

    } catch (error) {
        console.error('GET /api/desaparecidos/[id] failed', {
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
 * PUT /api/desaparecidos/[id]
 * Actualizar un desaparecido (requiere autenticación)
 */
export const PUT: APIRoute = async ({ params, request }) => {
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
        const updatedDesaparecido = await Desaparecido.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedDesaparecido) {
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        // ✅ Invalidar cache si cambió el estado
        if (updateData.estado_registro) {
            // TODO: Implementar invalidación de cache
        }

        // ✅ Transformar a DTO
        const response = {
            id: createPublicId(updatedDesaparecido._id.toString()),
            nombre: updatedDesaparecido.nombre,
            cedula: updatedDesaparecido.cedula,
            edad: updatedDesaparecido.edad,
            sexo: updatedDesaparecido.sexo,
            nacionalidad: updatedDesaparecido.nacionalidad,
            fecha: updatedDesaparecido.fecha,
            imagen: updatedDesaparecido.imagen,
            estado_registro: updatedDesaparecido.estado_registro,
            etiqueta: updatedDesaparecido.etiqueta,
        };

        return secureJsonResponse(
            {
                success: true,
                data: response,
            },
            200
        );

    } catch (error) {
        console.error('PUT /api/desaparecidos/[id] failed', {
            error: error instanceof Error ? error.message : 'Unknown',
            timestamp: new Date().toISOString(),
        });

        if (error instanceof CustomError) {
            return secureJsonResponse({ error: error.message }, error.statusCode);
        }

        return secureJsonResponse({ error: 'Error al actualizar el registro' }, 500);
    }
};
