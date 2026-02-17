import { z } from 'zod';
import { c as connectDB } from '../../chunks/mongodb_Kr9SiWRo.mjs';
import { O as Objeto } from '../../chunks/objeto_BtcWFCv2.mjs';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
import { V as VALIDATION_CONFIG, C as CACHE_CONFIG } from '../../chunks/app.config_BO63yO4S.mjs';
import { v as verifyTurnstileToken } from '../../chunks/turnstile_B4As6Fer.mjs';
import { r as rateLimit } from '../../chunks/rateLimiter_Blj738rK.mjs';
import { r as rateLimitApiGet } from '../../chunks/bruteForceProtection_Bg_DvZdH.mjs';
import { s as secureJsonResponse } from '../../chunks/securityHeaders_B-pWwsKs.mjs';
import { r as redis } from '../../chunks/redis_CYcAgJqj.mjs';
import { publicIdMapper } from '../../chunks/idObfuscation_Dfj8wj8l.mjs';
import { O as ObjetoService } from '../../chunks/objeto.service_D4NcirIP.mjs';
import { l as logger } from '../../chunks/logger_CX-LuAmG.mjs';
export { renderers } from '../../renderers.mjs';

const spanishBlacklist = [
  "maldito",
  "maldita",
  "carajo",
  "coño",
  "verga",
  "marico",
  "marica",
  "mierda",
  "puto",
  "puta",
  "pendejo",
  "pendeja",
  "cabron",
  "cabrona",
  "maricon",
  "mariconazo",
  "mamaguevo",
  "chupamedias",
  "malparido",
  "hijueputa",
  "gonorrea",
  "huevon",
  "guevon",
  "rata",
  "perro"
];
const englishBlacklist = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "damn",
  "crap",
  "dick",
  "cock",
  "pussy",
  "slut",
  "whore",
  "faggot",
  "nigger",
  "cunt"
];
const allBlacklistWords = [...spanishBlacklist, ...englishBlacklist];
const l33tMap = {
  "3": "e",
  "4": "a",
  "1": "i",
  "0": "o",
  "5": "s",
  "7": "t",
  "8": "b",
  "@": "a",
  "$": "s",
  "!": "i",
  "|": "i",
  "€": "e"
  // ✅ FIX: + escapado correctamente
};
const compiledPatterns = {
  // Espacios y caracteres especiales
  specialChars: /[\s._\-*]+/g,
  // Acentos (NFD normalization)
  accents: /[\u0300-\u036f]/g,
  // Caracteres repetidos
  repeatedChars: /(.)\1{2,}/g,
  // L33t speak patterns (precompilados)
  l33tPatterns: Object.entries(l33tMap).map(([leet, letter]) => ({
    pattern: new RegExp(leet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    replacement: letter
  }))
};
function normalizeText(text) {
  return text.toLowerCase().normalize("NFD").replace(compiledPatterns.accents, "");
}
function normalizeAggressive(text) {
  let normalized = normalizeText(text);
  normalized = normalized.replace(compiledPatterns.specialChars, "");
  for (const { pattern, replacement } of compiledPatterns.l33tPatterns) {
    normalized = normalized.replace(pattern, replacement);
  }
  normalized = normalized.replace(compiledPatterns.repeatedChars, "$1");
  return normalized;
}
const normalizedBlacklistCache = new Set(
  allBlacklistWords.map((word) => normalizeAggressive(word))
);
function containsProfanity(text) {
  if (!text || typeof text !== "string") return false;
  const normalized = normalizeAggressive(text);
  for (const blacklistedWord of normalizedBlacklistCache) {
    if (normalized.includes(blacklistedWord)) {
      return true;
    }
  }
  return false;
}
function validateDataProfanity(data, fieldsToCheck) {
  const errors = [];
  for (const field of fieldsToCheck) {
    const value = data[field];
    if (value == null || typeof value !== "string") {
      continue;
    }
    if (containsProfanity(value)) {
      errors.push(field);
    }
  }
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : void 0
  };
}

const CACHE_NAMESPACE = "api:objetos";
const getCacheKey = (estado) => `${CACHE_NAMESPACE}:${estado}:v8`;
const CONFIG = {
  CACHE_TTL: CACHE_CONFIG.TTL.DESAPARECIDOS,
  MAX_REQUEST_SIZE: VALIDATION_CONFIG.MAX_REQUEST_SIZE_BYTES,
  VALID_CATEGORIAS: ["Tipo A", "Tipo B", "Tipo C", "Tipo D"],
  VALID_ORIGENES: ["N", "I"],
  VALID_CLASIFICACIONES: ["Clase A", "Clase B", "Clase C", "Clase D"],
  VALID_ESTADOS: VALIDATION_CONFIG.VALID_ESTADOS,
  DEFAULT_ESTADO_REGISTRO: "aprobado"
};
const PaisOrigenSchema = z.string().min(1, "País de origen no puede estar vacío").max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "País de origen contiene caracteres inválidos");
const CreateObjetoSchema = z.object({
  nombre: z.string().min(2).max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM),
  codigo: z.preprocess(
    (val) => val === "" || val === void 0 ? void 0 : val,
    z.string().regex(/^[A-Za-z0-9\-_.]+$/).optional()
  ),
  antiguedad: z.union([
    z.number().int().min(0).max(200),
    z.string().transform((val) => {
      if (val === "" || val === void 0) return void 0;
      const num = parseInt(val, 10);
      return isNaN(num) ? void 0 : num;
    })
  ]).optional(),
  categoria: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
  origen: z.enum(CONFIG.VALID_ORIGENES).optional(),
  pais_origen: PaisOrigenSchema.optional(),
  tipo_objeto: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).optional(),
  clasificacion: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
  condicion: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).optional(),
  estado_conservacion: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).optional(),
  ubicacion_actual: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG).optional(),
  ultimo_lugar_conocido: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG).optional(),
  estado: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
  fecha_registro: z.preprocess(
    (val) => val === "" || val === void 0 ? void 0 : val,
    z.string().regex(VALIDATION_CONFIG.PATTERNS.DATE_ISO).optional()
  ),
  hora_registro: z.preprocess(
    (val) => val === "" || val === void 0 ? void 0 : val,
    z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional()
  ),
  imagen: z.preprocess(
    (val) => val === "" || val === void 0 ? void 0 : val,
    z.string().url().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.URL).optional()
  ),
  "cf-turnstile-response": z.string().optional(),
  captchaToken: z.string().optional()
}).refine(
  (data) => {
    if (data.origen === "I" && !data.pais_origen) {
      return false;
    }
    return true;
  },
  {
    message: "El país de origen es requerido para objetos importados",
    path: ["pais_origen"]
  }
);
const objetoService = new ObjetoService();
function toResponseDTO(doc) {
  const publicId = publicIdMapper.createAndRegister(doc._id.toString());
  const docAny = doc;
  return {
    id: publicId,
    _id: doc._id.toString(),
    origen: doc.origen && doc.origen.trim() !== "" ? doc.origen : "N",
    nombre: doc.nombre,
    codigo: doc.codigo && doc.codigo.trim() !== "" ? doc.codigo : "Sin código",
    antiguedad: doc.antiguedad,
    categoria: docAny.categoria || "",
    pais_origen: doc.pais_origen || "Nacional",
    tipo_objeto: docAny.tipo_objeto,
    clasificacion: docAny.clasificacion,
    condicion: docAny.condicion,
    estado_conservacion: docAny.estado_conservacion,
    ubicacion_actual: docAny.ubicacion_actual,
    ultimo_lugar_conocido: doc.ultimo_lugar_conocido,
    estado: docAny.estado,
    fecha_registro: doc.fecha_registro,
    hora_registro: docAny.hora_registro,
    imagen: doc.imagen,
    estado_registro: doc.estado_registro,
    etiqueta: doc.etiqueta,
    antiguedadStage: objetoService.getAntiguedadStage(doc.antiguedad),
    condicionEstado: objetoService.getCondicionEstado(doc.antiguedad)
  };
}
const GET = async ({ request }) => {
  const startTime = Date.now();
  try {
    const rateLimitResult = await rateLimitApiGet(request);
    if (!rateLimitResult.success) {
      return secureJsonResponse(
        { error: "Demasiadas solicitudes" },
        429,
        rateLimitResult.headers
      );
    }
    const url = new URL(request.url);
    const estado_registro = url.searchParams.get("estado_registro") || CONFIG.DEFAULT_ESTADO_REGISTRO;
    if (!CONFIG.VALID_ESTADOS.includes(estado_registro)) {
      return secureJsonResponse({ error: "Estado inválido" }, 400);
    }
    const cacheKey = getCacheKey(estado_registro);
    const bypassCache = url.searchParams.get("nocache") === "1";
    if (!bypassCache) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug("Cache HIT", {
          key: cacheKey,
          size: cached.length,
          latency: Date.now() - startTime
        });
        return secureJsonResponse(
          { objetos: cached, source: "cache" },
          200,
          { ...rateLimitResult.headers, "X-Cache": "HIT" }
        );
      }
    } else {
      logger.info("Cache bypassed via query param");
    }
    await connectDB();
    const objetos = await Objeto.find({ estado_registro }).lean().exec();
    if (objetos.length === 0) {
      logger.info("Empty result set", { estado_registro });
      return secureJsonResponse(
        { objetos: [], source: "database" },
        200,
        { ...rateLimitResult.headers, "X-Cache": "MISS" }
      );
    }
    const responseData = objetos.map(toResponseDTO);
    if (responseData.length > 0 && objetos.length > 0) {
      logger.debug("First DTO sample", {
        dto: {
          id: responseData[0].id,
          origen: responseData[0].origen,
          codigo: responseData[0].codigo,
          estado: responseData[0].estado
        }
      });
    }
    await redis.set(
      cacheKey,
      JSON.stringify(responseData),
      { ex: CONFIG.CACHE_TTL }
    );
    logger.info("Query executed", {
      estado_registro,
      count: objetos.length,
      latency: Date.now() - startTime
    });
    return secureJsonResponse(
      { objetos: responseData, source: "database" },
      200,
      { ...rateLimitResult.headers, "X-Cache": "MISS" }
    );
  } catch (error) {
    logger.error("GET /api/inventario failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      latency: Date.now() - startTime
    });
    if (error instanceof CustomError) {
      return secureJsonResponse({ error: "Error del servidor" }, error.statusCode);
    }
    return secureJsonResponse({ error: "Error interno" }, 500);
  }
};
const POST = async ({ request }) => {
  const startTime = Date.now();
  try {
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return secureJsonResponse(
        { error: "Límite de solicitudes alcanzado" },
        429,
        rateLimitResult.headers
      );
    }
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > CONFIG.MAX_REQUEST_SIZE) {
      return secureJsonResponse({ error: "Request demasiado grande" }, 413);
    }
    let rawData;
    try {
      rawData = await request.json();
    } catch (error) {
      return secureJsonResponse({ error: "JSON inválido" }, 400);
    }
    const validationResult = CreateObjetoSchema.safeParse(rawData);
    if (!validationResult.success) {
      logger.warn("Validation failed", {
        errors: validationResult.error.issues.map((i) => i.path.join("."))
      });
      return secureJsonResponse(
        { error: "Datos inválidos" },
        400
      );
    }
    const data = validationResult.data;
    const textFieldsToCheck = [
      "nombre",
      "tipo_objeto",
      "clasificacion",
      "ultimo_lugar_conocido",
      "pais_origen"
    ];
    const profanityValidation = validateDataProfanity(data, textFieldsToCheck);
    if (!profanityValidation.isValid) {
      return secureJsonResponse(
        { error: "Contenido inapropiado detectado" },
        400
      );
    }
    const turnstileToken = data["cf-turnstile-response"] || data.captchaToken;
    if (!turnstileToken) {
      return secureJsonResponse({ error: "Verificación requerida" }, 400);
    }
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const turnstileVerification = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileVerification.success) {
      return secureJsonResponse({ error: "Verificación fallida" }, 400);
    }
    await connectDB();
    const paisOrigenSeguro = data.origen === "N" ? "Nacional" : data.pais_origen || "Desconocido";
    if (typeof paisOrigenSeguro !== "string") {
      throw new Error("País de origen inválido");
    }
    const objetoData = {
      nombre: data.nombre,
      codigo: data.codigo || "",
      antiguedad: data.antiguedad || 0,
      categoria: data.categoria || "",
      origen: data.origen || "N",
      pais_origen: paisOrigenSeguro,
      tipo_objeto: data.tipo_objeto,
      clasificacion: data.clasificacion,
      condicion: data.condicion,
      estado_conservacion: data.estado_conservacion,
      ubicacion_actual: data.ubicacion_actual,
      ultimo_lugar_conocido: data.ultimo_lugar_conocido,
      estado: data.estado,
      fecha_registro: data.fecha_registro || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      hora_registro: data.hora_registro,
      imagen: data.imagen,
      estado_registro: "pendiente"
    };
    const newObjeto = await objetoService.createObjeto(objetoData);
    try {
      await Promise.all([
        redis.del(getCacheKey("pendiente")),
        redis.del(getCacheKey("aprobado"))
      ]);
    } catch (cacheError) {
      logger.warn("Cache invalidation failed", {
        error: cacheError instanceof Error ? cacheError.message : "Unknown"
      });
    }
    logger.info("Record created", {
      id: newObjeto._id.toString(),
      latency: Date.now() - startTime
    });
    return secureJsonResponse(
      {
        success: true,
        data: toResponseDTO(newObjeto)
      },
      201
    );
  } catch (error) {
    logger.error("POST /api/inventario failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      latency: Date.now() - startTime
    });
    if (error instanceof CustomError) {
      return secureJsonResponse({ error: "Error del servidor" }, error.statusCode);
    }
    return secureJsonResponse({ error: "Error al crear registro" }, 500);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
