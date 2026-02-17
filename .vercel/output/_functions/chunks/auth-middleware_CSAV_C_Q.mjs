import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

async function verifyAuth(request) {
  try {
    const cookies = parse(request.headers.get("Cookie") || "");
    const token = cookies.token;
    if (!token) {
      return { success: false, error: "No autorizado" };
    }
    const secretKey = process.env.SECRET_JWT_KEY;
    if (!secretKey) {
      console.error("SECRET_JWT_KEY no está definida en las variables de entorno");
      return { success: false, error: "Error de configuración del servidor" };
    }
    const decoded = jwt.verify(token, secretKey);
    return { success: true, userId: decoded.userId };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return { success: false, error: "Token expirado" };
      }
      if (error.name === "JsonWebTokenError") {
        return { success: false, error: "Token inválido" };
      }
    }
    return { success: false, error: "Error de autenticación" };
  }
}
function createUnauthorizedResponse(message = "No autorizado") {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}

export { createUnauthorizedResponse as c, verifyAuth as v };
