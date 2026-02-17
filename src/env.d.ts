/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly BEARER_TOKEN: string;
    readonly MONGODB_URL: string;
    readonly R2_ACCOUNT_ID: string;
    readonly R2_ACCESS_KEY_ID: string;
    readonly R2_SECRET_ACCESS_KEY: string;
    readonly R2_BUCKET_NAME: string;
    readonly UPSTASH_REDIS_REST_URL: string;
    readonly UPSTASH_REDIS_REST_TOKEN: string;
    readonly CLOUDFLARE_TURNSTILE_SECRET_KEY: string;
    readonly SECRET_JWT_KEY: string;
    readonly PUBLIC_APP_TOKEN: string;
    readonly PUBLIC_CLOUDFLARE_SITE_KEY: string;
    readonly NODE_ENV: 'development' | 'production';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
