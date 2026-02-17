/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_CLOUDFLARE_SITE_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
}

declare module 'jsonwebtoken' {
  import { SignOptions, VerifyOptions } from 'jsonwebtoken';

  export function sign(payload: any, secret: string | Buffer, options?: SignOptions): string;
  export function verify(token: string, secret: string | Buffer, options?: VerifyOptions): any;
  export function decode(token: string, options?: { json?: boolean }): any;

}