import { c as connectDB } from '../../../chunks/mongodb_Kr9SiWRo.mjs';
import { U as User } from '../../../chunks/user_CWLeS9yw.mjs';
import { v as verifyToken } from '../../../chunks/totp_dkB4y3As.mjs';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
export { renderers } from '../../../renderers.mjs';

async function POST({ request }) {
    await connectDB();

    try {
        const { code, userId } = await request.json();

        if (!code || !userId) {
            return new Response(JSON.stringify({ error: 'Código y userId son requeridos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!user.totp_secret) {
            return new Response(JSON.stringify({ error: '2FA no está configurado' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verificar el código TOTP
        const isValid = verifyToken(code, user.totp_secret);

        if (!isValid) {
            return new Response(JSON.stringify({ error: 'Código incorrecto' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Si es la primera verificación, habilitar 2FA
        if (!user.totp_enabled) {
            user.totp_enabled = true;
            await user.save();
        }

        // Generar token JWT con acceso completo
        const secretKey = process.env.SECRET_JWT_KEY;
        if (!secretKey) {
            return new Response(JSON.stringify({ error: 'Error de configuración del servidor' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const token = jwt.sign(
            { userId: user._id, twoFactorVerified: true },
            secretKey,
            { expiresIn: '24h' }
        );

        const response = new Response(JSON.stringify({
            success: true,
            message: '2FA verificado correctamente'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        // Establecer cookie con el token JWT
        response.headers.append('Set-Cookie', serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 horas
        }));

        return response;
    } catch (error) {
        console.error('Error verificando 2FA:', error);
        return new Response(JSON.stringify({ error: 'Error al verificar 2FA' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
