import { Types } from 'mongoose';
import { c as connectDB } from '../../../chunks/mongodb_Kr9SiWRo.mjs';
import { C as CustomError } from '../../../chunks/CustomError_HYyoUHTY.mjs';
import { O as Objeto } from '../../../chunks/objeto_BtcWFCv2.mjs';
import { v as verifyAuth, c as createUnauthorizedResponse } from '../../../chunks/auth-middleware_CSAV_C_Q.mjs';
import { s as secureJsonResponse } from '../../../chunks/securityHeaders_B-pWwsKs.mjs';
import { O as ObjectIdSchema } from '../../../chunks/schemas_DTfw02fa.mjs';
import { O as ObjetoService } from '../../../chunks/objeto.service_D4NcirIP.mjs';
import { createPublicId } from '../../../chunks/idObfuscation_Dfj8wj8l.mjs';
export { renderers } from '../../../renderers.mjs';

const { ObjectId } = Types;
const objetoService = new ObjetoService();
const GET = async ({ params }) => {
  try {
    await connectDB();
    const { id } = params;
    if (!id) {
      return secureJsonResponse({ error: "ID es requerido" }, 400);
    }
    const { publicIdMapper } = await import('../../../chunks/idObfuscation_Dfj8wj8l.mjs');
    const mongoId = publicIdMapper.getMongoId(id);
    let objeto;
    if (mongoId) {
      objeto = await Objeto.findById(mongoId).lean();
    } else {
      objeto = await objetoService.findByPublicId(id);
    }
    if (!objeto) {
      return secureJsonResponse({ error: "Registro no encontrado" }, 404);
    }
    if (!mongoId && objeto) {
      publicIdMapper.register(objeto._id.toString(), id);
    }
    const response = {
      id: createPublicId(objeto._id.toString()),
      _id: objeto._id.toString(),
      origen: objeto.origen || "N",
      nombre: objeto.nombre,
      codigo: objeto.codigo || "Desconocido",
      antiguedad: objeto.antiguedad,
      categoria: objeto.categoria,
      pais_origen: objeto.pais_origen,
      fecha_registro: objeto.fecha_registro,
      hora: objeto.hora,
      imagen: objeto.imagen,
      estado: objeto.estado,
      tipo_objeto: objeto.tipo_objeto,
      clasificacion: objeto.clasificacion,
      ultimo_lugar_conocido: objeto.ultimo_lugar_conocido,
      ubicacion_actual: objeto.ubicacion_actual,
      condicion: objeto.condicion,
      estado_conservacion: objeto.estado_conservacion,
      estado_registro: objeto.estado_registro,
      etiqueta: objeto.etiqueta,
      antiguedadStage: objetoService.getAntiguedadStage(objeto.antiguedad),
      condicionEstado: objetoService.getCondicionEstado(objeto.antiguedad)
    };
    return secureJsonResponse(response, 200);
  } catch (error) {
    console.error("GET /api/inventario/[id] failed", {
      error: error instanceof Error ? error.message : "Unknown",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error instanceof CustomError) {
      return secureJsonResponse({ error: error.message }, error.statusCode);
    }
    return secureJsonResponse({ error: "Error al obtener el registro" }, 500);
  }
};
const PUT = async ({ params, request }) => {
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
    const validationResult = ObjectIdSchema.safeParse(id);
    if (!validationResult.success) {
      return secureJsonResponse({ error: "ID inválido" }, 400);
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return secureJsonResponse({ error: "JSON inválido" }, 400);
    }
    const { _id, __v, createdAt, ...updateData } = body;
    const updatedObjeto = await Objeto.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedObjeto) {
      return secureJsonResponse({ error: "Registro no encontrado" }, 404);
    }
    if (updateData.estado_registro) {
    }
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
      etiqueta: updatedObjeto.etiqueta
    };
    return secureJsonResponse(
      {
        success: true,
        data: response
      },
      200
    );
  } catch (error) {
    console.error("PUT /api/inventario/[id] failed", {
      error: error instanceof Error ? error.message : "Unknown",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error instanceof CustomError) {
      return secureJsonResponse({ error: error.message }, error.statusCode);
    }
    return secureJsonResponse({ error: "Error al actualizar el registro" }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
