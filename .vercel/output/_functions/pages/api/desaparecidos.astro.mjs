import { c as connectDB } from '../../chunks/mongodb_Bx9AnUPZ.mjs';
import { D as Desaparecido } from '../../chunks/desaparecido_C53UEs1Y.mjs';
import { g as getLegalCondition, a as getAgeStage } from '../../chunks/utils_CdDBA7zL.mjs';
import redis from '../../chunks/redis_DF8_68s9.mjs';
import { Ratelimit } from '@upstash/ratelimit';
import { v as verifyTurnstileToken } from '../../chunks/turnstile_B4As6Fer.mjs';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
import { g as getSecurityHeaders } from '../../chunks/securityHeaders_DSa4Cs-i.mjs';
export { renderers } from '../../renderers.mjs';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "1 s"),
  analytics: true,
  prefix: "@upstash/ratelimit"
});
const WHITELIST = ["upstash.com", "images.nomassecuestros.com"];
function getClientIp$1(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown-ip";
}
async function rateLimit(request) {
  const ip = getClientIp$1(request);
  if (WHITELIST.some((domain) => ip.includes(domain))) {
    return { success: true };
  }
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  if (!success) {
    return {
      success: false,
      message: "Demasiadas solicitudes. Por favor, intente más tarde.",
      headers: {
        "Retry-After": String(Math.ceil((reset - Date.now()) / 1e3)),
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString()
      }
    };
  }
  return { success: true };
}

const spanishBlacklist = [
  // Groserías comunes
  "mierda",
  "coño",
  "puta",
  "puto",
  "marico",
  "marica",
  "pendejo",
  "pendeja",
  "verga",
  "carajo",
  "cabron",
  "cabrón",
  "joder",
  "culo",
  "malparido",
  "malparida",
  "hijueputa",
  "gonorrea",
  "mamaguevo",
  "mamagueva",
  "güevo",
  "huevo",
  "cojoñes",
  "cojones",
  "maldito",
  "maldita",
  "mongolico",
  "mongólico",
  "retrasado",
  "retrasada",
  "idiota",
  "imbécil",
  "imbecil",
  "estúpido",
  "estupido",
  "estúpida",
  "estupida",
  "zorra",
  "perra",
  "prostituta",
  "ramera",
  "bastardo",
  "bastarda",
  "malnacido",
  "malnacida"
];
const englishBlacklist = [
  "fuck",
  "shit",
  "bitch",
  "ass",
  "asshole",
  "bastard",
  "damn",
  "dick",
  "pussy",
  "cunt",
  "whore",
  "slut",
  "motherfucker",
  "cock",
  "nigger",
  "faggot",
  "retard",
  "idiot",
  "moron",
  "stupid"
];
const spamPatterns = [
  /https?:\/\/[^\s]+\.(ru|cn|tk|ml|ga|cf)/i,
  // Dominios sospechosos
  /(\d{10,})/,
  // Números muy largos (posibles teléfonos spam)
  /(viagra|cialis|casino|lottery|winner|prize)/i
  // Spam común
];
const allBlacklistWords = [...spanishBlacklist, ...englishBlacklist];
const customBlacklist = [
  // Añade aquí tus palabras personalizadas
  // Ejemplo: 'palabraprohibida',
];
function normalizeText(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function normalizeAggressive(text) {
  let normalized = normalizeText(text);
  normalized = normalized.replace(/[\s._\-*]+/g, "");
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
    "+": "t"
  };
  Object.entries(l33tMap).forEach(([leet, letter]) => {
    const escapedLeet = leet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    normalized = normalized.replace(new RegExp(escapedLeet, "g"), letter);
  });
  normalized = normalized.replace(/(.)\1{2,}/g, "$1");
  return normalized;
}
function containsProfanity(text) {
  if (!text || typeof text !== "string") return false;
  const normalizedText = normalizeText(text);
  const aggressiveText = normalizeAggressive(text);
  const allWords = [...allBlacklistWords, ...customBlacklist];
  for (const word of allWords) {
    const normalizedWord = normalizeText(word);
    const regex = new RegExp(`\\b${normalizedWord}\\b`, "i");
    if (regex.test(normalizedText)) {
      return true;
    }
  }
  for (const word of allWords) {
    const aggressiveWord = normalizeAggressive(word);
    if (aggressiveText.includes(aggressiveWord)) {
      return true;
    }
  }
  for (const word of allWords) {
    const spacedPattern = word.split("").join("[\\s._\\-*]{0,2}");
    const spacedRegex = new RegExp(spacedPattern, "i");
    if (spacedRegex.test(text)) {
      return true;
    }
  }
  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}
function validateDataProfanity(data, fieldsToCheck) {
  const errors = {};
  for (const field of fieldsToCheck) {
    const value = data[field];
    if (typeof value === "string" && containsProfanity(value)) {
      errors[field] = `El campo contiene lenguaje inapropiado.`;
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

const SENSITIVE_FIELDS = [
  "password",
  "token",
  "jwt",
  "secret",
  "key",
  "cedula",
  "nombre",
  "email",
  "telefono",
  "direccion",
  "ip",
  "cookie",
  "authorization"
];
const REDACT_PATTERNS = [
  /\b[VE]-?\d{6,8}\b/gi,
  // Venezuelan cedula
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  // Phone numbers
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Emails
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  // IP addresses (IPv4)
  /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g
  // JWT tokens
];
function redactString(str) {
  let result = str;
  for (const pattern of REDACT_PATTERNS) {
    result = result.replace(pattern, "[REDACTED]");
  }
  return result;
}
function sanitizeForLogging(obj) {
  if (obj === null || obj === void 0) {
    return obj;
  }
  if (typeof obj === "string") {
    return redactString(obj);
  }
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForLogging(item));
  }
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some((field) => lowerKey.includes(field))) {
      result[key] = "[REDACTED]";
      continue;
    }
    result[key] = sanitizeForLogging(value);
  }
  return result;
}
function securityEvent(eventType, details) {
  const entry = {
    type: "SECURITY_EVENT",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    eventType,
    details: sanitizeForLogging(details)
  };
  console.warn(JSON.stringify(entry));
}

new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  // 5 attempts per 15 minutes
  analytics: true,
  prefix: "login_attempts"
});
const apiGetRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  // 60 requests per minute
  analytics: true,
  prefix: "api_get"
});
function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  return "unknown";
}
function hashIp(ip) {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
async function rateLimitApiGet(request) {
  const ip = getClientIp(request);
  const hashedIp = hashIp(ip);
  const { success, limit, remaining, reset } = await apiGetRateLimiter.limit(hashedIp);
  const headers = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString()
  };
  if (!success) {
    securityEvent("rate_limit", {
      endpoint: "api_get"
    });
    return {
      success: false,
      message: "Límite de solicitudes excedido. Intente más tarde.",
      headers: {
        ...headers,
        "Retry-After": String(Math.ceil((reset - Date.now()) / 1e3))
      }
    };
  }
  return { success: true, headers };
}

const config = {
  runtime: 'edge',
};

// Helper to apply security headers
function createSecureResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getSecurityHeaders(),
      ...extraHeaders,
    }
  });
}

// Helper to obfuscate MongoDB _id 
function sanitizeDocument(doc) {
  const { _id, ...rest } = doc;
  return {
    _id: _id ? _id.toString() : undefined, // Keep original _id
    ...rest,
    // Public ID for frontend (obfuscated)
    id: _id ? Buffer.from(_id.toString()).toString('base64url') : undefined,
  };
}

async function GET({ request }) {
  // Apply rate limiting to GET requests
  const rateLimitResult = await rateLimitApiGet(request);
  if (!rateLimitResult.success) {
    return createSecureResponse(
      { message: rateLimitResult.message },
      429,
      rateLimitResult.headers
    );
  }

  await connectDB();

  const url = new URL(request.url);
  const estado_registro = url.searchParams.get('estado_registro') || 'aprobado';

  try {
    const desaparecidos = await Desaparecido.find({ estado_registro }).lean();

    // Sanitize documents to hide internal IDs and add calculated fields
    const desaparecidosWithCalculatedFields = desaparecidos.map(d => ({
      ...sanitizeDocument(d),
      ageStage: getAgeStage(d.edad),
      legalCondition: getLegalCondition(d.edad)
    }));

    return createSecureResponse({
      desaparecidos: desaparecidosWithCalculatedFields,
    }, 200, rateLimitResult.headers);
  } catch (error) {
    // Secure logging - don't expose stack traces
    console.error('Error en GET /api/desaparecidos');
    throw new CustomError('Error al obtener los datos', 500);
  }
}


async function POST({ request }) {
  const rateLimitResult = await rateLimit(request);
  if (!rateLimitResult.success) {
    return new Response(JSON.stringify({ message: rateLimitResult.message }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...rateLimitResult.headers
      }
    });
  }

  let data;
  try {
    data = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al procesar los datos de la solicitud' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validar groserías en campos de texto
  const textFieldsToCheck = [
    'nombre', 'profesion', 'etnia', 'condicion_de_salud',
    'discapacidad', 'lugar_de_confinamiento', 'lugar_de_desaparicion', 'nacionalidad'
  ];

  const profanityValidation = validateDataProfanity(data, textFieldsToCheck);
  if (!profanityValidation.isValid) {
    return new Response(JSON.stringify({
      message: 'El contenido contiene lenguaje inapropiado',
      errors: profanityValidation.errors
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const turnstileToken = data['cf-turnstile-response'] || data.captchaToken;
  const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';

  if (!turnstileToken) {
    throw new CustomError('Falta el token de verificación', 400);
  }

  const turnstileVerification = await verifyTurnstileToken(turnstileToken, ip);
  if (!turnstileVerification.success) {
    return new Response(JSON.stringify({ message: 'Verificación de captcha fallida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await connectDB();

  try {
    if (data.extranjero === 'V') {
      data.nacionalidad = 'Venezolana';
    } else if (data.extranjero === 'E') {
      if (!data.nacionalidad) {
        throw new CustomError('La nacionalidad es requerida para extranjeros', 400);
      }
    } else {
      throw new CustomError('El valor de extranjero debe ser "V" o "E"', 400);
    }

    if (data.sexo && !['Masculino', 'Femenino'].includes(data.sexo)) {
      throw new CustomError('El sexo debe ser "Masculino" o "Femenino"', 400);
    }

    const lastDesaparecido = await Desaparecido.findOne({ estado_registro: 'pendiente' }).sort({ _id: -1 });
    const newEtiqueta = lastDesaparecido && lastDesaparecido.etiqueta === 'blue' ? 'green' : 'blue';

    const newDesaparecido = new Desaparecido({
      ...data,
      imagen: data.imagen,
      estado_registro: 'pendiente',
      etiqueta: newEtiqueta
    });
    await newDesaparecido.save();

    return new Response(JSON.stringify(newDesaparecido), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error en POST /api/desaparecidos:', error);
    if (error instanceof CustomError) {
      return new Response(JSON.stringify({ error: 'Error en POST /api/desaparecidos' }), {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw new CustomError('Error al agregar la persona desaparecida', 500, error.message);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  config
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
