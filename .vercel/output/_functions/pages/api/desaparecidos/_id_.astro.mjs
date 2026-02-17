import { c as connectDB } from '../../../chunks/mongodb_Bx9AnUPZ.mjs';
import { C as CustomError } from '../../../chunks/CustomError_HYyoUHTY.mjs';
import { D as Desaparecido } from '../../../chunks/desaparecido_C53UEs1Y.mjs';
import { v as verifyAuth, c as createUnauthorizedResponse } from '../../../chunks/auth-middleware_CSAV_C_Q.mjs';
import { Types } from 'mongoose';
export { renderers } from '../../../renderers.mjs';

const { ObjectId } = Types;

async function GET({ params }) {
  await connectDB();
  const { id } = params;

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
    const desaparecido = await Desaparecido.findById(id).lean();

    if (!desaparecido) {
      throw new CustomError('Registro no encontrado', 404);
    }

    return new Response(JSON.stringify(desaparecido), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error('Error al obtener el registro:', error);
    if (error instanceof CustomError) {
      return new Response(JSON.stringify({ error: 'Error al obtener el registro' }), {
        status: error.statusCode,
        headers: { "Content-Type": "application/json" }
      });
    }
    throw new CustomError('Error al obtener el registro', 500);
  }
}

async function PUT({ params, request }) {
  // Verificar autenticación
  const authResult = await verifyAuth(request);
  if (!authResult.success) {
    return createUnauthorizedResponse(authResult.error);
  }

  await connectDB();
  const { id } = params;

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
    const body = await request.json();

    const updatedDesaparecido = await Desaparecido.findByIdAndUpdate(id, body, { new: true });

    if (!updatedDesaparecido) {
      throw new CustomError('Registro no encontrado', 404);
    }

    return new Response(JSON.stringify(updatedDesaparecido), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error('Error al actualizar el registro:', error);
    if (error instanceof CustomError) {
      return new Response(JSON.stringify({ error: 'Error al actualizar el registro' }), {
        status: error.statusCode,
        headers: { "Content-Type": "application/json" }
      });
    }
    throw new CustomError('Error al actualizar el registro', 500);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
