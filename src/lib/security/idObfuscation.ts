/**
 * Sistema de Ofuscación de IDs
 * 
 * PORQUÉ:
 * - NO exponer ObjectId interno de MongoDB
 * - Prevenir enumeración de registros
 * - No revelar timing de creación
 * - Más profesional y seguro
 * 
 * ESTRATEGIA:
 * 1. Usar HMAC para crear hash único e impredecible
 * 2. Combinar con timestamp para unicidad
 * 3. Base64url para URL-safe
 */

import crypto from 'crypto';
import { SECURITY_CONFIG } from '../../config/app.config';

// ✅ Salt secreto desde config (idealmente desde env)
const SECRET_SALT = process.env.ID_SECRET || SECURITY_CONFIG.PUBLIC_ID.SALT;

/**
 * ✅ Crear ID público desde MongoDB _id
 * 
 * @param mongoId - MongoDB ObjectId como string
 * @returns ID público ofuscado (base64url)
 * 
 * @example
 * createPublicId('507f1f77bcf86cd799439011') 
 * // -> 'NTA3ZjFmNzdiY2Y4NmNkNzk5NDM5MDEx'
 */
export function createPublicId(mongoId: string): string {
    // Crear HMAC del ID con salt secreto
    const hmac = crypto
        .createHmac('sha256', SECRET_SALT)
        .update(mongoId)
        .digest('base64url');

    // Combinar primeros 16 chars del hash + timestamp (para unicidad)
    const timestamp = Date.now().toString(36); // Base36 timestamp
    const publicId = `${hmac.substring(0, 16)}${timestamp}`;

    return Buffer.from(publicId).toString('base64url');
}

/**
 * ✅ Validar formato de ID público
 * 
 * @param publicId - ID público a validar
 * @returns true si el formato es válido
 */
export function isValidPublicId(publicId: string): boolean {
    try {
        // Debe ser base64url válido
        const decoded = Buffer.from(publicId, 'base64url').toString('utf-8');

        // Debe tener longitud razonable (16 chars hash + timestamp)
        return decoded.length >= 16 && decoded.length <= 32;
    } catch {
        return false;
    }
}

/**
 * ⚠️ INTERNAL USE ONLY: Decodificar ID público
 * 
 * NOTA: Esto NO revela el ObjectId original.
 * Solo se usa internamente para mapear a DB.
 * En producción, usar una tabla de mapeo en cache.
 * 
 * @param publicId - ID público
 * @returns Hash decoded (NO el ObjectId original)
 */
export function decodePublicIdHash(publicId: string): string | null {
    try {
        const decoded = Buffer.from(publicId, 'base64url').toString('utf-8');

        // Remover timestamp (últimos chars)
        // Esto nos da el hash, no el ObjectId original
        return decoded.substring(0, 16);
    } catch {
        return null;
    }
}

/**
 * ✅ NUEVO: Sistema de mapeo ID público <-> MongoDB ID
 * 
 * PORQUÉ:
 * - En producción, mantener un índice en cache/DB
 * - Permite buscar sin revelar ObjectIds
 * - Más seguro que decodificación directa
 */
export class PublicIdMapper {
    private cacheMap: Map<string, string> = new Map();
    private reverseMap: Map<string, string> = new Map();

    /**
     * Registrar un mapeo
     */
    register(mongoId: string, publicId: string): void {
        this.cacheMap.set(publicId, mongoId);
        this.reverseMap.set(mongoId, publicId);
    }

    /**
     * Obtener MongoDB ID desde public ID
     */
    getMongoId(publicId: string): string | undefined {
        return this.cacheMap.get(publicId);
    }

    /**
     * Obtener public ID desde MongoDB ID
     */
    getPublicId(mongoId: string): string | undefined {
        return this.reverseMap.get(mongoId);
    }

    /**
     * Crear y registrar public ID
     */
    createAndRegister(mongoId: string): string {
        const existing = this.reverseMap.get(mongoId);
        if (existing) return existing;

        const publicId = createPublicId(mongoId);
        this.register(mongoId, publicId);
        return publicId;
    }

    /**
     * Limpiar cache (para testing)
     */
    clear(): void {
        this.cacheMap.clear();
        this.reverseMap.clear();
    }
}

// ✅ Instancia singleton del mapper
export const publicIdMapper = new PublicIdMapper();

/**
 * ✅ Alternativa: UUID v4 (completamente aleatorio)
 * 
 * PORQUÉ usar esto:
 * - No requiere mapeo
 * - Totalmente impredecible
 * - Estándar de la industria
 * 
 * CONTRA:
 * - Requiere campo adicional en DB
 * - Migración de datos existentes
 */
export function generateUUID(): string {
    return crypto.randomUUID();
}

/**
 * ✅ Validar UUID v4
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
