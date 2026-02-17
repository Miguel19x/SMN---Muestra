import redis from '../../chunks/redis_DF8_68s9.mjs';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
export { renderers } from '../../renderers.mjs';

const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

async function POST({ request }) {
  try {
    const body = await request.json();
    const { file } = body;

    // Validar la presencia de file y file.data
    if (!file || !file.data) {
      throw new CustomError('No file or file data provided', 400);
    }

    const imageKey = `temp_${Date.now()}_${file.name}`;

    // Verificar si file.data es un Buffer o una cadena y codificar en consecuencia
    let imageData = file.data;
    if (Buffer.isBuffer(imageData)) {
      imageData = imageData.toString('base64'); // Convertir a base64 si es un Buffer
    }

    // Almacenar los datos de la imagen y los metadatos en Redis
    await redis.set(`${imageKey}:data`, imageData, { ex: 3600 }); // Almacenar datos de la imagen
    await redis.set(`${imageKey}:metadata`, JSON.stringify({ type: file.type, size: file.size }), { ex: 3600 }); // Almacenar metadatos

    // Devolver respuesta de éxito
    return new Response(JSON.stringify({ 
      key: imageKey,
      type: file.type,
      name: file.name,
      size: file.size,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error caching image:', error);
    if (error instanceof CustomError) {
      return new Response(JSON.stringify({ error: error.message, details: error.details }), {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw new CustomError('Failed to cache image', 500, error.message);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  config
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
