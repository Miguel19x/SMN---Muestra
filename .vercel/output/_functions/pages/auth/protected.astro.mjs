import { parse, serialize } from 'cookie';
import { c as connectDB } from '../../chunks/mongodb_Kr9SiWRo.mjs';
import { U as UserRepository } from '../../chunks/user-repository_C06Cq5l3.mjs';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
export { renderers } from '../../renderers.mjs';

const { ObjectId } = Types;

async function POST({ request }) {
  await connectDB();
  const userRepository = new UserRepository();

  try {
    const { securityPhrase, questionNumber } = await request.json();
    const cookies = parse(request.headers.get('Cookie') || '');
    const userId = cookies.session;

    if (!securityPhrase || !userId || !questionNumber) {
      throw new CustomError('Datos de autenticación incompletos', 400);
    }

    if (!ObjectId.isValid(userId)) {
      throw new CustomError('ID de usuario inválido', 400);
    }

    const user = await userRepository.findById(new ObjectId(userId));
    if (!user) {
      throw new CustomError('Usuario no encontrado', 404);
    }

    const isValidSecurityPhrase = await userRepository.verifySecurityPhrase(
      user._id,
      questionNumber,
      securityPhrase
    );

    if (isValidSecurityPhrase) {
      // 2FA es obligatorio para todos los admins
      // Si el usuario tiene 2FA habilitado, requerir verificación
      // Si no lo tiene, necesita configurarlo primero

      const requires2FA = true; // 2FA obligatorio
      const totp_enabled = user.totp_enabled || false;

      if (requires2FA) {
        // Generar token temporal para el paso de 2FA
        const tempToken = jwt.sign(
          { userId: user._id, step: '2fa_pending' },
          process.env.SECRET_JWT_KEY,
          { expiresIn: '10m' }
        );

        const tempTokenCookie = serialize('token', tempToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 600, // 10 minutos para completar 2FA
          path: '/',
        });

        return new Response(JSON.stringify({
          message: 'Verificación de seguridad exitosa',
          requires2FA: true,
          totp_enabled: totp_enabled,
          userId: user._id.toString()
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': tempTokenCookie
          },
        });
      }
    } else {
      throw new CustomError('Frase de seguridad inválida', 401);
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    const errorMessage = error instanceof CustomError ? error.message : 'Error interno del servidor';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: error instanceof CustomError ? error.statusCode : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
