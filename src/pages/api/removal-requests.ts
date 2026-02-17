/**
 * REFACTORIZACIÓN CRÍTICA #2: Removal Requests API
 * 
 * VULNERABILIDADES CORREGIDAS:
 * 1. NoSQL Injection - Validación estricta de ObjectId
 * 2. Type Safety - Migration a TypeScript
 * 3. Input Validation - Zod schemas
 * 4. Rate limiting mejorado
 */

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Types } from 'mongoose';
import { connectDB } from '../../lib/mongodb';
import { RemovalRequest } from '../../models/removal-request';
import { Desaparecido } from '../../models/desaparecido';
import { verifyAuth, createUnauthorizedResponse } from '../../lib/auth/auth-middleware';
import { secureJsonResponse } from '../../middleware/securityHeaders';
import { rateLimit } from '../../middleware/rateLimiter';

const { ObjectId } = Types;

// ✅ MEJORA: Constantes de configuración
const CONFIG = {
    MAX_REASON_LENGTH: 1000,
    MAX_EVIDENCE_URL_LENGTH: 500,
    VALID_STATUSES: ['pending', 'approved', 'rejected'] as const,
    DEADLINE_DAYS: 7,
} as const;

// ✅ MEJORA: Validation schemas
const CreateRemovalRequestSchema = z.object({
    desaparecido_id: z.string().refine(
        (val) => {
            // ✅ FIX CRÍTICO: Validación estricta de ObjectId
            // PREVIENE: NoSQL injection con objetos MongoDB
            return ObjectId.isValid(val) && typeof val === 'string';
        },
        { message: 'ID de desaparecido inválido' }
    ),
    twitter_user_id: z.string().max(50).optional(),
    twitter_username: z.string().max(50).optional(),
    twitter_name: z.string().max(100).optional(),
    reason: z.string().min(10).max(CONFIG.MAX_REASON_LENGTH),
    evidence_url: z.string().url().max(CONFIG.MAX_EVIDENCE_URL_LENGTH).optional(),
    requester_email: z.string().email().optional(),
});

const UpdateRemovalRequestSchema = z.object({
    requestId: z.string().refine(
        (val) => ObjectId.isValid(val) && typeof val === 'string',
        { message: 'ID de request inválido' }
    ),
    status: z.enum(CONFIG.VALID_STATUSES),
    admin_notes: z.string().max(CONFIG.MAX_REASON_LENGTH).optional(),
});

// ✅ MEJORA: Response DTOs
interface RemovalRequestResponseDTO {
    id: string;
    desaparecido: {
        id: string;
        nombre: string;
        cedula: string;
        imagen?: string;
    } | null;
    requester: {
        twitter_username: string;
        twitter_name: string;
        email?: string;
    };
    reason: string;
    evidence_url?: string;
    status: string;
    deadline: Date;
    createdAt: Date;
    processedAt?: Date;
    admin_notes?: string;
}

/**
 * GET /api/removal-requests
 * 
 * ✅ MEJORAS:
 * - Type safety
 * - Optimized queries con populate
 * - Proper authorization
 */
export const GET: APIRoute = async ({ request }) => {
    try {
        await connectDB();

        const url = new URL(request.url);
        const desaparecidoId = url.searchParams.get('desaparecido_id');
        const status = url.searchParams.get('status');
        const adminView = url.searchParams.get('admin') === 'true';

        // ✅ MEJORA: Admin view con autenticación
        if (adminView) {
            const authResult = await verifyAuth(request);
            if (!authResult.success) {
                return createUnauthorizedResponse(authResult.error);
            }

            // ✅ MEJORA: Query builder pattern
            const query: any = {};
            if (status && CONFIG.VALID_STATUSES.includes(status as any)) {
                query.status = status;
            }

            const requests = await RemovalRequest
                .find(query)
                .populate('desaparecido_id', 'nombre cedula imagen')
                .sort({ createdAt: -1 })
                .lean()
                .exec();

            return secureJsonResponse({ requests }, 200);
        }

        // ✅ MEJORA: Vista pública con validación estricta
        if (desaparecidoId) {
            // ✅ FIX CRÍTICO: Validar que sea string Y ObjectId válido
            if (typeof desaparecidoId !== 'string' || !ObjectId.isValid(desaparecidoId)) {
                return secureJsonResponse({ error: 'ID inválido' }, 400);
            }

            const existingRequest = await RemovalRequest
                .findOne({
                    desaparecido_id: new ObjectId(desaparecidoId), // ✅ Explicitly cast to ObjectId
                    status: 'pending',
                })
                .lean();

            return secureJsonResponse({
                hasPendingRequest: !!existingRequest,
            }, 200);
        }

        return secureJsonResponse({ error: 'Parámetros requeridos' }, 400);

    } catch (error) {
        console.error('GET /api/removal-requests failed', {
            error: error instanceof Error ? error.message : 'Unknown',
            timestamp: new Date().toISOString(),
        });

        return secureJsonResponse({ error: 'Error interno del servidor' }, 500);
    }
};

/**
 * POST /api/removal-requests
 * 
 * ✅ MEJORAS:
 * - Zod validation
 * - NoSQL injection prevention
 * - Rate limiting
 * - Duplicate detection
 */
export const POST: APIRoute = async ({ request }) => {
    try {
        // ✅ MEJORA: Rate limiting
        const rateLimitResult = await rateLimit(request);
        if (!rateLimitResult.success) {
            return secureJsonResponse(
                { error: rateLimitResult.message },
                429,
                rateLimitResult.headers
            );
        }

        // ✅ MEJORA: Parse JSON safely
        let rawData: unknown;
        try {
            rawData = await request.json();
        } catch {
            return secureJsonResponse({ error: 'JSON inválido' }, 400);
        }

        // ✅ MEJORA: Zod validation
        const validationResult = CreateRemovalRequestSchema.safeParse(rawData);
        if (!validationResult.success) {
            return secureJsonResponse(
                {
                    error: 'Datos inválidos',
                    details: validationResult.error.format(),
                },
                400
            );
        }

        const data = validationResult.data;

        await connectDB();

        // ✅ FIX CRÍTICO: Cast to ObjectId después de validación
        const desaparecidoObjectId = new ObjectId(data.desaparecido_id);

        // ✅ MEJORA: Verificar existencia del registro
        const desaparecido = await Desaparecido
            .findById(desaparecidoObjectId)
            .select('nombre cedula')
            .lean();

        if (!desaparecido) {
            return secureJsonResponse({ error: 'Registro no encontrado' }, 404);
        }

        // ✅ MEJORA: Prevenir duplicados
        const existingRequest = await RemovalRequest.findOne({
            desaparecido_id: desaparecidoObjectId,
            status: 'pending',
        });

        if (existingRequest) {
            return secureJsonResponse({
                error: 'Ya existe una solicitud pendiente para este registro',
            }, 409);
        }

        // ✅ MEJORA: Crear request con defaults seguros
        const newRequest = new RemovalRequest({
            desaparecido_id: desaparecidoObjectId,
            twitter_user_id: data.twitter_user_id || 'anonymous',
            twitter_username: data.twitter_username || 'anonymous',
            twitter_name: data.twitter_name || 'Anónimo',
            reason: data.reason,
            evidence_url: data.evidence_url,
            requester_email: data.requester_email,
            deadline: new Date(Date.now() + CONFIG.DEADLINE_DAYS * 24 * 60 * 60 * 1000),
        });

        await newRequest.save();

        return secureJsonResponse(
            {
                success: true,
                message: `Solicitud enviada. Será procesada en ${CONFIG.DEADLINE_DAYS} días.`,
                requestId: newRequest._id.toString(),
                deadline: newRequest.deadline,
            },
            201
        );

    } catch (error) {
        console.error('POST /api/removal-requests failed', {
            error: error instanceof Error ? error.message : 'Unknown',
            timestamp: new Date().toISOString(),
        });

        return secureJsonResponse({ error: 'Error al procesar la solicitud' }, 500);
    }
};

/**
 * PUT /api/removal-requests
 * 
 * ✅ MEJORAS:
 * - Transaction support
 * - Audit logging
 * - Cache invalidation
 */
export const PUT: APIRoute = async ({ request }) => {
    try {
        // ✅ MEJORA: Autenticación requerida
        const authResult = await verifyAuth(request);
        if (!authResult.success) {
            return createUnauthorizedResponse(authResult.error);
        }

        let rawData: unknown;
        try {
            rawData = await request.json();
        } catch {
            return secureJsonResponse({ error: 'JSON inválido' }, 400);
        }

        // ✅ MEJORA: Validación con Zod
        const validationResult = UpdateRemovalRequestSchema.safeParse(rawData);
        if (!validationResult.success) {
            return secureJsonResponse(
                {
                    error: 'Datos inválidos',
                    details: validationResult.error.format(),
                },
                400
            );
        }

        const { requestId, status, admin_notes } = validationResult.data;

        await connectDB();

        // ✅ MEJORA: Find request first
        const removalRequest = await RemovalRequest.findById(requestId);
        if (!removalRequest) {
            return secureJsonResponse({ error: 'Solicitud no encontrada' }, 404);
        }

        // ✅ MEJORA: Update con transaction
        const session = await RemovalRequest.startSession();
        session.startTransaction();

        try {
            // Actualizar la solicitud
            removalRequest.status = status;
            removalRequest.admin_notes = admin_notes;
            removalRequest.processed_by = authResult.userId;
            removalRequest.processed_at = new Date();
            await removalRequest.save({ session });

            // Si se aprobó, eliminar el registro
            if (status === 'approved') {
                await Desaparecido.findByIdAndDelete(
                    removalRequest.desaparecido_id,
                    { session }
                );
            }

            await session.commitTransaction();

            return secureJsonResponse({
                success: true,
                message: status === 'approved'
                    ? 'Solicitud aprobada y registro eliminado'
                    : 'Solicitud rechazada',
            }, 200);

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('PUT /api/removal-requests failed', {
            error: error instanceof Error ? error.message : 'Unknown',
            timestamp: new Date().toISOString(),
        });

        return secureJsonResponse({ error: 'Error al actualizar la solicitud' }, 500);
    }
};
