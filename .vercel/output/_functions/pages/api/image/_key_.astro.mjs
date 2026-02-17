import redis from '../../../chunks/redis_DF8_68s9.mjs';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { C as CustomError } from '../../../chunks/CustomError_HYyoUHTY.mjs';
export { renderers } from '../../../renderers.mjs';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function GET({ params }) {
  const { key } = params;

  // Intenta obtener la imagen de la caché
  const cachedImage = await redis.get(key);
  if (cachedImage) {
    return new Response(cachedImage, {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  }

  // Si no está en caché, obtiene la imagen de R2
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const { Body, ContentType } = await s3Client.send(command);
    const arrayBuffer = await Body.transformToByteArray();

    // Guarda la imagen en caché
    await redis.set(key, arrayBuffer, { ex: 3600 }); // Expira en 1 hora

    return new Response(arrayBuffer, {
      headers: { 'Content-Type': ContentType },
    });
  } catch (error) {
    console.error("Error fetching image from R2:", error);
    throw new CustomError("Image not found", 404);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
