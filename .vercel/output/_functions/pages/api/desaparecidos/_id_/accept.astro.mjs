import { c as connectDB } from '../../../../chunks/mongodb_Bx9AnUPZ.mjs';
import { C as CustomError } from '../../../../chunks/CustomError_HYyoUHTY.mjs';
import { D as Desaparecido } from '../../../../chunks/desaparecido_C53UEs1Y.mjs';
import { v as verifyAuth, c as createUnauthorizedResponse } from '../../../../chunks/auth-middleware_CSAV_C_Q.mjs';
import { Types } from 'mongoose';
export { renderers } from '../../../../renderers.mjs';

const { ObjectId } = Types;

async function POST({ params, request }) {
  // Verificar autenticación
  const authResult = await verifyAuth(request);
  if (!authResult.success) {
    return createUnauthorizedResponse(authResult.error);
  }

  const { id } = params;
  await connectDB();

  if (!id) {
    throw new CustomError('ID es requerido', 400);
  }

  // Validar que el ID sea un ObjectId válido
  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const desaparecido = await Desaparecido.findById(id);
    if (!desaparecido) {
      throw new CustomError('Registro no encontrado', 404);
    }

    desaparecido.estado_registro = 'aprobado';
    desaparecido.etiqueta = undefined; // Eliminar la etiqueta
    await desaparecido.save();

    return new Response(JSON.stringify({
      message: 'Registro aprobado con éxito',
      desaparecido: desaparecido
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al procesar el registro:', error);
    if (error instanceof CustomError) {
      return new Response(JSON.stringify({ error: 'Error al procesar el registro' }), {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw new CustomError('Error al procesar el registro', 500, error.message);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
