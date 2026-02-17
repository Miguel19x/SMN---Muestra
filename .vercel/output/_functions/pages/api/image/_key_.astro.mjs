import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r as redis } from '../../../chunks/redis_CYcAgJqj.mjs';
import { e as ensureR2Available, b as bucketName, r as r2Client } from '../../../chunks/r2-client_C7UAhBzL.mjs';
import { C as CustomError } from '../../../chunks/CustomError_HYyoUHTY.mjs';
import { r as rateLimitApiGet } from '../../../chunks/bruteForceProtection_Bg_DvZdH.mjs';
import { V as VALIDATION_CONFIG } from '../../../chunks/app.config_BO63yO4S.mjs';
import { l as logger } from '../../../chunks/logger_CX-LuAmG.mjs';
export { renderers } from '../../../renderers.mjs';

const CACHE_NAMESPACE = "api:images";
const getCacheKey = (key) => `${CACHE_NAMESPACE}:${key}`;
const IMAGE_CACHE_TTL = 3600;
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
function isValidImageKey(key) {
  if (!key || typeof key !== "string") {
    return false;
  }
  let isValid = true;
  const hasPathTraversal = key.includes("..") || key.includes("/") || key.includes("\\");
  isValid = isValid && !hasPathTraversal;
  const isValidLength = key.length > 0 && key.length <= VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM;
  isValid = isValid && isValidLength;
  const validKeyPattern = /^[a-zA-Z0-9._-]+$/;
  const hasValidChars = validKeyPattern.test(key);
  isValid = isValid && hasValidChars;
  const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some(
    (ext) => key.toLowerCase().endsWith(ext)
  );
  isValid = isValid && hasValidExtension;
  return isValid;
}
const GET = async ({ params, request }) => {
  const startTime = Date.now();
  try {
    const rateLimitResult = await rateLimitApiGet(request);
    if (!rateLimitResult.success) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: rateLimitResult.headers
      });
    }
    const { key } = params;
    if (!key || !isValidImageKey(key)) {
      logger.warn("Invalid image key requested", {
        keyLength: key?.length || 0
        // Don't log actual key (security)
      });
      return new Response("Invalid image key", { status: 400 });
    }
    const cacheKey = getCacheKey(key);
    try {
      const cachedImage = await redis.get(cacheKey);
      if (cachedImage) {
        const buffer2 = Buffer.from(cachedImage, "base64");
        const contentType2 = getContentType(key);
        logger.debug("Image cache HIT", {
          key: key.substring(0, 20),
          size: buffer2.length,
          latency: Date.now() - startTime
        });
        return new Response(buffer2, {
          status: 200,
          headers: {
            "Content-Type": contentType2,
            "Cache-Control": "public, max-age=3600",
            "X-Cache": "HIT"
          }
        });
      }
    } catch (cacheError) {
      logger.warn("Cache read failed", {
        error: cacheError instanceof Error ? cacheError.message : "Unknown",
        key: key.substring(0, 20)
      });
    }
    ensureR2Available();
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });
    let body;
    let contentType;
    try {
      const response = await r2Client.send(command);
      body = response.Body;
      contentType = response.ContentType || getContentType(key);
    } catch (r2Error) {
      logger.error("R2 fetch failed", {
        error: r2Error instanceof Error ? r2Error.message : "Unknown",
        key: key.substring(0, 20)
      });
      if (r2Error instanceof Error && r2Error.name === "NoSuchKey") {
        return new Response("Image not found", { status: 404 });
      }
      return new Response("Error fetching image", { status: 500 });
    }
    const arrayBuffer = await body.transformToByteArray();
    const buffer = Buffer.from(arrayBuffer);
    const MAX_CACHEABLE_SIZE = 5 * 1024 * 1024;
    if (buffer.length <= MAX_CACHEABLE_SIZE) {
      try {
        const base64 = buffer.toString("base64");
        await redis.set(cacheKey, base64, { ex: IMAGE_CACHE_TTL });
        logger.debug("Image cached", {
          key: key.substring(0, 20),
          size: buffer.length
        });
      } catch (cacheError) {
        logger.warn("Cache write failed", {
          error: cacheError instanceof Error ? cacheError.message : "Unknown",
          key: key.substring(0, 20)
        });
      }
    } else {
      logger.info("Image too large to cache", {
        key: key.substring(0, 20),
        size: buffer.length
      });
    }
    logger.info("Image served from R2", {
      key: key.substring(0, 20),
      size: buffer.length,
      latency: Date.now() - startTime
    });
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "X-Cache": "MISS"
      }
    });
  } catch (error) {
    logger.error("GET /api/image/[key] failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      latency: Date.now() - startTime
    });
    if (error instanceof CustomError) {
      return new Response(error.message, { status: error.statusCode });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
};
function getContentType(key) {
  const ext = key.toLowerCase().split(".").pop();
  const mimeTypes = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
    "gif": "image/gif"
  };
  return mimeTypes[ext || ""] || "image/jpeg";
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
