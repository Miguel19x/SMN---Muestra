import { c as connectDB } from '../../../chunks/mongodb_Kr9SiWRo.mjs';
import { U as User } from '../../../chunks/user_CWLeS9yw.mjs';
import { s as setup2FA } from '../../../chunks/totp_dkB4y3As.mjs';
import { v as verifyAuth, c as createUnauthorizedResponse } from '../../../chunks/auth-middleware_CSAV_C_Q.mjs';
export { renderers } from '../../../renderers.mjs';

async function POST({ request }) {
    // Verificar autenticación
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
        return createUnauthorizedResponse(authResult.error);
    }

    await connectDB();

    try {
        const user = await User.findById(authResult.userId);

        if (!user) {
            return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Si ya tiene 2FA habilitado, no permitir reconfigurar
        if (user.totp_enabled && user.totp_secret) {
            return new Response(JSON.stringify({ error: '2FA ya está configurado' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generar nuevo setup de 2FA
        const { secret, qrCode, otpauthUrl } = await setup2FA(user.username);

        // Guardar el secreto temporalmente (se confirmará cuando verifique el primer código)
        user.totp_secret = secret;
        user.totp_enabled = false; // Se habilitará después de verificar
        await user.save();

        return new Response(JSON.stringify({
            qrCode,
            otpauthUrl,
            message: 'Escanea el código QR con tu aplicación de autenticación'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error configurando 2FA:', error);
        return new Response(JSON.stringify({ error: 'Error al configurar 2FA' }), {
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
