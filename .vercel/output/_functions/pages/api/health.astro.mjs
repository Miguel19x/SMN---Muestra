import { g as getConnectionStatus } from '../../chunks/mongodb_Bx9AnUPZ.mjs';
import mongoose from 'mongoose';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request }) => {
  const startTime = Date.now();
  try {
    const dbStatus = getConnectionStatus();
    const dbHealthy = dbStatus.isConnected;
    const envHealthy = !!(process.env.MONGODB_URL && process.env.SECRET_JWT_KEY && process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET_NAME);
    let dbWritable = false;
    if (dbHealthy) {
      try {
        if (mongoose.connection.db) {
          await mongoose.connection.db.admin().ping();
        }
        dbWritable = true;
      } catch (error) {
        console.error("[Health Check] MongoDB ping failed:", error);
        dbWritable = false;
      }
    }
    const responseTime = Date.now() - startTime;
    const isHealthy = dbHealthy && envHealthy && dbWritable;
    const statusCode = isHealthy ? 200 : 503;
    const healthReport = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: {
          status: dbHealthy && dbWritable ? "connected" : "disconnected",
          details: {
            connected: dbHealthy,
            writable: dbWritable,
            readyState: dbStatus.readyStateText,
            connectionAge: dbStatus.connectionAge ? `${Math.round(dbStatus.connectionAge / 1e3)}s` : null,
            lastConnected: dbStatus.lastConnected ? new Date(dbStatus.lastConnected).toISOString() : null
          }
        },
        environment: {
          status: envHealthy ? "ok" : "missing_variables",
          nodeEnv: process.env.NODE_ENV || "unknown",
          hasMongoUri: !!process.env.MONGODB_URL,
          hasJwtSecret: !!process.env.SECRET_JWT_KEY,
          hasR2Config: !!(process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET_NAME)
        },
        memory: {
          usage: process.memoryUsage().heapUsed / 1024 / 1024,
          // MB
          total: process.memoryUsage().heapTotal / 1024 / 1024
          // MB
        }
      },
      uptime: process.uptime ? `${Math.round(process.uptime())}s` : "N/A"
    };
    if (process.env.NODE_ENV === "production" && !isHealthy) {
      return new Response(
        JSON.stringify({
          status: "unhealthy",
          timestamp: healthReport.timestamp
        }),
        {
          status: statusCode,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate"
          }
        }
      );
    }
    return new Response(JSON.stringify(healthReport, null, 2), {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error) {
    console.error("[Health Check] Error crítico:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
