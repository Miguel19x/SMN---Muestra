import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as Fragment } from '../chunks/astro/server_CJfq-tyP.mjs';
import { $ as $$Layout } from '../chunks/Layout_BnVrAAn4.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
/* empty css                                        */
export { renderers } from '../renderers.mjs';

function Component() {
  const blocks = [
    { date: "28/7/2024", name: "Julio Valerio García", age: 40 },
    { date: "29/7/2024", name: "Jesús Tovar", age: 21 },
    { date: "29/7/2024", name: "Jhon A. Graterol M.", age: 19 },
    { date: "29/7/2024", name: "Isaías Fuenmayor", age: 15 },
    { date: "29/7/2024", name: "Olinger Montaño", age: 23 },
    { date: "29/7/2024", name: "Antoni Cañizález", age: 19 },
    { date: "29/7/2024", name: "Jeison J. Bracho M.", age: 22 },
    { date: "29/7/2024", name: "Rances Izarra", age: 30 },
    { date: "29/7/2024", name: "Carlos Porras", age: 26 },
    { date: "29/7/2024", name: "Jesús R. Medina P.", age: 56 },
    { date: "29/7/2024", name: "Gustavo Rojas", age: 29 },
    { date: "29/7/2024", name: "José A. Torres", age: "ND" },
    { date: "29/7/2024", name: "Antonhy D. Moya M.", age: 24 },
    { date: "29/7/2024", name: "Jeison G. España G.", age: 18 },
    { date: "29/7/2024", name: "Eurisjunior Mendoza", age: 24 },
    { date: "29/7/2024", name: "Edgar A. Aristeguieta", age: 42 },
    { date: "29/7/2024", name: "Anibal J. Romero S.", age: 26 },
    { date: "29/7/2024", name: "Dorian Rondón", age: 22 },
    { date: "30/7/2024", name: "Victor Bustos", age: 34 },
    { date: "30/7/2024", name: "Yorgenis E. Leyva M.", age: 35 },
    { date: "31/7/2024", name: "Luis E. Roberto H.", age: 19 },
    { date: "02/8/2024", name: "Gabriel Ramos", age: 33 },
    { date: "04/8/2024", name: "Walter Páez Lucena", age: 29 },
    { date: "21/8/2024", name: "Andrés Ramírez", age: 36 }
  ];
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: blocks.map((block, index) => /* @__PURE__ */ jsx(
    "div",
    {
      className: "bg-slate-100 dark:bg-gray-800 shadow-lg rounded-2xl border border-transparent hover:border-gray-300/50 transition-all duration-300 ease-in-out hover:scale-105 p-6",
      children: /* @__PURE__ */ jsxs("p", { className: "text-base font-semibold lg:text-lg text-gray-800 dark:text-gray-200 text-center", children: [
        block.date,
        " ",
        block.name,
        " (",
        block.age,
        ")"
      ] })
    },
    index
  )) }) });
}

const $$ListadoDeFallecidos = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Listado de Fallecidos" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen relative"> <!-- Background image with chains --> <div class="absolute inset-0 bg-cover bg-center bg-fixed" style="background-image: url('/NO MAS SECUESTROS FONDO PRUEBA 3.jpg');"></div> <!-- Dark overlay gradient for readability --> <div class="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/90 to-slate-950/95"></div> <!-- Content layer --> <div class="relative z-10"> <!-- Header Section --> <header class="py-12 lg:py-16 text-center px-4"> <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 drop-shadow-lg" style="font-family: 'Playfair Display', serif;" data-i18n="Title-2">
LISTADO DE FALLECIDOS
</h1> <!-- Stars --> <div class="flex justify-center gap-1 mb-4"> ${[...Array(7)].map((_) => renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"> ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"></path> ` })} </svg>`)} </div> <!-- Tricolor bar --> <div class="flex justify-center"> <div class="tricolor-bar w-48 sm:w-64 md:w-80"> <div class="tricolor-yellow"></div> <div class="tricolor-blue"></div> <div class="tricolor-red"></div> </div> </div> <p class="mt-4 sm:mt-6 text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium px-4 sm:px-0" data-i18n="Phrase-2" style="font-family: 'Inter', sans-serif;">
¡Sus nombres jamás deben ser olvidados!
</p> </header> <!-- Cards Grid --> <main class="container mx-auto px-4 pb-12"> ${renderComponent($$result2, "ListadoFallecidos", Component, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/Listado.tsx", "client:component-export": "default" })} </main> </div> </div> ` })}`;
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/pages/listado-de-fallecidos.astro", void 0);

const $$file = "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/pages/listado-de-fallecidos.astro";
const $$url = "/listado-de-fallecidos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ListadoDeFallecidos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
