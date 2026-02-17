import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CpX4dWK_.mjs';
import { manifest } from './manifest_DB-gWa9r.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/setup-2fa.astro.mjs');
const _page2 = () => import('./pages/api/auth/verify-2fa.astro.mjs');
const _page3 = () => import('./pages/api/cache-image.astro.mjs');
const _page4 = () => import('./pages/api/delete-image.astro.mjs');
const _page5 = () => import('./pages/api/desaparecidos/_id_/accept.astro.mjs');
const _page6 = () => import('./pages/api/desaparecidos/_id_/reject.astro.mjs');
const _page7 = () => import('./pages/api/desaparecidos/_id_.astro.mjs');
const _page8 = () => import('./pages/api/desaparecidos.astro.mjs');
const _page9 = () => import('./pages/api/health.astro.mjs');
const _page10 = () => import('./pages/api/image/_key_.astro.mjs');
const _page11 = () => import('./pages/api/removal-requests.astro.mjs');
const _page12 = () => import('./pages/api/tweets.astro.mjs');
const _page13 = () => import('./pages/api/upload-image.astro.mjs');
const _page14 = () => import('./pages/auth/login.astro.mjs');
const _page15 = () => import('./pages/auth/logout.astro.mjs');
const _page16 = () => import('./pages/auth/protected.astro.mjs');
const _page17 = () => import('./pages/estadisticas.astro.mjs');
const _page18 = () => import('./pages/listado-de-fallecidos.astro.mjs');
const _page19 = () => import('./pages/login.astro.mjs');
const _page20 = () => import('./pages/panel-admin.astro.mjs');
const _page21 = () => import('./pages/sitemap.xml.astro.mjs');
const _page22 = () => import('./pages/subir-informacion.astro.mjs');
const _page23 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.16.6_@types+node@25_09235279f27b81a37c2488ceb9bd230a/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/setup-2fa.js", _page1],
    ["src/pages/api/auth/verify-2fa.js", _page2],
    ["src/pages/api/cache-image.js", _page3],
    ["src/pages/api/delete-image.js", _page4],
    ["src/pages/api/desaparecidos/[id]/accept.js", _page5],
    ["src/pages/api/desaparecidos/[id]/reject.js", _page6],
    ["src/pages/api/desaparecidos/[id].js", _page7],
    ["src/pages/api/desaparecidos.js", _page8],
    ["src/pages/api/health.ts", _page9],
    ["src/pages/api/image/[key].js", _page10],
    ["src/pages/api/removal-requests.js", _page11],
    ["src/pages/api/tweets.js", _page12],
    ["src/pages/api/upload-image.js", _page13],
    ["src/pages/auth/login.js", _page14],
    ["src/pages/auth/logout.js", _page15],
    ["src/pages/auth/protected.js", _page16],
    ["src/pages/estadisticas.astro", _page17],
    ["src/pages/listado-de-fallecidos.astro", _page18],
    ["src/pages/login.astro", _page19],
    ["src/pages/panel-admin.astro", _page20],
    ["src/pages/sitemap.xml.ts", _page21],
    ["src/pages/subir-informacion.astro", _page22],
    ["src/pages/index.astro", _page23]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "efd8ba67-046d-45d7-b02c-2ef3ca05c0d5",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
