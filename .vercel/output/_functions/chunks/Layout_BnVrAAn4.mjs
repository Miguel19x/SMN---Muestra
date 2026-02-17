import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, u as unescapeHTML, r as renderTemplate, n as renderScript, k as renderComponent, l as Fragment, o as renderSlot, p as renderHead } from './astro/server_CJfq-tyP.mjs';
import 'clsx';
/* empty css                                */

const $$Astro$2 = createAstro();
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Icon;
  const { iconName, alt } = Astro2.props;
  const icons = {
    ListadoSecuestrados: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M20 6v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2zM10 16h6"/><path d="M11 11a2 2 0 1 0 4 0 2 2 0 1 0-4 0M4 8h3M4 12h3M4 16h3"/></svg>`,
    SubirInfo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5 5 5M12 4v12"/></svg>`,
    ListadoFallecidos: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9zM8.5 8.5l7 7M8.5 15.5l7-7"/></svg>`,
    Estadistica: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM15 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 20h14"/></svg>`,
    Info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>`,
    Menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    ListadoSecuestradosMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M20 6v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2zM10 16h6"/><path d="M11 11a2 2 0 1 0 4 0 2 2 0 1 0-4 0M4 8h3M4 12h3M4 16h3"/></svg>`,
    SubirInfoMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5 5 5M12 4v12"/></svg>`,
    ListadoFallecidosMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9zM8.5 8.5l7 7M8.5 15.5l7-7"/></svg>`,
    EstadisticaMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM15 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 20h14"/></svg>`,
    InfoMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>`
  };
  const iconSVG = icons[iconName] || "";
  return renderTemplate`${maybeRenderHead()}<div class="icon flex-shrink-0"${addAttribute(alt, "aria-label")} data-astro-cid-patnjmll>${unescapeHTML(iconSVG)}</div>`;
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/Icon.astro", void 0);

const $$Astro$1 = createAstro();
const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Navbar;
  const currentPath = Astro2.url.pathname;
  const isIndexPage = currentPath === "/";
  const navLinks = [
    {
      href: isIndexPage ? "#motor-busqueda" : "/",
      i18nKey: "Navbar-1",
      label: "Listado de Secuestrados",
      iconDesktop: "ListadoSecuestrados",
      iconMobile: "ListadoSecuestradosMovil",
      showOn: [
        "/",
        "/subir-informacion",
        "/listado-de-fallecidos",
        "/panel-admin",
        "/login",
        "/estadisticas"
      ]
    },
    {
      href: "/subir-informacion",
      i18nKey: "Navbar-2",
      label: "Subir Informaci\xF3n",
      iconDesktop: "SubirInfo",
      iconMobile: "SubirInfoMovil",
      showOn: [
        "/",
        "/listado-de-fallecidos",
        "/panel-admin",
        "/login",
        "/estadisticas"
      ]
    },
    {
      href: "/listado-de-fallecidos",
      i18nKey: "Navbar-3",
      label: "Listado de Fallecidos",
      iconDesktop: "ListadoFallecidos",
      iconMobile: "ListadoFallecidosMovil",
      showOn: [
        "/",
        "/subir-informacion",
        "/panel-admin",
        "/login",
        "/estadisticas"
      ]
    },
    {
      href: "/estadisticas",
      i18nKey: "Navbar-4",
      label: "Estad\xEDsticas",
      iconDesktop: "Estadistica",
      iconMobile: "EstadisticaMovil",
      showOn: [
        "/",
        "/listado-de-fallecidos",
        "/subir-informacion",
        "/panel-admin",
        "/login"
      ]
    }
  ];
  const visibleLinks = navLinks.filter(
    (link) => link.showOn.includes(currentPath)
  );
  return renderTemplate`${maybeRenderHead()}<nav class="fixed top-0 left-0 right-0 z-50 bg-card navbar-shadow theme-transition" data-astro-cid-5knycien> <div class="container mx-auto px-4" data-astro-cid-5knycien> <div class="flex items-center h-16" data-astro-cid-5knycien> <!-- Logo Container --> <div class="flex-1 flex items-center justify-start" data-astro-cid-5knycien> <a href="/" class="font-display text-xl font-bold text-primary whitespace-nowrap" style="font-family: 'Playfair Display', serif;" data-astro-cid-5knycien>
NoMásSecuestros
</a> </div> <!-- Desktop Navigation (Centered) --> <div class="hidden md:flex items-center justify-center space-x-4" data-astro-cid-5knycien> ${visibleLinks.map((link, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-5knycien": true }, { "default": ($$result2) => renderTemplate` <a${addAttribute(link.href, "href")} class="text-foreground/80 hover:text-primary transition-colors duration-300 text-sm font-medium flex items-center nav-icon whitespace-nowrap" data-astro-cid-5knycien> ${renderComponent($$result2, "Icon", $$Icon, { "iconName": link.iconDesktop, "alt": link.label, "data-astro-cid-5knycien": true })} <span${addAttribute(link.i18nKey, "data-i18n")} data-astro-cid-5knycien>${link.label}</span> </a> ${index < visibleLinks.length - 1 && renderTemplate`<span class="text-muted-foreground/50 text-lg font-light select-none" data-astro-cid-5knycien>
|
</span>`}` })}`)} </div> <!-- Right side controls Container --> <div class="flex-1 flex items-center justify-end" data-astro-cid-5knycien> <div class="hidden md:flex items-center space-x-4" data-astro-cid-5knycien> <!-- Language Selector --> <button id="lang-toggle-desktop" class="flex items-center space-x-1 text-sm text-foreground/80 hover:text-primary transition-colors duration-300" aria-label="Change language" data-astro-cid-5knycien> <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <circle cx="12" cy="12" r="10" data-astro-cid-5knycien></circle> <line x1="2" y1="12" x2="22" y2="12" data-astro-cid-5knycien></line> <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" data-astro-cid-5knycien></path> </svg> <span id="lang-text-desktop" class="uppercase font-medium" data-astro-cid-5knycien>ES</span> </button> <!-- Theme Toggle --> <button id="theme-toggle" class="toggle-switch bg-muted" aria-label="Toggle dark mode" data-astro-cid-5knycien> <span id="theme-toggle-thumb" class="toggle-switch-thumb flex items-center justify-center translate-x-1" data-astro-cid-5knycien> <!-- Sun icon (light mode) --> <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <circle cx="12" cy="12" r="5" data-astro-cid-5knycien></circle> <line x1="12" y1="1" x2="12" y2="3" data-astro-cid-5knycien></line> <line x1="12" y1="21" x2="12" y2="23" data-astro-cid-5knycien></line> <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" data-astro-cid-5knycien></line> <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" data-astro-cid-5knycien></line> <line x1="1" y1="12" x2="3" y2="12" data-astro-cid-5knycien></line> <line x1="21" y1="12" x2="23" y2="12" data-astro-cid-5knycien></line> <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" data-astro-cid-5knycien></line> <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" data-astro-cid-5knycien></line> </svg> <!-- Moon icon (dark mode) --> <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-primary hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" data-astro-cid-5knycien></path> </svg> </span> </button> </div> <!-- Mobile Menu Button --> <button id="mobile-menu-button" class="md:hidden p-2 text-foreground" aria-label="Toggle menu" data-astro-cid-5knycien> <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <line x1="3" y1="12" x2="21" y2="12" data-astro-cid-5knycien></line> <line x1="3" y1="6" x2="21" y2="6" data-astro-cid-5knycien></line> <line x1="3" y1="18" x2="21" y2="18" data-astro-cid-5knycien></line> </svg> <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <line x1="18" y1="6" x2="6" y2="18" data-astro-cid-5knycien></line> <line x1="6" y1="6" x2="18" y2="18" data-astro-cid-5knycien></line> </svg> </button> </div> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="md:hidden hidden py-4 border-t border-border fade-in" data-astro-cid-5knycien> <div class="flex flex-col space-y-4" data-astro-cid-5knycien> ${visibleLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="text-foreground/80 hover:text-primary transition-colors duration-300 text-sm font-medium px-2 flex items-center nav-icon-mobile" data-astro-cid-5knycien> ${renderComponent($$result, "Icon", $$Icon, { "iconName": link.iconMobile, "alt": link.label, "data-astro-cid-5knycien": true })} <span${addAttribute(link.i18nKey, "data-i18n")} data-astro-cid-5knycien>${link.label}</span> </a>`)} <div class="flex items-center justify-between px-2 pt-4 border-t border-border" data-astro-cid-5knycien> <!-- Mobile Language Toggle --> <button id="lang-toggle-mobile" class="flex items-center space-x-1 text-sm text-foreground/80" data-astro-cid-5knycien> <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <circle cx="12" cy="12" r="10" data-astro-cid-5knycien></circle> <line x1="2" y1="12" x2="22" y2="12" data-astro-cid-5knycien></line> <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" data-astro-cid-5knycien></path> </svg> <span id="lang-text-mobile" class="uppercase font-medium" data-astro-cid-5knycien>EN</span> </button> <!-- Mobile Theme Toggle --> <button id="mobile-theme-toggle" class="toggle-switch bg-muted" aria-label="Toggle dark mode" data-astro-cid-5knycien> <span id="mobile-theme-toggle-thumb" class="toggle-switch-thumb flex items-center justify-center translate-x-1" data-astro-cid-5knycien> <svg id="mobile-sun-icon" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <circle cx="12" cy="12" r="5" data-astro-cid-5knycien></circle> <line x1="12" y1="1" x2="12" y2="3" data-astro-cid-5knycien></line> <line x1="12" y1="21" x2="12" y2="23" data-astro-cid-5knycien></line> <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" data-astro-cid-5knycien></line> <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" data-astro-cid-5knycien></line> <line x1="1" y1="12" x2="3" y2="12" data-astro-cid-5knycien></line> <line x1="21" y1="12" x2="23" y2="12" data-astro-cid-5knycien></line> <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" data-astro-cid-5knycien></line> <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" data-astro-cid-5knycien></line> </svg> <svg id="mobile-moon-icon" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-primary hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" data-astro-cid-5knycien></path> </svg> </span> </button> </div> </div> </div> </div> </nav> <!-- Spacer for fixed navbar --> <div class="h-16" data-astro-cid-5knycien></div> ${renderScript($$result, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-card border-t border-border py-12 px-4 theme-transition"> <div class="container mx-auto max-w-4xl text-center"> <!-- Tricolor Bar --> <div class="flex justify-center"> <div class="tricolor-bar w-48 sm:w-64 md:w-80"> <div class="tricolor-yellow"></div> <div class="tricolor-blue"></div> <div class="tricolor-red"></div> </div> </div> <!-- Hashtags --> <p class="mt-8 text-sm text-muted-foreground" data-i18n="Hastaghs">
#NoMásSecuestros | #NoMásSecuestrados |
               #LiberenALosPresosPolíticos
</p> <!-- X/Twitter Link --> <div class="mt-6 flex items-center justify-center"> <a href="https://x.com/NoMasSecuestr0s" target="_blank" rel="noopener noreferrer" class="text-foreground/60 hover:text-primary transition-colors duration-300" aria-label="Twitter/X"> <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path> </svg> </a> </div> <!-- Copyright --> <p class="mt-8 text-xs text-muted-foreground/60" data-i18n="Footer">
© 2026 NoMásSecuestros. Esta iniciativa busca crear conciencia
               sobre la situación de los presos políticos en Venezuela.
</p> </div> </footer>`;
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const lang = Astro2.cookies.get("NEXT_LOCALE")?.value || "es";
  return renderTemplate(_a || (_a = __template(["<html", ' class="h-full"> <head><meta charset="UTF-8"><meta name="description" content="P\xE1gina de nombres y apellidos de los secuestrados en Venezuela"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/flag.svg"><title>', "</title>", '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer><\/script><script>\n			if (\n				localStorage.getItem("color-theme") === "dark" ||\n				(!("color-theme" in localStorage) &&\n					window.matchMedia("(prefers-color-scheme: dark)").matches)\n			) {\n				document.documentElement.classList.add("dark");\n			} else {\n				document.documentElement.classList.remove("dark");\n			}\n		<\/script><script>\n			(function () {\n				var translations = {\n					es: {\n						"Title-2": "LISTADO DE FALLECIDOS",\n						Phrase: "\xA1Sus nombres jam\xE1s deben ser olvidados!",\n						"Navbar-1": "Listado de Secuestrados",\n						"Navbar-2": "Subir Informaci\xF3n",\n						"Navbar-3": "Listado de Fallecidos",\n						"Navbar-4": "Estad\xEDsticas",\n						"Title-1": "NO M\xC1S SECUESTROS",\n						"Title-1.3": "#NOM\xC1SSECUESTRADOS",\n						"Title-3": "Subir Informaci\xF3n del Secuestrado",\n						"Component-1": "Buscar Detenidos",\n						"Component-2": "Listado de Personas Secuestradas",\n					},\n					en: {\n						"Title-2": "LIST OF DECEASED",\n						Phrase: "Their names must never be forgotten!",\n						"Navbar-1": "List of Kidnapped People",\n						"Navbar-2": "Upload Information",\n						"Navbar-3": "List of Deceased People",\n						"Navbar-4": "Statistics",\n						"Title-1": "NO MORE KIDNAPPINGS",\n						"Title-1.3": "#NOMOREKIDNAPPEDPEOPLE",\n						"Title-3":\n							"Upload Information about the kidnapped person",\n						"Component-1": "Search Detainees",\n						"Component-2": "List of Abductees",\n					},\n				};\n				function getCookie(n) {\n					var m = document.cookie.match(\n						new RegExp("(^| )" + n + "=([^;]+)"),\n					);\n					return m ? m[2] : null;\n				}\n				var lang =\n					localStorage.getItem("language") ||\n					getCookie("NEXT_LOCALE") ||\n					document.documentElement.lang ||\n					"es";\n				if (lang !== "es" && lang !== "en") lang = "es";\n				document.documentElement.lang = lang;\n				function apply() {\n					var t = translations[lang];\n					if (!t) return;\n					document\n						.querySelectorAll("[data-i18n]")\n						.forEach(function (el) {\n							var k = el.getAttribute("data-i18n");\n							if (k && t[k]) el.innerHTML = t[k];\n						});\n				}\n				if (document.readyState === "loading") {\n					document.addEventListener("DOMContentLoaded", apply);\n				} else {\n					apply();\n				}\n				document.addEventListener("astro:page-load", apply);\n			})();\n		<\/script>', '</head> <body class="flex flex-col min-h-full bg-background text-foreground theme-transition"> ', ' <main class="flex-grow"> ', " </main> ", " </body></html>"])), addAttribute(lang, "lang"), title, renderScript($$result, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"), renderHead(), renderComponent($$result, "Navbar", $$Navbar, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
