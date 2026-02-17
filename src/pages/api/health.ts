import type { APIRoute } from 'astro';
import { getConnectionStatus } from '@/lib/mongodb';
import mongoose from 'mongoose';

/**
 * Health Check Endpoint
 * 
 * Este endpoint permite monitorear el estado del sistema y sus servicios críticos.
 * Útil para alertas de uptime, monitoreo y debugging en producción.
 * 
 * GET /api/health
 * 
 * Respuestas:
 * - 200: Sistema operativo
 * - 503: Sistema con problemas críticos
 */
export const GET: APIRoute = async ({ request }) => {
    const startTime = Date.now();

    try {
        // 1. Verificar MongoDB
        const dbStatus = getConnectionStatus() as {
            isConnected: boolean;
            readyState: number;
            readyStateText: string;
            lastConnected: number | null;
            retryCount: number;
            connectionAge: number | null;
        };
        const dbHealthy = dbStatus.isConnected;

        // 2. Verificar variables de entorno críticas
        const envHealthy = !!(
            process.env.MONGODB_URL &&
            process.env.SECRET_JWT_KEY &&
            process.env.R2_ACCOUNT_ID &&
            process.env.R2_BUCKET_NAME
        );

        // 3. Test de escritura/lectura en MongoDB (opcional, solo si está conectado)
        let dbWritable = false;
        if (dbHealthy) {
            try {
                // Ping simple a la base de datos
                if (mongoose.connection.db) {
                    await mongoose.connection.db.admin().ping();
                }
                dbWritable = true;
            } catch (error) {
                console.error('[Health Check] MongoDB ping failed:', error);
                dbWritable = false;
            }
        }

        // 4. Calcular tiempo de respuesta
        const responseTime = Date.now() - startTime;

        // 5. Determinar estado general
        const isHealthy = dbHealthy && envHealthy && dbWritable;
        const statusCode = isHealthy ? 200 : 503;

        // 6. Construir respuesta detallada
        const healthReport = {
            status: isHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`,
            services: {
                database: {
                    status: dbHealthy && dbWritable ? 'connected' : 'disconnected',
                    details: {
                        connected: dbHealthy,
                        writable: dbWritable,
                        readyState: dbStatus.readyStateText,
                        connectionAge: dbStatus.connectionAge
                            ? `${Math.round(dbStatus.connectionAge / 1000)}s`
                            : null,
                        lastConnected: dbStatus.lastConnected
                            ? new Date(dbStatus.lastConnected).toISOString()
                            : null
                    }
                },
                environment: {
                    status: envHealthy ? 'ok' : 'missing_variables',
                    nodeEnv: process.env.NODE_ENV || 'unknown',
                    hasMongoUri: !!process.env.MONGODB_URL,
                    hasJwtSecret: !!process.env.SECRET_JWT_KEY,
                    hasR2Config: !!(process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET_NAME)
                },
                memory: {
                    usage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
                    total: process.memoryUsage().heapTotal / 1024 / 1024  // MB
                }
            },
            uptime: process.uptime ? `${Math.round(process.uptime())}s` : 'N/A'
        };

        // En producción, ocultar detalles sensibles si el servicio está degradado
        if (process.env.NODE_ENV === 'production' && !isHealthy) {
            return new Response(
                JSON.stringify({
                    status: 'unhealthy',
                    timestamp: healthReport.timestamp
                }),
                {
                    status: statusCode,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    }
                }
            );
        }

        return new Response(JSON.stringify(healthReport, null, 2), {
            status: statusCode,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });

    } catch (error) {
        console.error('[Health Check] Error crítico:', error);

        return new Response(
            JSON.stringify({
                status: 'error',
                timestamp: new Date().toISOString(),
                message: process.env.NODE_ENV === 'development'
                    ? (error as Error).message
                    : 'Internal server error'
            }),
            {
                status: 503,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            }
        );
    }
};
