import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BS5WoYhy.mjs';
import { manifest } from './manifest_Wy7uu9y2.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/setup-2fa.astro.mjs');
const _page2 = () => import('./pages/api/auth/verify-2fa.astro.mjs');
const _page3 = () => import('./pages/api/cache-image.astro.mjs');
const _page4 = () => import('./pages/api/delete-image.astro.mjs');
const _page5 = () => import('./pages/api/health.astro.mjs');
const _page6 = () => import('./pages/api/image/_key_.astro.mjs');
const _page7 = () => import('./pages/api/inventario/_id_/accept.astro.mjs');
const _page8 = () => import('./pages/api/inventario/_id_/reject.astro.mjs');
const _page9 = () => import('./pages/api/inventario/_id_/restore.astro.mjs');
const _page10 = () => import('./pages/api/inventario/_id_.astro.mjs');
const _page11 = () => import('./pages/api/inventario.astro.mjs');
const _page12 = () => import('./pages/api/removal-requests.astro.mjs');
const _page13 = () => import('./pages/api/tweets.astro.mjs');
const _page14 = () => import('./pages/api/upload-image.astro.mjs');
const _page15 = () => import('./pages/archivados.astro.mjs');
const _page16 = () => import('./pages/auth/login.astro.mjs');
const _page17 = () => import('./pages/auth/logout.astro.mjs');
const _page18 = () => import('./pages/auth/protected.astro.mjs');
const _page19 = () => import('./pages/estadisticas.astro.mjs');
const _page20 = () => import('./pages/login.astro.mjs');
const _page21 = () => import('./pages/panel-admin.astro.mjs');
const _page22 = () => import('./pages/sitemap.xml.astro.mjs');
const _page23 = () => import('./pages/subir-informacion.astro.mjs');
const _page24 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.17.2_@types+node@25_4c071e1b37e1e75a0b37b02a3d85df56/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/setup-2fa.js", _page1],
    ["src/pages/api/auth/verify-2fa.js", _page2],
    ["src/pages/api/cache-image.ts", _page3],
    ["src/pages/api/delete-image.ts", _page4],
    ["src/pages/api/health.ts", _page5],
    ["src/pages/api/image/[key].ts", _page6],
    ["src/pages/api/inventario/[id]/accept.ts", _page7],
    ["src/pages/api/inventario/[id]/reject.ts", _page8],
    ["src/pages/api/inventario/[id]/restore.ts", _page9],
    ["src/pages/api/inventario/[id].ts", _page10],
    ["src/pages/api/inventario.ts", _page11],
    ["src/pages/api/removal-requests.ts", _page12],
    ["src/pages/api/tweets.ts", _page13],
    ["src/pages/api/upload-image.ts", _page14],
    ["src/pages/archivados.astro", _page15],
    ["src/pages/auth/login.js", _page16],
    ["src/pages/auth/logout.js", _page17],
    ["src/pages/auth/protected.js", _page18],
    ["src/pages/estadisticas.astro", _page19],
    ["src/pages/login.astro", _page20],
    ["src/pages/panel-admin.astro", _page21],
    ["src/pages/sitemap.xml.ts", _page22],
    ["src/pages/subir-informacion.astro", _page23],
    ["src/pages/index.astro", _page24]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "3b1d5c39-50e8-40eb-95f2-a1dbb99d01f5",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
