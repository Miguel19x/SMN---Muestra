import { c as connectDB } from '../../../../chunks/mongodb_Bx9AnUPZ.mjs';
import { C as CustomError } from '../../../../chunks/CustomError_HYyoUHTY.mjs';
import { D as Desaparecido } from '../../../../chunks/desaparecido_C53UEs1Y.mjs';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { e as extractFilenameFromUrl, b as bucketName, r as r2Client } from '../../../../chunks/r2-client_BkgDWLEA.mjs';
import { v as verifyAuth, c as createUnauthorizedResponse } from '../../../../chunks/auth-middleware_CSAV_C_Q.mjs';
import { Types } from 'mongoose';
export { renderers } from '../../../../renderers.mjs';

const { ObjectId } = Types;

async function deleteImageFromR2(imageUrl) {
  const filename = extractFilenameFromUrl(imageUrl);
  if (!filename) return;

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: filename,
  });

  try {
    await r2Client.send(command);
    console.log(`Image ${filename} deleted from R2`);
  } catch (error) {
    console.error(`Error deleting image ${filename} from R2:`, error);
  }
}

async function POST({ params, request }) {
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
    const deletedDesaparecido = await Desaparecido.findByIdAndDelete(id);
    if (!deletedDesaparecido) {
      throw new CustomError('Registro no encontrado', 404);
    }

    // Delete the image from R2 if it exists
    if (deletedDesaparecido.imagen) {
      await deleteImageFromR2(deletedDesaparecido.imagen);
    }

    return new Response(JSON.stringify({ message: 'Registro rechazado y eliminado exitosamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al rechazar el registro:', error);
    if (error instanceof CustomError) {
      return new Response(JSON.stringify({ error: 'Error al procesar el rechazo' }), {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw new CustomError('Error al rechazar el registro', 500, error.message);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
