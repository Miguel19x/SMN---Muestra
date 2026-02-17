/**
 * Sistema TOTP (Time-based One-Time Password) para 2FA
 * Compatible con Google Authenticator, Authy, etc.
 */

import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Configuración del autenticador
authenticator.options = {
    digits: 6,
    step: 30, // 30 segundos por código
    window: 1, // Permite códigos del período anterior/siguiente
};

/**
 * Genera un nuevo secreto TOTP
 * @returns Secreto en base32
 */
export function generateSecret(): string {
    return authenticator.generateSecret();
}

/**
 * Genera la URL otpauth para aplicaciones de autenticación
 * @param username - Nombre del usuario
 * @param secret - Secreto TOTP
 * @param issuer - Nombre de la aplicación (aparece en la app autenticadora)
 * @returns URL otpauth
 */
export function generateOtpAuthUrl(
    username: string,
    secret: string,
    issuer: string = 'DataTracker'
): string {
    return authenticator.keyuri(username, issuer, secret);
}

/**
 * Genera un código QR como data URL para escanear
 * @param otpauthUrl - URL otpauth
 * @returns Promise con el data URL del QR
 */
export async function generateQRCode(otpauthUrl: string): Promise<string> {
    try {
        const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
            errorCorrectionLevel: 'M',
            margin: 2,
            width: 256,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
        return qrDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('No se pudo generar el código QR');
    }
}

/**
 * Verifica un código TOTP
 * @param token - Código de 6 dígitos ingresado por el usuario
 * @param secret - Secreto TOTP del usuario
 * @returns true si el código es válido
 */
export function verifyToken(token: string, secret: string): boolean {
    try {
        // Limpiar el token (remover espacios)
        const cleanToken = token.replace(/\s/g, '');

        // Verificar que sea un número de 6 dígitos
        if (!/^\d{6}$/.test(cleanToken)) {
            return false;
        }

        return authenticator.verify({ token: cleanToken, secret });
    } catch (error) {
        console.error('Error verifying TOTP:', error);
        return false;
    }
}

/**
 * Genera un código TOTP actual (para testing)
 * @param secret - Secreto TOTP
 * @returns Código de 6 dígitos
 */
export function generateCurrentToken(secret: string): string {
    return authenticator.generate(secret);
}

/**
 * Valida el formato de un secreto TOTP
 * @param secret - Secreto a validar
 * @returns true si el formato es válido
 */
export function isValidSecret(secret: string): boolean {
    // El secreto debe ser una cadena base32 válida
    const base32Regex = /^[A-Z2-7]+=*$/i;
    return base32Regex.test(secret) && secret.length >= 16;
}

/**
 * Setup completo de 2FA para un usuario
 * @param username - Nombre del usuario
 * @returns Objeto con secreto y QR code
 */
export async function setup2FA(username: string): Promise<{
    secret: string;
    qrCode: string;
    otpauthUrl: string;
}> {
    const secret = generateSecret();
    const otpauthUrl = generateOtpAuthUrl(username, secret);
    const qrCode = await generateQRCode(otpauthUrl);

    return {
        secret,
        qrCode,
        otpauthUrl,
    };
}
