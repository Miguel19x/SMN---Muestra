/**
 * Cliente de Twitter API v2
 * 
 * Utiliza el Bearer Token del Developer Portal para acceder a tweets públicos.
 */

// @ts-ignore - process.env está disponible en el servidor
const TWITTER_BEARER_TOKEN = process.env.BEARER_TOKEN;
const TWITTER_API_BASE = 'https://api.twitter.com/2';

// Username de la cuenta del proyecto
const PROJECT_ACCOUNT = 'NoMasSecuestr0s';

/**
 * Whitelist de cuentas asociadas a la iniciativa
 * Añadir usernames aquí para mostrar en el carrusel
 */
export const whitelistedAccounts: string[] = [
    'NoMasSecuestr0s',
    // Añadir más cuentas aquí:
    // 'CuentaAsociada1',
    // 'CuentaAsociada2',
];

interface Tweet {
    id: string;
    text: string;
    created_at?: string;
    author_id?: string;
    public_metrics?: {
        retweet_count: number;
        reply_count: number;
        like_count: number;
        quote_count: number;
    };
}

interface TwitterUser {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
}

interface TweetWithAuthor extends Tweet {
    author?: TwitterUser;
}

/**
 * Realiza una petición autenticada a la API de Twitter
 */
async function twitterFetch(endpoint: string): Promise<Response> {
    if (!TWITTER_BEARER_TOKEN) {
        console.warn('⚠️ BEARER_TOKEN no está configurado. La integración de Twitter no funcionará.');
        // Retornar una respuesta vacía en lugar de lanzar error
        return new Response(JSON.stringify({ data: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const response = await fetch(`${TWITTER_API_BASE}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    return response;
}

/**
 * Obtiene el ID de usuario de Twitter por username
 */
export async function getUserId(username: string): Promise<string | null> {
    try {
        const response = await twitterFetch(`/users/by/username/${username}`);

        if (!response.ok) {
            console.error('Error getting user ID:', await response.text());
            return null;
        }

        const data = await response.json();
        return data.data?.id || null;
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return null;
    }
}

/**
 * Obtiene los tweets recientes de una cuenta
 * @param username - Username de la cuenta
 * @param count - Número de tweets a obtener (máx 100)
 */
export async function getAccountTweets(username: string, count: number = 10): Promise<TweetWithAuthor[]> {
    try {
        const userId = await getUserId(username);
        if (!userId) {
            return [];
        }

        const params = new URLSearchParams({
            'max_results': Math.min(count, 100).toString(),
            'tweet.fields': 'created_at,public_metrics,author_id',
            'expansions': 'author_id',
            'user.fields': 'name,username,profile_image_url',
        });

        const response = await twitterFetch(`/users/${userId}/tweets?${params}`);

        if (!response.ok) {
            console.error('Error getting tweets:', await response.text());
            return [];
        }

        const data = await response.json();
        const tweets: Tweet[] = data.data || [];
        const users: TwitterUser[] = data.includes?.users || [];

        // Asociar autores a tweets
        return tweets.map(tweet => ({
            ...tweet,
            author: users.find(u => u.id === tweet.author_id),
        }));
    } catch (error) {
        console.error('Error fetching account tweets:', error);
        return [];
    }
}

/**
 * Obtiene los tweets recientes de la cuenta del proyecto
 */
export async function getProjectTweets(count: number = 10): Promise<TweetWithAuthor[]> {
    return getAccountTweets(PROJECT_ACCOUNT, count);
}

/**
 * Busca tweets por hashtag
 * @param hashtag - Hashtag a buscar (sin el #)
 * @param count - Número de tweets
 */
export async function searchTweetsByHashtag(hashtag: string, count: number = 10): Promise<TweetWithAuthor[]> {
    try {
        const params = new URLSearchParams({
            'query': `#${hashtag} -is:retweet`,
            'max_results': Math.min(count, 100).toString(),
            'tweet.fields': 'created_at,public_metrics,author_id',
            'expansions': 'author_id',
            'user.fields': 'name,username,profile_image_url',
        });

        const response = await twitterFetch(`/tweets/search/recent?${params}`);

        if (!response.ok) {
            console.error('Error searching tweets:', await response.text());
            return [];
        }

        const data = await response.json();
        const tweets: Tweet[] = data.data || [];
        const users: TwitterUser[] = data.includes?.users || [];

        return tweets.map(tweet => ({
            ...tweet,
            author: users.find(u => u.id === tweet.author_id),
        }));
    } catch (error) {
        console.error('Error searching tweets:', error);
        return [];
    }
}

/**
 * Obtiene tweets de todas las cuentas en la whitelist
 * @param tweetsPerAccount - Número de tweets por cuenta
 */
export async function getWhitelistedAccountsTweets(tweetsPerAccount: number = 5): Promise<TweetWithAuthor[]> {
    const allTweets: TweetWithAuthor[] = [];

    for (const account of whitelistedAccounts) {
        const tweets = await getAccountTweets(account, tweetsPerAccount);
        allTweets.push(...tweets);
    }

    // Ordenar por fecha más reciente
    allTweets.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });

    return allTweets;
}

/**
 * Formatea la fecha de un tweet para mostrar
 */
export function formatTweetDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
        return `${diffMins}m`;
    } else if (diffHours < 24) {
        return `${diffHours}h`;
    } else if (diffDays < 7) {
        return `${diffDays}d`;
    } else {
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
}
