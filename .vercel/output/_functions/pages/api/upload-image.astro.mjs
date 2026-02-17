import { PutObjectCommand } from '@aws-sdk/client-s3';
import { z } from 'zod';
import { r as redis } from '../../chunks/redis_CYcAgJqj.mjs';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
import { e as ensureR2Available, b as bucketName, r as r2Client } from '../../chunks/r2-client_C7UAhBzL.mjs';
import { s as secureJsonResponse } from '../../chunks/securityHeaders_B-pWwsKs.mjs';
import { r as rateLimit } from '../../chunks/rateLimiter_Blj738rK.mjs';
import { V as VALIDATION_CONFIG, R as R2_CONFIG } from '../../chunks/app.config_BO63yO4S.mjs';
export { renderers } from '../../renderers.mjs';

const UploadImageSchema = z.object({
  key: z.string().min(1, "Key is required").max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).regex(/^[a-zA-Z0-9\-_\.]+$/, "Invalid key format")
});
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
    ensureR2Available();
    let rawData;
    try {
      rawData = await request.json();
    } catch {
      return secureJsonResponse({ error: "JSON inválido" }, 400);
    }
    const validationResult = UploadImageSchema.safeParse(rawData);
    if (!validationResult.success) {
      return secureJsonResponse(
        {
          error: "Datos inválidos",
          details: validationResult.error.format()
        },
        400
      );
    }
    const { key } = validationResult.data;
    const [imageData, metadataString] = await Promise.all([
      redis.get(`${key}:data`),
      redis.get(`${key}:metadata`)
    ]);
    if (!imageData || !metadataString) {
      return secureJsonResponse(
        { error: "Imagen no encontrada en cache" },
        404
      );
    }
    let metadata;
    try {
      if (typeof metadataString === "string") {
        metadata = JSON.parse(metadataString);
      } else {
        metadata = metadataString;
      }
      if (!metadata.type || typeof metadata.type !== "string") {
        throw new Error("Invalid metadata: type is required");
      }
    } catch (error) {
      console.error("Metadata parsing failed", {
        error: error instanceof Error ? error.message : "Unknown",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      return secureJsonResponse(
        { error: "Formato de metadata inválido" },
        500
      );
    }
    const base64Data = imageData.includes("base64,") ? imageData.split("base64,")[1] : imageData;
    if (!base64Data) {
      return secureJsonResponse({ error: "Datos de imagen inválidos" }, 400);
    }
    let buffer;
    try {
      buffer = Buffer.from(base64Data, "base64");
    } catch {
      return secureJsonResponse(
        { error: "Error al decodificar imagen" },
        400
      );
    }
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    if (buffer.length > MAX_IMAGE_SIZE) {
      return secureJsonResponse(
        { error: "Imagen demasiado grande (máx 10MB)" },
        413
      );
    }
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: metadata.type,
      ContentLength: buffer.length,
      // ✅ Metadata adicional
      Metadata: {
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
    await r2Client.send(command);
    const imageUrl = `${R2_CONFIG.PUBLIC_URL}/${key}`;
    try {
      await Promise.all([
        redis.del(`${key}:data`),
        redis.del(`${key}:metadata`)
      ]);
    } catch (cacheError) {
      console.warn("Cache cleanup failed", {
        key,
        error: cacheError instanceof Error ? cacheError.message : "Unknown"
      });
    }
    return secureJsonResponse(
      {
        success: true,
        url: imageUrl
      },
      200
    );
  } catch (error) {
    console.error("POST /api/upload-image failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error instanceof CustomError) {
      return secureJsonResponse({ error: error.message }, error.statusCode);
    }
    return secureJsonResponse(
      { error: "Error al subir la imagen" },
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
