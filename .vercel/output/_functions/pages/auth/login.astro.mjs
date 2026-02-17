import { c as connectDB } from '../../chunks/mongodb_Bx9AnUPZ.mjs';
import { U as UserRepository } from '../../chunks/user-repository_C06Cq5l3.mjs';
import { serialize } from 'cookie';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
import { v as verifyTurnstileToken } from '../../chunks/turnstile_B4As6Fer.mjs';
import redis from '../../chunks/redis_DF8_68s9.mjs';
import { Ratelimit } from '@upstash/ratelimit';
export { renderers } from '../../renderers.mjs';

const loginRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
  prefix: '@upstash/login-ratelimit',
});

const config = {
  runtime: 'edge',
};

async function POST({ request }) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
  const { success, limit, remaining, reset } = await loginRatelimit.limit(ip);

  if (!success) {
    return new Response(JSON.stringify({ 
      error: 'Demasiados intentos de inicio de sesión. Por favor, intente más tarde.' 
    }), {
      status: 429,
      headers: { 
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      }
    });
  }

  await connectDB();
  const userRepository = new UserRepository();
  
  try {
    const data = await request.json();
    const { username, password } = data;

    // Captcha verification
    const turnstileToken = data['cf-turnstile-response'] || data.captchaToken;
    if (!turnstileToken) {
      throw new CustomError('Falta el token de verificación', 400);
    }

    const turnstileVerification = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileVerification.success) {
      throw new CustomError('Verificación de captcha fallida', 400);
    }

    const loginResult = await userRepository.login({ username, password });

    if (loginResult) {
      const { user, questionNumber, securityQuestion } = loginResult;

      const sessionCookie = serialize('session', user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      });

      return new Response(JSON.stringify({ 
        message: 'Login successful', 
        securityQuestion, 
        questionNumber 
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': sessionCookie
        },
      });
    } else {
      throw new CustomError('Credenciales inválidas', 401);
    }
  } catch (error) {
    console.error('Error en login:', error);
    const errorMessage = error instanceof CustomError ? error.message : 'Error interno del servidor';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: error instanceof CustomError ? error.statusCode : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  config
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
