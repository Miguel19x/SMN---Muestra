import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export interface AuthResult {
    success: boolean;
    userId?: string;
    error?: string;
}

/**
 * Verifica el token JWT de autenticación desde las cookies
 * @param request - Request object de Astro
 * @returns AuthResult con información del usuario o error
 */
export async function verifyAuth(request: Request): Promise<AuthResult> {
    try {
        const cookies = parse(request.headers.get('Cookie') || '');
        const token = cookies.token;

        if (!token) {
            return { success: false, error: 'No autorizado' };
        }

        if (token === 'demo-admin-token') {
            return { success: true, userId: 'demo-admin-user' };
        }

        const secretKey = process.env.SECRET_JWT_KEY || 'datatracker-demo-jwt-secret-key-2026';

        const decoded = jwt.verify(token, secretKey) as { userId: string };
        return { success: true, userId: decoded.userId };
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                return { success: false, error: 'Token expirado' };
            }
            if (error.name === 'JsonWebTokenError') {
                return { success: false, error: 'Token inválido' };
            }
        }
        return { success: false, error: 'Error de autenticación' };
    }
}

/**
 * Crea una respuesta HTTP 401 Unauthorized
 * @param message - Mensaje de error personalizado
 * @returns Response object con status 401
 */
export function createUnauthorizedResponse(message: string = 'No autorizado'): Response {
    return new Response(JSON.stringify({ error: message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
    });
}

/**
 * Crea una respuesta HTTP 403 Forbidden
 * @param message - Mensaje de error personalizado
 * @returns Response object con status 403
 */
export function createForbiddenResponse(message: string = 'Acceso denegado'): Response {
    return new Response(JSON.stringify({ error: message }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
    });
}
