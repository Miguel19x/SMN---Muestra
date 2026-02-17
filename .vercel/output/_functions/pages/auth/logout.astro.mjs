import { serialize } from 'cookie';
export { renderers } from '../../renderers.mjs';

async function POST() {
  const response = new Response(JSON.stringify({ message: 'Sesión cerrada' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

  // Limpiar cookie de token
  response.headers.append('Set-Cookie', serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0),
  }));

  // Limpiar cookie de session
  response.headers.append('Set-Cookie', serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0),
  }));

  return response;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
