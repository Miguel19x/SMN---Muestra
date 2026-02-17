import { z } from 'zod';
import { r as redis } from '../../chunks/redis_CYcAgJqj.mjs';
import { s as secureJsonResponse } from '../../chunks/securityHeaders_B-pWwsKs.mjs';
import { r as rateLimitApiGet } from '../../chunks/bruteForceProtection_Bg_DvZdH.mjs';
import '../../chunks/app.config_BO63yO4S.mjs';
export { renderers } from '../../renderers.mjs';

const TWITTER_BEARER_TOKEN = process.env.BEARER_TOKEN;
const TWITTER_API_BASE = "https://api.twitter.com/2";
const PROJECT_ACCOUNT = "NoMasSecuestr0s";
const whitelistedAccounts = [
  "NoMasSecuestr0s"
  // Añadir más cuentas aquí:
  // 'CuentaAsociada1',
  // 'CuentaAsociada2',
];
async function twitterFetch(endpoint) {
  if (!TWITTER_BEARER_TOKEN) {
    console.warn("⚠️ BEARER_TOKEN no está configurado. La integración de Twitter no funcionará.");
    return new Response(JSON.stringify({ data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  const response = await fetch(`${TWITTER_API_BASE}${endpoint}`, {
    headers: {
      "Authorization": `Bearer ${TWITTER_BEARER_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
  return response;
}
async function getUserId(username) {
  try {
    const response = await twitterFetch(`/users/by/username/${username}`);
    if (!response.ok) {
      console.error("Error getting user ID:", await response.text());
      return null;
    }
    const data = await response.json();
    return data.data?.id || null;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
}
async function getAccountTweets(username, count = 10) {
  try {
    const userId = await getUserId(username);
    if (!userId) {
      return [];
    }
    const params = new URLSearchParams({
      "max_results": Math.min(count, 100).toString(),
      "tweet.fields": "created_at,public_metrics,author_id",
      "expansions": "author_id",
      "user.fields": "name,username,profile_image_url"
    });
    const response = await twitterFetch(`/users/${userId}/tweets?${params}`);
    if (!response.ok) {
      console.error("Error getting tweets:", await response.text());
      return [];
    }
    const data = await response.json();
    const tweets = data.data || [];
    const users = data.includes?.users || [];
    return tweets.map((tweet) => ({
      ...tweet,
      author: users.find((u) => u.id === tweet.author_id)
    }));
  } catch (error) {
    console.error("Error fetching account tweets:", error);
    return [];
  }
}
async function getProjectTweets(count = 10) {
  return getAccountTweets(PROJECT_ACCOUNT, count);
}
async function getWhitelistedAccountsTweets(tweetsPerAccount = 5) {
  const allTweets = [];
  for (const account of whitelistedAccounts) {
    const tweets = await getAccountTweets(account, tweetsPerAccount);
    allTweets.push(...tweets);
  }
  allTweets.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
  return allTweets;
}
function formatTweetDate(dateString) {
  const date = new Date(dateString);
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1e3 * 60));
  const diffHours = Math.floor(diffMs / (1e3 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
  if (diffMins < 60) {
    return `${diffMins}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else if (diffDays < 7) {
    return `${diffDays}d`;
  } else {
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  }
}

const TWEETS_CACHE_TTL = 900;
const CACHE_KEY_PREFIX = "twitter_carousel_tweets";
const GetTweetsQuerySchema = z.object({
  type: z.enum(["project", "whitelist"]).optional().default("project"),
  count: z.coerce.number().int().min(1).max(50).optional().default(10)
});
const GET = async ({ request }) => {
  try {
    const rateLimitResult = await rateLimitApiGet(request);
    if (!rateLimitResult.success) {
      return secureJsonResponse(
        { error: rateLimitResult.message },
        429,
        rateLimitResult.headers
      );
    }
    const url = new URL(request.url);
    const queryResult = GetTweetsQuerySchema.safeParse({
      type: url.searchParams.get("type"),
      count: url.searchParams.get("count")
    });
    if (!queryResult.success) {
      return secureJsonResponse(
        {
          error: "Parámetros inválidos",
          details: queryResult.error.format()
        },
        400
      );
    }
    const { type, count } = queryResult.data;
    const cacheKey = `${CACHE_KEY_PREFIX}_${type}_${count}`;
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return secureJsonResponse(
          cachedData,
          200,
          {
            ...rateLimitResult.headers,
            "X-Cache": "HIT"
          }
        );
      }
    } catch (redisError) {
      console.warn("Redis cache read failed", {
        error: redisError instanceof Error ? redisError.message : "Unknown",
        cacheKey
      });
    }
    let tweets;
    try {
      if (type === "whitelist") {
        tweets = await getWhitelistedAccountsTweets(count);
      } else {
        tweets = await getProjectTweets(count);
      }
    } catch (twitterError) {
      console.error("Twitter API failed", {
        error: twitterError instanceof Error ? twitterError.message : "Unknown",
        type,
        count
      });
      return secureJsonResponse(
        {
          error: "No se pudieron cargar los tweets",
          tweets: []
        },
        200
        // 200 para no romper el frontend
      );
    }
    const formattedTweets = tweets.map((tweet) => ({
      id: tweet.id || "",
      text: tweet.text || "",
      createdAt: tweet.created_at || "",
      formattedDate: tweet.created_at ? formatTweetDate(tweet.created_at) : "",
      author: tweet.author ? {
        name: tweet.author.name || "",
        username: tweet.author.username || "",
        profileImage: tweet.author.profile_image_url
      } : null,
      metrics: tweet.public_metrics || null
    }));
    try {
      await redis.set(cacheKey, formattedTweets, {
        ex: TWEETS_CACHE_TTL
      });
    } catch (redisError) {
      console.warn("Redis cache write failed", {
        error: redisError instanceof Error ? redisError.message : "Unknown",
        cacheKey
      });
    }
    return secureJsonResponse(
      formattedTweets,
      200,
      {
        ...rateLimitResult.headers,
        "X-Cache": "MISS"
      }
    );
  } catch (error) {
    console.error("GET /api/tweets failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return secureJsonResponse(
      {
        error: "Error interno del servidor",
        tweets: []
      },
      500
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
