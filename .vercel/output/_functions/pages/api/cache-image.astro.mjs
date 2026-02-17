import { z } from 'zod';
import { r as redis } from '../../chunks/redis_CYcAgJqj.mjs';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
import { s as secureJsonResponse } from '../../chunks/securityHeaders_B-pWwsKs.mjs';
import { r as rateLimit } from '../../chunks/rateLimiter_Blj738rK.mjs';
import { V as VALIDATION_CONFIG } from '../../chunks/app.config_BO63yO4S.mjs';
export { renderers } from '../../renderers.mjs';

const CACHE_TTL = 3600;
const MAX_FILE_SIZE = 6 * 1024 * 1024;
const CacheImageSchema = z.object({
  file: z.object({
    data: z.string().min(1, "File data is required"),
    type: z.string().regex(/^image\/(jpeg|jpg|png|webp|gif)$/i, "Invalid image type").max(50),
    name: z.string().min(1).max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM),
    size: z.number().int().min(1, "File size must be positive").max(MAX_FILE_SIZE, `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  })
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
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      return secureJsonResponse(
        { error: `Archivo demasiado grande (máx ${MAX_FILE_SIZE / 1024 / 1024}MB)` },
        413
      );
    }
    let rawData;
    try {
      rawData = await request.json();
    } catch {
      return secureJsonResponse({ error: "JSON inválido" }, 400);
    }
    const validationResult = CacheImageSchema.safeParse(rawData);
    if (!validationResult.success) {
      return secureJsonResponse(
        {
          error: "Datos inválidos",
          details: validationResult.error.format()
        },
        400
      );
    }
    const { file } = validationResult.data;
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const imageKey = `temp_${timestamp}_${randomSuffix}_${sanitizedName}`;
    let imageData = file.data;
    if (typeof imageData === "object" && imageData !== null && "type" in imageData && imageData.type === "Buffer" && "data" in imageData) {
      imageData = Buffer.from(imageData.data).toString("base64");
    }
    try {
      await Promise.all([
        redis.set(`${imageKey}:data`, imageData, { ex: CACHE_TTL }),
        redis.set(
          `${imageKey}:metadata`,
          JSON.stringify({
            type: file.type,
            size: file.size,
            name: file.name,
            cachedAt: (/* @__PURE__ */ new Date()).toISOString()
          }),
          { ex: CACHE_TTL }
        )
      ]);
    } catch (redisError) {
      console.error("Redis storage failed", {
        error: redisError instanceof Error ? redisError.message : "Unknown",
        key: imageKey
      });
      return secureJsonResponse(
        { error: "Error al almacenar imagen temporalmente" },
        500
      );
    }
    return secureJsonResponse(
      {
        success: true,
        key: imageKey,
        type: file.type,
        name: file.name,
        size: file.size,
        expiresAt: new Date(Date.now() + CACHE_TTL * 1e3).toISOString()
      },
      200
    );
  } catch (error) {
    console.error("POST /api/cache-image failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error instanceof CustomError) {
      return secureJsonResponse({ error: error.message }, error.statusCode);
    }
    return secureJsonResponse(
      { error: "Error al procesar la imagen" },
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
