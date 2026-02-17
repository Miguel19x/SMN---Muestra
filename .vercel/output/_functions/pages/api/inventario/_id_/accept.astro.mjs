import { c as connectDB } from '../../../../chunks/mongodb_Kr9SiWRo.mjs';
import { C as CustomError } from '../../../../chunks/CustomError_HYyoUHTY.mjs';
import { O as Objeto } from '../../../../chunks/objeto_BtcWFCv2.mjs';
import { v as verifyAuth, c as createUnauthorizedResponse } from '../../../../chunks/auth-middleware_CSAV_C_Q.mjs';
import { s as secureJsonResponse } from '../../../../chunks/securityHeaders_B-pWwsKs.mjs';
import { O as ObjectIdSchema } from '../../../../chunks/schemas_DTfw02fa.mjs';
import 'mongoose';
import { r as redis } from '../../../../chunks/redis_CYcAgJqj.mjs';
export { renderers } from '../../../../renderers.mjs';

const POST = async ({ params, request }) => {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return createUnauthorizedResponse(authResult.error);
    }
    await connectDB();
    const { id } = params;
    if (!id) {
      return secureJsonResponse({ error: "ID es requerido" }, 400);
    }
    const { publicIdMapper } = await import('../../../../chunks/idObfuscation_Dfj8wj8l.mjs');
    const mongoId = publicIdMapper.getMongoId(id);
    if (!mongoId) {
      return secureJsonResponse({ error: "ID inválido" }, 400);
    }
    const validationResult = ObjectIdSchema.safeParse(mongoId);
    if (!validationResult.success) {
      return secureJsonResponse({ error: "ID inválido" }, 400);
    }
    const objeto = await Objeto.findById(mongoId);
    if (!objeto) {
      return secureJsonResponse({ error: "Registro no encontrado" }, 404);
    }
    objeto.estado_registro = "aprobado";
    objeto.etiqueta = void 0;
    await objeto.save();
    await Promise.all([
      redis.del("objetos:pendiente"),
      redis.del("objetos:aprobado")
    ]);
    console.log("Objeto approved", {
      id: id.substring(0, 8) + "...",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return secureJsonResponse(
      {
        success: true,
        message: "Registro aprobado con éxito",
        data: {
          id,
          estado_registro: "aprobado"
        }
      },
      200
    );
  } catch (error) {
    console.error("POST /api/inventario/[id]/accept failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error instanceof CustomError) {
      return secureJsonResponse({ error: error.message }, error.statusCode);
    }
    return secureJsonResponse(
      { error: "Error al procesar el registro" },
      500
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
