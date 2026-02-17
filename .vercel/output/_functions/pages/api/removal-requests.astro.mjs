import { c as connectDB } from '../../chunks/mongodb_Bx9AnUPZ.mjs';
import mongoose, { Types } from 'mongoose';
import { D as Desaparecido } from '../../chunks/desaparecido_C53UEs1Y.mjs';
import { v as verifyAuth, c as createUnauthorizedResponse } from '../../chunks/auth-middleware_CSAV_C_Q.mjs';
export { renderers } from '../../renderers.mjs';

const removalRequestSchema = new mongoose.Schema({
    // Referencia al registro de desaparecido
    desaparecido_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Desaparecido',
        required: true
    },

    // Información del solicitante (opcional - para solicitudes anónimas)
    twitter_user_id: { type: String, default: 'anonymous' },
    twitter_username: { type: String, default: 'anonymous' },
    twitter_name: { type: String, default: 'Anónimo' },
    requester_email: { type: String }, // Email opcional para contacto

    // Razón y evidencia
    reason: { type: String, required: true, maxlength: 1000 },
    evidence_url: { type: String },

    // Estado de la solicitud
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    // Fecha límite para procesamiento (7 días desde creación)
    deadline: { type: Date },

    // Notas del admin
    admin_notes: { type: String },
    processed_by: { type: String },
    processed_at: { type: Date },
}, {
    timestamps: true
});

// Índices para búsquedas eficientes
removalRequestSchema.index({ status: 1 });
removalRequestSchema.index({ desaparecido_id: 1 });
removalRequestSchema.index({ deadline: 1 });
removalRequestSchema.index({ createdAt: -1 });

// Middleware para establecer deadline automáticamente
removalRequestSchema.pre('save', async function () {
    if (this.isNew && !this.deadline) {
        // Establecer deadline a 7 días desde la creación
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);
        this.deadline = deadline;
    }
});

const RemovalRequest = mongoose.models.RemovalRequest || mongoose.model('RemovalRequest', removalRequestSchema);

const { ObjectId } = Types;

// GET - Obtener solicitudes de retiro (admin) o verificar estado (público)
async function GET({ request }) {
    await connectDB();
    const url = new URL(request.url);
    const desaparecidoId = url.searchParams.get('desaparecido_id');
    const status = url.searchParams.get('status');
    const adminView = url.searchParams.get('admin') === 'true';

    // Si es vista de admin, verificar autenticación
    if (adminView) {
        const authResult = await verifyAuth(request);
        if (!authResult.success) {
            return createUnauthorizedResponse(authResult.error);
        }

        // Obtener todas las solicitudes pendientes para el admin
        const query = status ? { status } : {};
        const requests = await RemovalRequest.find(query)
            .populate('desaparecido_id', 'nombre cedula imagen')
            .sort({ createdAt: -1 })
            .lean();

        return new Response(JSON.stringify(requests), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Vista pública - solo verificar si hay solicitud pendiente para un desaparecido
    if (desaparecidoId) {
        const existingRequest = await RemovalRequest.findOne({
            desaparecido_id: desaparecidoId,
            status: 'pending'
        }).lean();

        return new Response(JSON.stringify({
            hasPendingRequest: !!existingRequest
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({ error: 'Parámetros inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
    });
}

// POST - Crear nueva solicitud de retiro (permite solicitudes anónimas)
async function POST({ request }) {
    await connectDB();

    try {
        const body = await request.json();
        const { desaparecido_id, twitter_user_id, twitter_username, twitter_name, reason, evidence_url, requester_email } = body;

        // Validaciones - solo desaparecido_id y reason son requeridos
        if (!desaparecido_id || !reason) {
            return new Response(JSON.stringify({
                error: 'Faltan campos requeridos (ID y razón)'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validar que el desaparecido existe
        if (!ObjectId.isValid(desaparecido_id)) {
            return new Response(JSON.stringify({ error: 'ID de desaparecido inválido' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const desaparecido = await Desaparecido.findById(desaparecido_id);
        if (!desaparecido) {
            return new Response(JSON.stringify({ error: 'Registro no encontrado' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verificar que no haya solicitud pendiente para este registro (evitar spam)
        const existingRequest = await RemovalRequest.findOne({
            desaparecido_id,
            status: 'pending'
        });

        if (existingRequest) {
            return new Response(JSON.stringify({
                error: 'Ya existe una solicitud pendiente para este registro'
            }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Crear la solicitud (campos de Twitter opcionales)
        const newRequest = new RemovalRequest({
            desaparecido_id,
            twitter_user_id: twitter_user_id || 'anonymous',
            twitter_username: twitter_username || 'anonymous',
            twitter_name: twitter_name || 'Anónimo',
            reason,
            evidence_url,
            requester_email,
        });

        await newRequest.save();

        return new Response(JSON.stringify({
            success: true,
            message: 'Solicitud enviada. Será procesada en un plazo de 7 días.',
            requestId: newRequest._id,
            deadline: newRequest.deadline
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creando solicitud de retiro:', error);
        return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// PUT - Actualizar estado de solicitud (solo admin)
async function PUT({ request }) {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
        return createUnauthorizedResponse(authResult.error);
    }

    await connectDB();

    try {
        const body = await request.json();
        const { requestId, status, admin_notes } = body;

        if (!requestId || !status) {
            return new Response(JSON.stringify({ error: 'ID y estado son requeridos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return new Response(JSON.stringify({ error: 'Estado inválido' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const removalRequest = await RemovalRequest.findById(requestId);
        if (!removalRequest) {
            return new Response(JSON.stringify({ error: 'Solicitud no encontrada' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Actualizar la solicitud
        removalRequest.status = status;
        removalRequest.admin_notes = admin_notes;
        removalRequest.processed_by = authResult.userId;
        removalRequest.processed_at = new Date();
        await removalRequest.save();

        // Si se aprobó, eliminar el registro del desaparecido
        if (status === 'approved') {
            await Desaparecido.findByIdAndDelete(removalRequest.desaparecido_id);
        }

        return new Response(JSON.stringify({
            success: true,
            message: status === 'approved'
                ? 'Solicitud aprobada. El registro ha sido eliminado.'
                : 'Solicitud rechazada.'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error actualizando solicitud:', error);
        return new Response(JSON.stringify({ error: 'Error al actualizar la solicitud' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST,
    PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
