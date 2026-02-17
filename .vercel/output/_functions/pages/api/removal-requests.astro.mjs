import { z } from 'zod';
import mongoose, { Types } from 'mongoose';
import { c as connectDB } from '../../chunks/mongodb_Kr9SiWRo.mjs';
import '../../chunks/objeto_BtcWFCv2.mjs';
import { v as verifyAuth, c as createUnauthorizedResponse } from '../../chunks/auth-middleware_CSAV_C_Q.mjs';
import { s as secureJsonResponse } from '../../chunks/securityHeaders_B-pWwsKs.mjs';
import { r as rateLimit } from '../../chunks/rateLimiter_Blj738rK.mjs';
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
const CONFIG = {
  MAX_REASON_LENGTH: 1e3,
  MAX_EVIDENCE_URL_LENGTH: 500,
  VALID_STATUSES: ["pending", "approved", "rejected"],
  DEADLINE_DAYS: 7
};
const CreateRemovalRequestSchema = z.object({
  desaparecido_id: z.string().refine(
    (val) => {
      return ObjectId.isValid(val) && typeof val === "string";
    },
    { message: "ID de desaparecido inválido" }
  ),
  twitter_user_id: z.string().max(50).optional(),
  twitter_username: z.string().max(50).optional(),
  twitter_name: z.string().max(100).optional(),
  reason: z.string().min(10).max(CONFIG.MAX_REASON_LENGTH),
  evidence_url: z.string().url().max(CONFIG.MAX_EVIDENCE_URL_LENGTH).optional(),
  requester_email: z.string().email().optional()
});
const UpdateRemovalRequestSchema = z.object({
  requestId: z.string().refine(
    (val) => ObjectId.isValid(val) && typeof val === "string",
    { message: "ID de request inválido" }
  ),
  status: z.enum(CONFIG.VALID_STATUSES),
  admin_notes: z.string().max(CONFIG.MAX_REASON_LENGTH).optional()
});
const GET = async ({ request }) => {
  try {
    await connectDB();
    const url = new URL(request.url);
    const desaparecidoId = url.searchParams.get("desaparecido_id");
    const status = url.searchParams.get("status");
    const adminView = url.searchParams.get("admin") === "true";
    if (adminView) {
      const authResult = await verifyAuth(request);
      if (!authResult.success) {
        return createUnauthorizedResponse(authResult.error);
      }
      const query = {};
      if (status && CONFIG.VALID_STATUSES.includes(status)) {
        query.status = status;
      }
      const requests = await RemovalRequest.find(query).populate("desaparecido_id", "nombre cedula imagen").sort({ createdAt: -1 }).lean().exec();
      return secureJsonResponse({ requests }, 200);
    }
    if (desaparecidoId) {
      if (typeof desaparecidoId !== "string" || !ObjectId.isValid(desaparecidoId)) {
        return secureJsonResponse({ error: "ID inválido" }, 400);
      }
      const existingRequest = await RemovalRequest.findOne({
        desaparecido_id: new ObjectId(desaparecidoId),
        // ✅ Explicitly cast to ObjectId
        status: "pending"
      }).lean();
      return secureJsonResponse({
        hasPendingRequest: !!existingRequest
      }, 200);
    }
    return secureJsonResponse({ error: "Parámetros requeridos" }, 400);
  } catch (error) {
    console.error("GET /api/removal-requests failed", {
      error: error instanceof Error ? error.message : "Unknown",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return secureJsonResponse({ error: "Error interno del servidor" }, 500);
  }
};
const POST = async ({ request }) => {
  try {
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return secureJsonResponse(
        { error: rateLimitResult.message },
        429,
        rateLimitResult.headers
      );
    }
    let rawData;
    try {
      rawData = await request.json();
    } catch {
      return secureJsonResponse({ error: "JSON inválido" }, 400);
    }
    const validationResult = CreateRemovalRequestSchema.safeParse(rawData);
    if (!validationResult.success) {
      return secureJsonResponse(
        {
          error: "Datos inválidos",
          details: validationResult.error.format()
        },
        400
      );
    }
    const data = validationResult.data;
    await connectDB();
    const desaparecidoObjectId = new ObjectId(data.desaparecido_id);
    const desaparecido = await Desaparecido.findById(desaparecidoObjectId).select("nombre cedula").lean();
    if (!desaparecido) {
      return secureJsonResponse({ error: "Registro no encontrado" }, 404);
    }
    const existingRequest = await RemovalRequest.findOne({
      desaparecido_id: desaparecidoObjectId,
      status: "pending"
    });
    if (existingRequest) {
      return secureJsonResponse({
        error: "Ya existe una solicitud pendiente para este registro"
      }, 409);
    }
    const newRequest = new RemovalRequest({
      desaparecido_id: desaparecidoObjectId,
      twitter_user_id: data.twitter_user_id || "anonymous",
      twitter_username: data.twitter_username || "anonymous",
      twitter_name: data.twitter_name || "Anónimo",
      reason: data.reason,
      evidence_url: data.evidence_url,
      requester_email: data.requester_email,
      deadline: new Date(Date.now() + CONFIG.DEADLINE_DAYS * 24 * 60 * 60 * 1e3)
    });
    await newRequest.save();
    return secureJsonResponse(
      {
        success: true,
        message: `Solicitud enviada. Será procesada en ${CONFIG.DEADLINE_DAYS} días.`,
        requestId: newRequest._id.toString(),
        deadline: newRequest.deadline
      },
      201
    );
  } catch (error) {
    console.error("POST /api/removal-requests failed", {
      error: error instanceof Error ? error.message : "Unknown",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return secureJsonResponse({ error: "Error al procesar la solicitud" }, 500);
  }
};
const PUT = async ({ request }) => {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return createUnauthorizedResponse(authResult.error);
    }
    let rawData;
    try {
      rawData = await request.json();
    } catch {
      return secureJsonResponse({ error: "JSON inválido" }, 400);
    }
    const validationResult = UpdateRemovalRequestSchema.safeParse(rawData);
    if (!validationResult.success) {
      return secureJsonResponse(
        {
          error: "Datos inválidos",
          details: validationResult.error.format()
        },
        400
      );
    }
    const { requestId, status, admin_notes } = validationResult.data;
    await connectDB();
    const removalRequest = await RemovalRequest.findById(requestId);
    if (!removalRequest) {
      return secureJsonResponse({ error: "Solicitud no encontrada" }, 404);
    }
    const session = await RemovalRequest.startSession();
    session.startTransaction();
    try {
      removalRequest.status = status;
      removalRequest.admin_notes = admin_notes;
      removalRequest.processed_by = authResult.userId;
      removalRequest.processed_at = /* @__PURE__ */ new Date();
      await removalRequest.save({ session });
      if (status === "approved") {
        await Desaparecido.findByIdAndDelete(
          removalRequest.desaparecido_id,
          { session }
        );
      }
      await session.commitTransaction();
      return secureJsonResponse({
        success: true,
        message: status === "approved" ? "Solicitud aprobada y registro eliminado" : "Solicitud rechazada"
      }, 200);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("PUT /api/removal-requests failed", {
      error: error instanceof Error ? error.message : "Unknown",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return secureJsonResponse({ error: "Error al actualizar la solicitud" }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST,
    PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
