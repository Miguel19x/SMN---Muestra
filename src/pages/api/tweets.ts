/**
 * API: Tweets Carousel
 * Refactorizada a TypeScript
 * 
 * MEJORAS:
 * - Type safety
 * - Mejor caching
 * - Validación de params
 * - Rate limiting
 */

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getProjectTweets, getWhitelistedAccountsTweets, formatTweetDate } from '../../lib/twitter';
import redis from '../../lib/redis';
import { secureJsonResponse } from '../../middleware/securityHeaders';
import { rateLimitApiGet } from '../../middleware/bruteForceProtection';

// ✅ Constantes de cache
const TWEETS_CACHE_TTL = 900; // 15 minutos
const CACHE_KEY_PREFIX = 'twitter_carousel_tweets';

// ✅ Validación de query params
const GetTweetsQuerySchema = z.object({
    type: z.enum(['project', 'whitelist']).optional().default('project'),
    count: z.coerce.number().int().min(1).max(50).optional().default(10),
});

// ✅ Tipos para tweets
interface TweetAuthor {
    name: string;
    username: string;
    profileImage?: string;
}

interface TweetMetrics {
    retweet_count?: number;
    reply_count?: number;
    like_count?: number;
    quote_count?: number;
}

interface FormattedTweet {
    id: string;
    text: string;
    createdAt: string;
    formattedDate: string;
    author: TweetAuthor | null;
    metrics: TweetMetrics | null;
}

/**
 * GET /api/tweets
 * Obtiene tweets para el carousel
 */
export const GET: APIRoute = async ({ request }) => {
    try {
        // ✅ Rate limiting
        const rateLimitResult = await rateLimitApiGet(request);
        if (!rateLimitResult.success) {
            return secureJsonResponse(
                { error: rateLimitResult.message },
                429,
                rateLimitResult.headers
            );
        }

        // ✅ Parse y validar query params
        const url = new URL(request.url);
        const queryResult = GetTweetsQuerySchema.safeParse({
            type: url.searchParams.get('type'),
            count: url.searchParams.get('count'),
        });

        if (!queryResult.success) {
            return secureJsonResponse(
                {
                    error: 'Parámetros inválidos',
                    details: queryResult.error.issues,
                },
                400
            );
        }

        const { type, count } = queryResult.data;
        const cacheKey = `${CACHE_KEY_PREFIX}_${type}_${count}`;

        // ✅ Intentar obtener del cache
        try {
            const cachedData = await redis.get<FormattedTweet[]>(cacheKey);
            if (cachedData) {
                return secureJsonResponse(
                    cachedData,
                    200,
                    {
                        ...rateLimitResult.headers,
                        'X-Cache': 'HIT',
                    }
                );
            }
        } catch (redisError) {
            console.warn('Redis cache read failed', {
                error: redisError instanceof Error ? redisError.message : 'Unknown',
                cacheKey,
            });
        }

        // ✅ Obtener tweets frescos
        let tweets: any[];
        try {
            if (type === 'whitelist') {
                tweets = await getWhitelistedAccountsTweets(count);
            } else {
                tweets = await getProjectTweets(count);
            }
        } catch (twitterError) {
            console.error('Twitter API failed', {
                error: twitterError instanceof Error ? twitterError.message : 'Unknown',
                type,
                count,
            });

            // Retornar array vacío en vez de error 500
            return secureJsonResponse(
                {
                    error: 'No se pudieron cargar los tweets',
                    tweets: [],
                },
                200 // 200 para no romper el frontend
            );
        }

        // ✅ Formatear tweets
        const formattedTweets: FormattedTweet[] = tweets.map((tweet) => ({
            id: tweet.id || '',
            text: tweet.text || '',
            createdAt: tweet.created_at || '',
            formattedDate: tweet.created_at ? formatTweetDate(tweet.created_at) : '',
            author: tweet.author
                ? {
                    name: tweet.author.name || '',
                    username: tweet.author.username || '',
                    profileImage: tweet.author.profile_image_url,
                }
                : null,
            metrics: tweet.public_metrics || null,
        }));

        // ✅ Guardar en cache
        try {
            await redis.set(cacheKey, formattedTweets, {
                ex: TWEETS_CACHE_TTL,
            });
        } catch (redisError) {
            console.warn('Redis cache write failed', {
                error: redisError instanceof Error ? redisError.message : 'Unknown',
                cacheKey,
            });
        }

        return secureJsonResponse(
            formattedTweets,
            200,
            {
                ...rateLimitResult.headers,
                'X-Cache': 'MISS',
            }
        );

    } catch (error) {
        console.error('GET /api/tweets failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
        });

        return secureJsonResponse(
            {
                error: 'Error interno del servidor',
                tweets: [],
            },
            500
        );
    }
};
