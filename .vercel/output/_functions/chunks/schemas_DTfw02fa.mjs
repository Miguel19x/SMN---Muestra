import { z } from 'zod';
import { Types } from 'mongoose';
import { V as VALIDATION_CONFIG, B as BUSINESS_CONFIG } from './app.config_BO63yO4S.mjs';

const { ObjectId } = Types;
const ObjectIdSchema = z.string().refine(
  (val) => {
    return typeof val === "string" && ObjectId.isValid(val);
  },
  { message: "ID inválido" }
);
const CodigoSchema = z.string().regex(
  VALIDATION_CONFIG.PATTERNS.CEDULA,
  "Código inválido"
);
const ISODateSchema = z.string().regex(
  VALIDATION_CONFIG.PATTERNS.DATE_ISO,
  "Fecha inválida. Formato: YYYY-MM-DD"
);
z.object({
  nombre: z.string().min(2, "Nombre muy corto").max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM, "Nombre muy largo").trim(),
  codigo: CodigoSchema,
  antiguedad: z.number().int("Antigüedad debe ser entero").min(0, "Antigüedad no puede ser negativa").max(500, "Antigüedad inválida"),
  categoria: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
  origen: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
  pais_origen: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
  tipo_objeto: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).optional(),
  clasificacion: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
  condicion: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG).optional(),
  estado_conservacion: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG).optional(),
  ubicacion_actual: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG).optional(),
  ultimo_lugar_conocido: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.LONG).optional(),
  fecha_registro: ISODateSchema,
  imagen: z.string().url("URL de imagen inválida").max(VALIDATION_CONFIG.MAX_STRING_LENGTH.URL).optional(),
  // CAPTCHA tokens
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
    message: "País de origen es requerido para importados",
    path: ["pais_origen"]
  }
).refine(
  (data) => {
    return !!(data["cf-turnstile-response"] || data.captchaToken);
  },
  {
    message: "Token de verificación requerido",
    path: ["captchaToken"]
  }
);
z.object({
  objeto_id: ObjectIdSchema,
  // ✅ CRÍTICO: Previene NoSQL injection
  reason: z.string().min(BUSINESS_CONFIG.REMOVAL_REQUEST.MIN_REASON_LENGTH, "Razón muy corta").max(BUSINESS_CONFIG.REMOVAL_REQUEST.MAX_REASON_LENGTH, "Razón muy larga").trim(),
  evidence_url: z.string().url("URL de evidencia inválida").max(VALIDATION_CONFIG.MAX_STRING_LENGTH.URL).optional(),
  requester_email: z.string().email("Email inválido").max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).optional(),
  // Opcionales Twitter
  twitter_user_id: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
  twitter_username: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.SHORT).optional(),
  twitter_name: z.string().max(VALIDATION_CONFIG.MAX_STRING_LENGTH.MEDIUM).optional()
});
z.object({
  requestId: ObjectIdSchema,
  // ✅ CRÍTICO: Previene NoSQL injection
  status: z.enum(["approved", "rejected"]),
  admin_notes: z.string().max(BUSINESS_CONFIG.REMOVAL_REQUEST.MAX_REASON_LENGTH).optional()
});
z.object({
  estado_registro: z.enum(VALIDATION_CONFIG.VALID_ESTADOS).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional()
});
z.object({
  objeto_id: ObjectIdSchema.optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  admin: z.enum(["true", "false"]).optional()
});

export { ObjectIdSchema as O };
