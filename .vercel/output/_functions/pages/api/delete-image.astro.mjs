import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { e as extractFilenameFromUrl, b as bucketName, r as r2Client } from '../../chunks/r2-client_BkgDWLEA.mjs';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
  const { imageUrl } = await request.json();

  if (!imageUrl) {
    throw new CustomError('La URL de la imagen es requerida', 400);
  }

  const filename = extractFilenameFromUrl(imageUrl);

  if (!filename) {
    throw new CustomError('URL de imagen inválida', 400);
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: filename,
  });

  try {
    await r2Client.send(command);
    return new Response(JSON.stringify({ message: 'Imagen eliminada exitosamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al eliminar imagen de R2:', error);
    throw new CustomError('Error al eliminar la imagen', 500, error.message);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
