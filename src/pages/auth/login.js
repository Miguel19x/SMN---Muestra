import { connectDB } from '../../lib/mongodb';
import { UserRepository } from '../../lib/auth/user-repository';
import { serialize } from 'cookie';
import { CustomError } from '../../lib/CustomError';
import { verifyTurnstileToken } from '../../lib/turnstile';
import redis from '../../lib/redis';
import { Ratelimit } from '@upstash/ratelimit';

const loginRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
  prefix: '@upstash/login-ratelimit',
});

export const config = {
  runtime: 'edge',
}

export async function POST({ request }) {
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