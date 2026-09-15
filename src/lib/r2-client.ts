import { S3Client } from "@aws-sdk/client-s3";

// Validar que las variables de entorno estén definidas
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

/**
 * Verifica si todas las credenciales de R2 están configuradas
 */
export function isR2Configured(): boolean {
    return !!(
        R2_ACCOUNT_ID &&
        R2_ACCESS_KEY_ID &&
        R2_SECRET_ACCESS_KEY &&
        R2_BUCKET_NAME
    );
}

if (!isR2Configured()) {
    const missingVars = [];
    if (!R2_ACCOUNT_ID) missingVars.push('R2_ACCOUNT_ID');
    if (!R2_ACCESS_KEY_ID) missingVars.push('R2_ACCESS_KEY_ID');
    if (!R2_SECRET_ACCESS_KEY) missingVars.push('R2_SECRET_ACCESS_KEY');
    if (!R2_BUCKET_NAME) missingVars.push('R2_BUCKET_NAME');

    console.warn(
        `⚠️ Cloudflare R2 no está configurado (variables faltantes: ${missingVars.join(', ')}). Operando en modo demo sin almacenamiento R2.`
    );
}

/**
 * Cliente S3 configurado para Cloudflare R2
 * Singleton compartido para todas las operaciones de R2
 * 
 * @throws {Error} Si las credenciales no están configuradas en producción
 */
export const r2Client = isR2Configured()
    ? new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID!,
            secretAccessKey: R2_SECRET_ACCESS_KEY!,
        },
    })
    : null;

/**
 * Nombre del bucket de R2
 */
export const bucketName = R2_BUCKET_NAME || '';

/**
 * Verifica si el cliente R2 está disponible
 * Útil para prevenir errores en entornos sin configuración completa
 */
export function ensureR2Available(): void {
    if (!r2Client) {
        throw new Error(
            'R2 Client no está disponible. Verifica las variables de entorno.'
        );
    }
}

/**
 * Extrae el nombre del archivo de una URL completa
 * @param imageUrl - URL completa de la imagen
 * @returns Nombre del archivo o null si es inválido
 */
export function extractFilenameFromUrl(imageUrl: string): string | null {
    try {
        if (!imageUrl || typeof imageUrl !== 'string') {
            return null;
        }

        const filename = imageUrl.split('/').pop();

        if (!filename || filename.trim() === '') {
            console.warn(`Invalid filename extracted from URL: ${imageUrl}`);
            return null;
        }

        return filename;
    } catch (error) {
        console.error('Error extracting filename from URL:', error);
        return null;
    }
}

/**
 * Wrapper seguro para operaciones de R2
 * Ejecuta una función que interactúa con R2 con manejo de errores
 * 
 * @param operation - Función async que realiza operación en R2
 * @param fallback - Valor a retornar si R2 no está disponible
 * @returns Resultado de la operación o fallback
 */
export async function safeR2Operation<T>(
    operation: () => Promise<T>,
    fallback: T
): Promise<T> {
    if (!r2Client) {
        console.warn('R2 operation skipped: client not configured');
        return fallback;
    }

    try {
        return await operation();
    } catch (error) {
        console.error('R2 operation failed:', error);
        return fallback;
    }
}
