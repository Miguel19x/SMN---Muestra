import { z } from 'zod';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { e as ensureR2Available, a as extractFilenameFromUrl, b as bucketName, r as r2Client } from '../../chunks/r2-client_C7UAhBzL.mjs';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
import { s as secureJsonResponse } from '../../chunks/securityHeaders_B-pWwsKs.mjs';
import { v as verifyAuth, c as createUnauthorizedResponse } from '../../chunks/auth-middleware_CSAV_C_Q.mjs';
import { V as VALIDATION_CONFIG } from '../../chunks/app.config_BO63yO4S.mjs';
export { renderers } from '../../renderers.mjs';

const DeleteImageSchema = z.object({
  imageUrl: z.string().url("URL inválida").max(VALIDATION_CONFIG.MAX_STRING_LENGTH.URL)
});
const POST = async ({ request }) => {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return createUnauthorizedResponse(authResult.error);
    }
    ensureR2Available();
    let rawData;
    try {
      rawData = await request.json();
    } catch {
      return secureJsonResponse({ error: "JSON inválido" }, 400);
    }
    const validationResult = DeleteImageSchema.safeParse(rawData);
    if (!validationResult.success) {
      return secureJsonResponse(
        {
          error: "Datos inválidos",
          details: validationResult.error.format()
        },
        400
      );
    }
    const { imageUrl } = validationResult.data;
    const filename = extractFilenameFromUrl(imageUrl);
    if (!filename) {
      return secureJsonResponse(
        { error: "URL de imagen inválida" },
        400
      );
    }
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filename
    });
    try {
      await r2Client.send(command);
    } catch (r2Error) {
      console.error("R2 deletion failed", {
        error: r2Error instanceof Error ? r2Error.message : "Unknown",
        filename,
        bucket: bucketName
      });
      if (r2Error instanceof Error && r2Error.name === "NoSuchKey") {
        return secureJsonResponse(
          {
            success: true,
            message: "Imagen ya no existe"
          },
          200
        );
      }
      return secureJsonResponse(
        { error: "Error al eliminar la imagen de almacenamiento" },
        500
      );
    }
    return secureJsonResponse(
      {
        success: true,
        message: "Imagen eliminada exitosamente"
      },
      200
    );
  } catch (error) {
    console.error("POST /api/delete-image failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (error instanceof CustomError) {
      return secureJsonResponse({ error: error.message }, error.statusCode);
    }
    return secureJsonResponse(
      { error: "Error al eliminar la imagen" },
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
