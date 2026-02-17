import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, u as unescapeHTML, r as renderTemplate, l as renderScript, k as renderComponent, n as Fragment, o as renderSlot, p as renderHead } from './astro/server_D0FKrmaD.mjs';
import 'clsx';
/* empty css                              */
import { jsx } from 'react/jsx-runtime';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const $$Astro$3 = createAstro();
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Icon;
  const { iconName, alt } = Astro2.props;
  const icons = {
    InventarioActivo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M20 6v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2zM10 16h6"/><path d="M11 11a2 2 0 1 0 4 0 2 2 0 1 0-4 0M4 8h3M4 12h3M4 16h3"/></svg>`,
    SubirInfo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5 5 5M12 4v12"/></svg>`,
    Archivados: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9zM8.5 8.5l7 7M8.5 15.5l7-7"/></svg>`,
    Estadistica: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM15 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 20h14"/></svg>`,
    Info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>`,
    Menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    InventarioActivoMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M20 6v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2zM10 16h6"/><path d="M11 11a2 2 0 1 0 4 0 2 2 0 1 0-4 0M4 8h3M4 12h3M4 16h3"/></svg>`,
    SubirInfoMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5 5 5M12 4v12"/></svg>`,
    ArchivadosMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9zM8.5 8.5l7 7M8.5 15.5l7-7"/></svg>`,
    EstadisticaMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM15 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 20h14"/></svg>`,
    InfoMovil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>`
  };
  const iconSVG = icons[iconName] || "";
  return renderTemplate`${maybeRenderHead()}<div class="icon flex-shrink-0"${addAttribute(alt, "aria-label")} data-astro-cid-patnjmll>${unescapeHTML(iconSVG)}</div>`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/Icon.astro", void 0);

const $$Astro$2 = createAstro();
const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Navbar;
  const currentPath = Astro2.url.pathname;
  const isIndexPage = currentPath === "/";
  const navLinks = [
    {
      href: isIndexPage ? "#motor-busqueda" : "/",
      i18nKey: "Navbar-1",
      label: "Inventario Activo",
      iconDesktop: "InventarioActivo",
      iconMobile: "InventarioActivoMovil",
      showOn: [
        "/",
        "/subir-informacion",
        "/archivados",
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
      showOn: ["/", "/archivados", "/panel-admin", "/login", "/estadisticas"]
    },
    {
      href: "/archivados",
      i18nKey: "Navbar-3",
      label: "Archivados",
      iconDesktop: "Archivados",
      iconMobile: "ArchivadosMovil",
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
        "/archivados",
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
DataTracker
</a> </div> <!-- Desktop Navigation (Centered) --> <div class="hidden md:flex items-center justify-center space-x-4" data-astro-cid-5knycien> ${visibleLinks.map((link, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-5knycien": true }, { "default": ($$result2) => renderTemplate` <a${addAttribute(link.href, "href")} class="text-foreground/80 hover:text-primary transition-colors duration-300 text-sm font-medium flex items-center nav-icon whitespace-nowrap" data-astro-cid-5knycien> ${renderComponent($$result2, "Icon", $$Icon, { "iconName": link.iconDesktop, "alt": link.label, "data-astro-cid-5knycien": true })} <span${addAttribute(link.i18nKey, "data-i18n")} data-astro-cid-5knycien>${link.label}</span> </a> ${index < visibleLinks.length - 1 && renderTemplate`<span class="text-muted-foreground/50 text-lg font-light select-none" data-astro-cid-5knycien>
|
</span>`}` })}`)} </div> <!-- Right side controls Container --> <div class="flex-1 flex items-center justify-end" data-astro-cid-5knycien> <div class="hidden md:flex items-center space-x-4" data-astro-cid-5knycien> <!-- Language Selector --> <button id="lang-toggle-desktop" class="flex items-center space-x-1 text-sm text-foreground/80 hover:text-primary transition-colors duration-300" aria-label="Change language" data-astro-cid-5knycien> <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <circle cx="12" cy="12" r="10" data-astro-cid-5knycien></circle> <line x1="2" y1="12" x2="22" y2="12" data-astro-cid-5knycien></line> <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" data-astro-cid-5knycien></path> </svg> <span id="lang-text-desktop" class="uppercase font-medium" data-astro-cid-5knycien>ES</span> </button> <!-- Theme Toggle --> <button id="theme-toggle" class="toggle-switch bg-muted" aria-label="Toggle dark mode" data-astro-cid-5knycien> <span id="theme-toggle-thumb" class="toggle-switch-thumb flex items-center justify-center translate-x-1" data-astro-cid-5knycien> <!-- Sun icon (light mode) --> <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <circle cx="12" cy="12" r="5" data-astro-cid-5knycien></circle> <line x1="12" y1="1" x2="12" y2="3" data-astro-cid-5knycien></line> <line x1="12" y1="21" x2="12" y2="23" data-astro-cid-5knycien></line> <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" data-astro-cid-5knycien></line> <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" data-astro-cid-5knycien></line> <line x1="1" y1="12" x2="3" y2="12" data-astro-cid-5knycien></line> <line x1="21" y1="12" x2="23" y2="12" data-astro-cid-5knycien></line> <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" data-astro-cid-5knycien></line> <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" data-astro-cid-5knycien></line> </svg> <!-- Moon icon (dark mode) --> <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-primary hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" data-astro-cid-5knycien></path> </svg> </span> </button> </div> <!-- Mobile Menu Button --> <button id="mobile-menu-button" class="md:hidden p-2 text-foreground" aria-label="Toggle menu" data-astro-cid-5knycien> <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <line x1="3" y1="12" x2="21" y2="12" data-astro-cid-5knycien></line> <line x1="3" y1="6" x2="21" y2="6" data-astro-cid-5knycien></line> <line x1="3" y1="18" x2="21" y2="18" data-astro-cid-5knycien></line> </svg> <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <line x1="18" y1="6" x2="6" y2="18" data-astro-cid-5knycien></line> <line x1="6" y1="6" x2="18" y2="18" data-astro-cid-5knycien></line> </svg> </button> </div> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="md:hidden hidden py-4 border-t border-border fade-in" data-astro-cid-5knycien> <div class="flex flex-col space-y-4" data-astro-cid-5knycien> ${visibleLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="text-foreground/80 hover:text-primary transition-colors duration-300 text-sm font-medium px-2 flex items-center nav-icon-mobile" data-astro-cid-5knycien> ${renderComponent($$result, "Icon", $$Icon, { "iconName": link.iconMobile, "alt": link.label, "data-astro-cid-5knycien": true })} <span${addAttribute(link.i18nKey, "data-i18n")} data-astro-cid-5knycien>${link.label}</span> </a>`)} <div class="flex items-center justify-between px-2 pt-4 border-t border-border" data-astro-cid-5knycien> <!-- Mobile Language Toggle --> <button id="lang-toggle-mobile" class="flex items-center space-x-1 text-sm text-foreground/80" data-astro-cid-5knycien> <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <circle cx="12" cy="12" r="10" data-astro-cid-5knycien></circle> <line x1="2" y1="12" x2="22" y2="12" data-astro-cid-5knycien></line> <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" data-astro-cid-5knycien></path> </svg> <span id="lang-text-mobile" class="uppercase font-medium" data-astro-cid-5knycien>EN</span> </button> <!-- Mobile Theme Toggle --> <button id="mobile-theme-toggle" class="toggle-switch bg-muted" aria-label="Toggle dark mode" data-astro-cid-5knycien> <span id="mobile-theme-toggle-thumb" class="toggle-switch-thumb flex items-center justify-center translate-x-1" data-astro-cid-5knycien> <svg id="mobile-sun-icon" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <circle cx="12" cy="12" r="5" data-astro-cid-5knycien></circle> <line x1="12" y1="1" x2="12" y2="3" data-astro-cid-5knycien></line> <line x1="12" y1="21" x2="12" y2="23" data-astro-cid-5knycien></line> <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" data-astro-cid-5knycien></line> <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" data-astro-cid-5knycien></line> <line x1="1" y1="12" x2="3" y2="12" data-astro-cid-5knycien></line> <line x1="21" y1="12" x2="23" y2="12" data-astro-cid-5knycien></line> <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" data-astro-cid-5knycien></line> <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" data-astro-cid-5knycien></line> </svg> <svg id="mobile-moon-icon" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-primary hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-5knycien> <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" data-astro-cid-5knycien></path> </svg> </span> </button> </div> </div> </div> </div> </nav> <!-- Spacer for fixed navbar --> <div class="h-16" data-astro-cid-5knycien></div> ${renderScript($$result, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/navbar.astro", void 0);

const $$Astro$1 = createAstro();
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead()}<footer class="bg-card border-t border-border py-12 px-4 theme-transition"> <div class="container mx-auto max-w-4xl text-center"> <!-- Accent Bar --> <div class="flex justify-center mb-6"> <div class="accent-bar w-40 sm:w-56 md:w-72"></div> </div> <!-- Tech Stack Tagline --> <p class="mt-6 text-sm text-muted-foreground">
Built with Astro · React · MongoDB · TailwindCSS
</p> <!-- Copyright --> <p class="mt-4 text-xs text-muted-foreground/70">
© 2026 DataTracker Demo. Portfolio project.
</p> </div> </footer>`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/footer.astro", void 0);

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
  return renderTemplate(_a || (_a = __template(["<html", ' class="h-full"> <head><meta charset="UTF-8"><meta name="description" content="Sistema de gesti\xF3n de inventario de objetos en Venezuela"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/flag.svg"><title>', "</title>", '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer><\/script><script>\n			if (\n				localStorage.getItem("color-theme") === "dark" ||\n				(!("color-theme" in localStorage) &&\n					window.matchMedia("(prefers-color-scheme: dark)").matches)\n			) {\n				document.documentElement.classList.add("dark");\n			} else {\n				document.documentElement.classList.remove("dark");\n			}\n		<\/script><script>\n			(function () {\n				var translations = {\n					es: {\n						"Title-2": "LISTADO DE FALLECIDOS",\n						Phrase: "\xA1Sus nombres jam\xE1s deben ser olvidados!",\n						"Navbar-1": "Inventario Activo",\n						"Navbar-2": "Subir Informaci\xF3n",\n						"Navbar-3": "Archivados",\n						"Navbar-4": "Estad\xEDsticas",\n						"Title-1": "DATATRACKER",\n						"Title-1.3": "#INVENTARIO",\n						"Title-3": "Registrar Nuevo Objeto",\n						"Component-1": "Buscar Registros",\n						"Component-2": "Listado de Objetos Registrados",\n					},\n					en: {\n						"Title-2": "LIST OF DECEASED",\n						Phrase: "Their names must never be forgotten!",\n						"Navbar-1": "List of Kidnapped People",\n						"Navbar-2": "Upload Information",\n						"Navbar-3": "List of Deceased People",\n						"Navbar-4": "Statistics",\n						"Title-1": "NO MORE KIDNAPPINGS",\n						"Title-1.3": "#NOMOREKIDNAPPEDPEOPLE",\n						"Title-3":\n							"Upload Information about the kidnapped person",\n						"Component-1": "Search Detainees",\n						"Component-2": "List of Abductees",\n					},\n				};\n				function getCookie(n) {\n					var m = document.cookie.match(\n						new RegExp("(^| )" + n + "=([^;]+)"),\n					);\n					return m ? m[2] : null;\n				}\n				var lang =\n					localStorage.getItem("language") ||\n					getCookie("NEXT_LOCALE") ||\n					document.documentElement.lang ||\n					"es";\n				if (lang !== "es" && lang !== "en") lang = "es";\n				document.documentElement.lang = lang;\n				function apply() {\n					var t = translations[lang];\n					if (!t) return;\n					document\n						.querySelectorAll("[data-i18n]")\n						.forEach(function (el) {\n							var k = el.getAttribute("data-i18n");\n							if (k && t[k]) el.textContent = t[k];\n						});\n					// Handle HTML translations (controlled content only)\n					document\n						.querySelectorAll("[data-i18n-html]")\n						.forEach(function (el) {\n							var k = el.getAttribute("data-i18n-html");\n							if (k && t[k]) el.innerHTML = t[k];\n						});\n				}\n				if (document.readyState === "loading") {\n					document.addEventListener("DOMContentLoaded", apply);\n				} else {\n					apply();\n				}\n				document.addEventListener("astro:page-load", apply);\n			})();\n		<\/script>', '</head> <body class="flex flex-col min-h-full bg-background text-foreground theme-transition"> ', ' <main class="flex-grow"> ', " </main> ", " </body></html>"])), addAttribute(lang, "lang"), title, renderScript($$result, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"), renderHead(), renderComponent($$result, "Navbar", $$Navbar, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/layouts/Layout.astro", void 0);

const _comment$1 = "DataTracker - Spanish translations for object inventory platform demo";
const Process$1 = "Procesando...";
const Process2$1 = "Cargando información...";
const Logout$1 = "Cerrar Sesión";
const Language$1 = "Idioma";
const Spanish$1 = "Español";
const English$1 = "English";
const Male$1 = "Tipo A";
const Female$1 = "Tipo B";
const Child$1 = "Nuevo";
const Adolescent$1 = "Reciente";
const Adult$1 = "Estándar";
const Senior$1 = "Antiguo";
const Minor$1 = "Categoría Menor";
const Print$1 = "Imprimir";
const Share$1 = "Compartir";
const Download$1 = "Descargar";
const Refresh$1 = "Actualizar";
const Settings$1 = "Configuración";
const Help$1 = "Ayuda";
const About$1 = "Acerca de";
const Contact$1 = "Contacto";
const Privacy$1 = "Privacidad";
const Terms$1 = "Términos";
const Version$1 = "Versión 1.0.0";
const Loading$1 = "Cargando...";
const Saving$1 = "Guardando...";
const Saved$1 = "Guardado";
const Cancel$1 = "Cancelar";
const Confirm$1 = "Confirmar";
const Close$1 = "Cerrar";
const Back$1 = "Volver";
const Next$1 = "Siguiente";
const Previous$1 = "Anterior";
const Finish$1 = "Finalizar";
const Required$1 = "Requerido";
const Optional$1 = "Opcional";
const Yes$1 = "Sí";
const No$1 = "No";
const OK$1 = "OK";
const Apply$1 = "Aplicar";
const Reset$1 = "Restablecer";
const Expand$1 = "Expandir";
const Collapse$1 = "Contraer";
const Rotate$1 = "Rotar";
const Flip$1 = "Voltear";
const Crop$1 = "Recortar";
const Resize$1 = "Redimensionar";
const Undo$1 = "Deshacer";
const Redo$1 = "Rehacer";
const Cut$1 = "Cortar";
const Copy$1 = "Copiar";
const Paste$1 = "Pegar";
const Duplicate$1 = "Duplicar";
const Move$1 = "Mover";
const Rename$1 = "Renombrar";
const Properties$1 = "Propiedades";
const Details$1 = "Detalles";
const Info$1 = "Información";
const Warning$1 = "Advertencia";
const Unauthorized$1 = "No autorizado";
const Forbidden$1 = "Prohibido";
const Timeout$1 = "Tiempo de espera agotado";
const Reconnecting$1 = "Reconectando...";
const Connected$1 = "Conectado";
const Disconnected$1 = "Desconectado";
const Online$1 = "En línea";
const Offline$1 = "Fuera de línea";
const Never$1 = "Nunca";
const Today$1 = "Hoy";
const Yesterday$1 = "Ayer";
const Tomorrow$1 = "Mañana";
const Process1$1 = "Procesando registro...";
const es = {
  _comment: _comment$1,
  "Navbar-1": "Inventario Activo",
  "Navbar-2": "Registrar Objeto",
  "Navbar-3": "Archivados",
  "Navbar-4": "Analíticas",
  "Navbar-5": "Panel Admin",
  "Navbar-6": "Iniciar Sesión",
  "Title-1": "DATATRACKER",
  "Title-1.1": "ORGANIZAR",
  "Title-1.3": "RASTREAR",
  "Title-1.5": "ANALIZAR",
  "Title-2": "ARCHIVAR",
  "Phrase-1": "La plataforma inteligente de inventario",
  "Phrase-2": "Registro histórico de objetos dados de baja",
  "Move-Mouse": "Explorar",
  "How-It-Works": "Cómo Funciona",
  "Step-1-Title": "Registra",
  "Step-1-Desc": "Añade nuevos objetos al inventario con información detallada: código, categoría, origen, ubicación y más.",
  "Step-2-Title": "Organiza",
  "Step-2-Desc": "Busca y filtra por cualquier campo. El sistema detecta automáticamente el tipo de búsqueda y ofrece paginación.",
  "Step-3-Title": "Analiza",
  "Step-3-Desc": "Visualiza estadísticas con gráficos interactivos y genera informes profesionales en PDF con análisis detallado.",
  "View-Analytics": "Ver Analíticas",
  "Features-Title": "Capacidades Técnicas",
  "Feature-Search-Title": "Buscador Avanzado",
  "Feature-Search-Desc": "Motor de búsqueda en tiempo real con detección automática de campos, filtrado inteligente y paginación eficiente.",
  "Feature-Analytics-Title": "Panel de Analíticas",
  "Feature-Analytics-Desc": "Gráficos interactivos con Recharts, generación de informes PDF profesionales y análisis estadístico completo.",
  "Feature-I18n-Title": "Soporte Multiidioma",
  "Feature-I18n-Desc": "Sistema de internacionalización completo con español e inglés, cambio de idioma en vivo y cobertura total.",
  "Feature-Security-Title": "Seguridad Robusta",
  "Feature-Security-Desc": "Autenticación de dos factores, tokens JWT, Cloudflare Turnstile y limitación de tasa para máxima seguridad.",
  "Feature-Responsive-Title": "Diseño Responsivo",
  "Feature-Responsive-Desc": "Interfaz mobile-first con modo oscuro, transiciones suaves y experiencia optimizada en todos los dispositivos.",
  "Feature-Cloud-Title": "Arquitectura en la Nube",
  "Feature-Cloud-Desc": "Infraestructura escalable con MongoDB, Cloudflare R2, Vercel y Redis para máximo rendimiento.",
  "Component-1": "Buscar Registros",
  "Component-S": "No se encontraron resultados",
  "List-Title-ID": "Código",
  "List-Title-Name": "Nombre del Objeto",
  "List-Title-Location": "Ubicación",
  "List-Info-Add": "Información Adicional",
  "List-Info-Gender": "Categoría:",
  "List-Info-Age": "Antigüedad:",
  "List-Info-Yo": "años",
  "List-Info-P": "Tipo:",
  "List-Info-N": "Origen:",
  "List-Info-H": "Estado:",
  "List-Info-D": "Condición:",
  "List-Info-PC": "Ubicación de almacenamiento:",
  "List-Info-Pd": "Último lugar conocido:",
  "List-Info-Dd": "Fecha de registro:",
  "List-Info-Dt": "Hora de registro:",
  "List-Info-E": "Clasificación:",
  "List-Info-I": "Imagen",
  "List-Info-Ierror": "Sin imagen disponible",
  "Info-Details": "Ver detalles de {{name}}",
  "Form-Title": "Registrar Nuevo Objeto",
  "Form-Subtitle": "Complete el formulario con la información del objeto",
  "Form-Name": "Nombre del Objeto",
  "Form-Code": "Código de Identificación",
  "Form-Category": "Categoría",
  "Form-Type": "Tipo de Objeto",
  "Form-Origin": "Origen",
  "Form-Location": "Ubicación Actual",
  "Form-LastKnown": "Último Lugar Conocido",
  "Form-Date": "Fecha de Registro",
  "Form-Time": "Hora de Registro",
  "Form-Age": "Antigüedad (años)",
  "Form-Condition": "Condición",
  "Form-Status": "Estado",
  "Form-Classification": "Clasificación",
  "Form-A": "Antigüedad (años)",
  "Form-G": "Categoría",
  "Form-GS": "Seleccione una categoría",
  "Form-GS-M": "Tipo A",
  "Form-GS-F": "Tipo B",
  "Form-L": "Estado (Venezuela)",
  "Form-LS": "Seleccione un estado",
  "Form-P": "Tipo de Objeto",
  "Form-E": "Clasificación",
  "Form-HC": "Condición",
  "Form-D": "Estado de Conservación",
  "Form-PlaceC": "Ubicación Actual",
  "Form-LD": "Último Lugar Conocido",
  "Form-DD": "Fecha de Registro",
  "Form-DT": "Hora de Registro",
  "Form-Image": "Imagen del Objeto",
  "Form-Submit": "Registrar Objeto",
  "Form-NV": "Nacional",
  "Form-Success": "Objeto registrado exitosamente",
  "Form-Error": "Error al registrar el objeto",
  "Stats-Title": "Analíticas del Inventario",
  "Stats-Total": "Total de Objetos",
  "Stats-Active": "Activos",
  "Stats-Archived": "Archivados",
  "Stats-ByCategory": "Por Categoría",
  "Stats-ByOrigin": "Por Origen",
  "Stats-ByLocation": "Por Ubicación",
  "Stats-ByAge": "Por Antigüedad",
  "Stats-Timeline": "Línea de Tiempo",
  "Stats-Export": "Exportar Informe",
  "Report-Header-Main": "Informe de Inventario - DataTracker",
  "Report-Header-Sub": "Análisis Estadístico del Sistema de Gestión de Objetos",
  "Report-Keywords": "Palabras Clave",
  "Report-Keywords-Content": "Inventario, Gestión de Objetos, Análisis Estadístico, Rastreo de Activos, Sistema de Registro",
  "Report-Nat-Note": "Nota: Este informe contiene datos agregados del sistema de inventario.",
  "Report-Section-1": "Resumen Ejecutivo",
  "Report-Section-2": "Distribución por Categoría",
  "Report-Section-3": "Distribución por Origen",
  "Report-Section-4": "Distribución por Ubicación",
  "Report-Section-5": "Análisis Temporal",
  "Report-Section-6": "Estadísticas de Antigüedad",
  "Report-Section-7": "Conclusiones",
  "Report-Total-Label": "Total de Objetos Registrados",
  "Report-Active-Label": "Objetos Activos",
  "Report-Archived-Label": "Objetos Archivados",
  "Report-Category-Label": "Categoría",
  "Report-Origin-Label": "Origen",
  "Report-Location-Label": "Ubicación",
  "Report-Count-Label": "Cantidad",
  "Report-Percentage-Label": "Porcentaje",
  "Report-Date-Label": "Fecha de Generación",
  "Report-Footer": "DataTracker - Sistema de Gestión de Inventario | Proyecto de Portafolio",
  "B-RequestRemoval": "Solicitar Baja",
  "Removal-Title": "Solicitar Baja de Objeto",
  "Removal-Reason": "Motivo de la solicitud",
  "Removal-Evidence": "URL de evidencia (opcional)",
  "Removal-Submit": "Enviar Solicitud",
  "Removal-Success": "Solicitud enviada exitosamente",
  Process: Process$1,
  Process2: Process2$1,
  "Error": "Error al cargar los datos",
  "Search-Placeholder": "Buscar por código, nombre, ubicación...",
  "Search-Button": "Buscar",
  "Search-Clear": "Limpiar",
  "Search-Results": "Resultados de búsqueda",
  "Search-NoResults": "No se encontraron objetos que coincidan con tu búsqueda",
  "Pagination-Previous": "Anterior",
  "Pagination-Next": "Siguiente",
  "Pagination-Page": "Página",
  "Pagination-Of": "de",
  "Admin-Title": "Panel de Administración",
  "Admin-Pending": "Solicitudes Pendientes",
  "Admin-Approve": "Aprobar",
  "Admin-Reject": "Rechazar",
  "Admin-NoRequests": "No hay solicitudes pendientes",
  "Login-Title": "Iniciar Sesión",
  "Login-Email": "Correo Electrónico",
  "Login-Password": "Contraseña",
  "Login-Submit": "Entrar",
  "Login-Error": "Credenciales inválidas",
  Logout: Logout$1,
  "Dark-Mode": "Modo Oscuro",
  "Light-Mode": "Modo Claro",
  Language: Language$1,
  Spanish: Spanish$1,
  English: English$1,
  Male: Male$1,
  Female: Female$1,
  Child: Child$1,
  Adolescent: Adolescent$1,
  Adult: Adult$1,
  Senior: Senior$1,
  Minor: Minor$1,
  "Legal-Adult": "Categoría Mayor",
  "Category-1": "Electrónica",
  "Category-2": "Mobiliario",
  "Category-3": "Herramientas",
  "Category-4": "Documentos",
  "Category-5": "Equipamiento",
  "Category-6": "Otros",
  "Origin-1": "Nacional",
  "Origin-2": "Importado",
  "Origin-3": "Fabricación Local",
  "Location-1": "Almacén Principal",
  "Location-2": "Almacén Secundario",
  "Location-3": "En Tránsito",
  "Location-4": "En Uso",
  "Location-5": "En Mantenimiento",
  "Condition-Good": "Bueno",
  "Condition-Fair": "Regular",
  "Condition-Poor": "Malo",
  "Condition-Excellent": "Excelente",
  "Status-Active": "Activo",
  "Status-Inactive": "Inactivo",
  "Status-Archived": "Archivado",
  "Status-Maintenance": "En Mantenimiento",
  "Classification-A": "Clase A",
  "Classification-B": "Clase B",
  "Classification-C": "Clase C",
  "Classification-D": "Clase D",
  "Consent-Title": "Aviso de Uso",
  "Consent-Message": "Esta es una plataforma de demostración. Los datos ingresados son ficticios y se utilizan únicamente con fines de portafolio.",
  "Consent-Accept": "Entendido",
  "Consent-Decline": "Cancelar",
  "Upload-Success": "Carga exitosa",
  "Upload-Error": "Error en la carga",
  "Upload-Processing": "Procesando archivo...",
  "Upload-SelectFile": "Seleccionar archivo",
  "Upload-DragDrop": "Arrastra y suelta aquí",
  "Upload-MaxSize": "Tamaño máximo: 5MB",
  "Upload-AllowedTypes": "Tipos permitidos: JPG, PNG, PDF",
  "Delete-Confirm": "¿Estás seguro de que deseas eliminar este objeto?",
  "Delete-Success": "Objeto eliminado exitosamente",
  "Delete-Error": "Error al eliminar el objeto",
  "Edit-Title": "Editar Objeto",
  "Edit-Success": "Objeto actualizado exitosamente",
  "Edit-Error": "Error al actualizar el objeto",
  "Filter-All": "Todos",
  "Filter-Active": "Activos",
  "Filter-Archived": "Archivados",
  "Filter-Category": "Filtrar por categoría",
  "Filter-Origin": "Filtrar por origen",
  "Filter-Location": "Filtrar por ubicación",
  "Sort-Name": "Ordenar por nombre",
  "Sort-Date": "Ordenar por fecha",
  "Sort-Code": "Ordenar por código",
  "Sort-Ascending": "Ascendente",
  "Sort-Descending": "Descendente",
  "Export-PDF": "Exportar a PDF",
  "Export-Excel": "Exportar a Excel",
  "Export-CSV": "Exportar a CSV",
  Print: Print$1,
  Share: Share$1,
  "Copy-Link": "Copiar enlace",
  Download: Download$1,
  Refresh: Refresh$1,
  Settings: Settings$1,
  Help: Help$1,
  About: About$1,
  Contact: Contact$1,
  Privacy: Privacy$1,
  Terms: Terms$1,
  Version: Version$1,
  Loading: Loading$1,
  Saving: Saving$1,
  Saved: Saved$1,
  Cancel: Cancel$1,
  Confirm: Confirm$1,
  Close: Close$1,
  Back: Back$1,
  Next: Next$1,
  Previous: Previous$1,
  Finish: Finish$1,
  Required: Required$1,
  Optional: Optional$1,
  Yes: Yes$1,
  No: No$1,
  OK: OK$1,
  Apply: Apply$1,
  Reset: Reset$1,
  "Clear-All": "Limpiar todo",
  "Select-All": "Seleccionar todo",
  "Deselect-All": "Deseleccionar todo",
  "Show-More": "Mostrar más",
  "Show-Less": "Mostrar menos",
  Expand: Expand$1,
  Collapse: Collapse$1,
  "Full-Screen": "Pantalla completa",
  "Exit-Full-Screen": "Salir de pantalla completa",
  "Zoom-In": "Acercar",
  "Zoom-Out": "Alejar",
  "Fit-To-Screen": "Ajustar a pantalla",
  Rotate: Rotate$1,
  Flip: Flip$1,
  Crop: Crop$1,
  Resize: Resize$1,
  Undo: Undo$1,
  Redo: Redo$1,
  Cut: Cut$1,
  Copy: Copy$1,
  Paste: Paste$1,
  Duplicate: Duplicate$1,
  Move: Move$1,
  Rename: Rename$1,
  Properties: Properties$1,
  Details: Details$1,
  Info: Info$1,
  Warning: Warning$1,
  "Success-Message": "Operación completada exitosamente",
  "Error-Message": "Ha ocurrido un error",
  "Network-Error": "Error de conexión",
  "Server-Error": "Error del servidor",
  "Not-Found": "No encontrado",
  Unauthorized: Unauthorized$1,
  Forbidden: Forbidden$1,
  Timeout: Timeout$1,
  "Invalid-Input": "Entrada inválida",
  "Required-Field": "Este campo es requerido",
  "Invalid-Email": "Correo electrónico inválido",
  "Invalid-URL": "URL inválida",
  "Invalid-Date": "Fecha inválida",
  "Invalid-Number": "Número inválido",
  "Min-Length": "Longitud mínima: {{min}}",
  "Max-Length": "Longitud máxima: {{max}}",
  "Min-Value": "Valor mínimo: {{min}}",
  "Max-Value": "Valor máximo: {{max}}",
  "Pattern-Mismatch": "Formato inválido",
  "Passwords-Must-Match": "Las contraseñas deben coincidir",
  "File-Too-Large": "Archivo demasiado grande",
  "Invalid-File-Type": "Tipo de archivo inválido",
  "Upload-Failed": "Fallo en la carga",
  "Download-Failed": "Fallo en la descarga",
  "Connection-Lost": "Conexión perdida",
  Reconnecting: Reconnecting$1,
  Connected: Connected$1,
  Disconnected: Disconnected$1,
  Online: Online$1,
  Offline: Offline$1,
  "Last-Updated": "Última actualización",
  Never: Never$1,
  "Just-Now": "Justo ahora",
  "Seconds-Ago": "Hace {{count}} segundos",
  "Minutes-Ago": "Hace {{count}} minutos",
  "Hours-Ago": "Hace {{count}} horas",
  "Days-Ago": "Hace {{count}} días",
  "Weeks-Ago": "Hace {{count}} semanas",
  "Months-Ago": "Hace {{count}} meses",
  "Years-Ago": "Hace {{count}} años",
  Today: Today$1,
  Yesterday: Yesterday$1,
  Tomorrow: Tomorrow$1,
  "This-Week": "Esta semana",
  "Last-Week": "Semana pasada",
  "This-Month": "Este mes",
  "Last-Month": "Mes pasado",
  "This-Year": "Este año",
  "Last-Year": "Año pasado",
  "Title-3": "Registrar Nuevo Objeto",
  Process1: Process1$1,
  "B-Upload": "Registrar",
  "Form-ID": "Código de Identificación",
  "Form-N": "Nombre del Objeto",
  "Stats-Age-Years": "años",
  "Stats-Metric-Total": "Total de Objetos Registrados",
  "Stats-Metric-WithPhoto": "Con Imagen",
  "Stats-Metric-Minors": "Objetos Nuevos",
  "Stats-Metric-CompleteData": "Datos Completos",
  "Stats-Chart-CasesPerMonth": "Registros por Mes",
  "Stats-Chart-GenderDistribution": "Distribución por Tipo",
  "Stats-Label-Men": "Tipo A",
  "Stats-Label-Women": "Tipo B",
  "Stats-Label-NotSpecified": "No Especificado",
  "Stats-Chart-ByNationality": "Por Origen",
  "Stats-Label-Venezuelans": "Nacional",
  "Stats-Label-Foreigners": "Importado",
  "Stats-Chart-AgeDistribution": "Distribución por Antigüedad",
  "Stats-Label-Under18": "Nuevos (< 2 años)",
  "Stats-Label-Adults18to64": "Recientes / Estándar (2-9 años)",
  "Stats-Label-Over65": "Antiguos (10+ años)",
  "Stats-Chart-DataQuality": "Calidad de Datos",
  "Stats-Label-WithPhoto": "Con Imagen",
  "Stats-Label-WithoutPhoto": "Sin Imagen",
  "Stats-Chart-Top10Ages": "Top 10 Antigüedades",
  "Stats-Chart-DisappearanceLocationsTop10": "Top 10 Ubicaciones de Registro",
  "Stats-Chart-ConfinementCentersTop10": "Top 10 Almacenes",
  "Stats-Chart-ProfessionsMostAffected": "Categorías Más Frecuentes",
  "Stats-Report-Title": "Informe de Inventario",
  "Stats-Report-Description": "Análisis estadístico del sistema de gestión de objetos",
  "Stats-Report-Generating": "Generando informe...",
  "Stats-Report-GenerateButton": "Generar Informe PDF",
  "Stats-Report-NoData": "No hay datos disponibles para generar el informe",
  "Stats-Report-SuccessTitle": "Informe Generado",
  "Stats-Report-SuccessSubtitle": "El informe PDF se ha descargado exitosamente",
  "Stats-Report-AgeSummaryTitle": "Resumen de Antigüedad",
  "Stats-Report-AgeMean": "Media",
  "Stats-Report-AgeMedian": "Mediana",
  "Stats-Report-AgeStdDev": "Desviación Estándar",
  "Stats-Report-AgeCV": "Coeficiente de Variación",
  "Stats-Report-ConclusionsTitle": "Conclusiones",
  "Validation-Name1": "El nombre solo puede contener letras, números, espacios, puntos y guiones",
  "Validation-Name2": "El nombre debe tener al menos 2 caracteres",
  "Validation-ID1": "El código solo puede contener letras, números y guiones",
  "Validation-ID3": "El código solo puede contener letras, números, guiones, puntos y guiones bajos",
  "Validation-N1": "El país de origen solo puede contener letras y espacios",
  "Validation-N2": "El país de origen debe tener al menos 3 caracteres",
  "Validation-A1": "La antigüedad debe ser un número",
  "Validation-A2": "La antigüedad no puede ser negativa",
  "Validation-A3": "La antigüedad no puede ser mayor a 200",
  "Validation-Text1": "solo puede contener letras, números, espacios, puntos, guiones y comas",
  "Validation-Text2": "debe tener al menos 2 caracteres",
  "Validation-Time": "La hora debe tener el formato HH:MM (24 horas)",
  "Component-2": "Motor de Búsqueda",
  "Component-3": "Buscar...",
  "Component-4": "Resultados",
  "Component-5": "Buscar por campo",
  "Component-P": "Carga Pendiente",
  "B-Delete": "Eliminar",
  "B-Blue": "Pendiente",
  "B-Green": "Aprobado",
  "B-Save": "Guardar",
  "B-Cancel": "Cancelar",
  "B-Logout": "Cerrar Sesión",
  "B-All": "Todos",
  "B-Confirm": "Confirmar",
  "B-Search": "Buscar",
  "Title-4": "Panel de Administración",
  "Subtitle-5": "Confirmación",
  "Paragraph-6": "¿Estás seguro de que deseas",
  "Paragraph-7": "este registro?",
  "List-Info-G1": "Nuevo",
  "List-Info-G2": "Reciente",
  "List-Info-G3": "Estándar",
  "List-Info-A1": "Categoría menor",
  "List-Info-A2": "Categoría mayor",
  "List-Info-A3": "Sin clasificar",
  "List-Search-ID": "Código",
  "List-Search-Name": "Nombre",
  "List-Search-Location": "Ubicación",
  "List-Search-Gender": "Categoría",
  "List-Search-Age": "Antigüedad",
  "List-Search-P": "Tipo de Objeto",
  "List-Search-D": "Condición",
  "List-Search-Pd": "Último Lugar Conocido",
  "List-Search-Dd": "Fecha de Registro",
  "List-Search-Dt": "Hora de Registro",
  "List-Search-E": "Clasificación",
  "List-Search-Ex": "Origen",
  "List-Search-H": "Estado",
  "List-Search-N": "País de Origen",
  "List-Search-PC": "Ubicación Actual",
  "Archive-Restore": "Restaurar",
  "Archive-Reason": "Motivo",
  "Archive-ArchivedOn": "Archivado",
  "Archive-RegisteredOn": "Registrado",
  "Archive-Empty": "No hay objetos archivados",
  "Archive-EmptyDesc": "Los objetos dados de baja aparecerán aquí",
  "Archive-RestoreConfirm": "¿Estás seguro de restaurar este objeto al inventario activo?",
  "Archive-RestoreSuccess": "Objeto restaurado exitosamente",
  "Archive-ShowMore": "Ver detalles",
  "Archive-ShowLess": "Ocultar detalles",
  "Archive-CountSingular": "objeto archivado",
  "Archive-CountPlural": "objetos archivados",
  "Archive-Condition": "Condición",
  "Archive-Conservation": "Estado de conservación",
  "Archive-CurrentLocation": "Ubicación actual",
  "Archive-LastLocation": "Último lugar conocido",
  "Archive-Origin": "País de origen",
  "Archive-Age": "Antigüedad",
};

const _comment = "DataTracker - English translations for object inventory platform demo";
const Process = "Processing...";
const Process2 = "Loading information...";
const Logout = "Logout";
const Language = "Language";
const Spanish = "Español";
const English = "English";
const Male = "Type A";
const Female = "Type B";
const Child = "New";
const Adolescent = "Recent";
const Adult = "Standard";
const Senior = "Old";
const Minor = "Minor Category";
const Print = "Print";
const Share = "Share";
const Download = "Download";
const Refresh = "Refresh";
const Settings = "Settings";
const Help = "Help";
const About = "About";
const Contact = "Contact";
const Privacy = "Privacy";
const Terms = "Terms";
const Version = "Version 1.0.0";
const Loading = "Loading...";
const Saving = "Saving...";
const Saved = "Saved";
const Cancel = "Cancel";
const Confirm = "Confirm";
const Close = "Close";
const Back = "Back";
const Next = "Next";
const Previous = "Previous";
const Finish = "Finish";
const Required = "Required";
const Optional = "Optional";
const Yes = "Yes";
const No = "No";
const OK = "OK";
const Apply = "Apply";
const Reset = "Reset";
const Expand = "Expand";
const Collapse = "Collapse";
const Rotate = "Rotate";
const Flip = "Flip";
const Crop = "Crop";
const Resize = "Resize";
const Undo = "Undo";
const Redo = "Redo";
const Cut = "Cut";
const Copy = "Copy";
const Paste = "Paste";
const Duplicate = "Duplicate";
const Move = "Move";
const Rename = "Rename";
const Properties = "Properties";
const Details = "Details";
const Info = "Information";
const Warning = "Warning";
const Unauthorized = "Unauthorized";
const Forbidden = "Forbidden";
const Timeout = "Timeout";
const Reconnecting = "Reconnecting...";
const Connected = "Connected";
const Disconnected = "Disconnected";
const Online = "Online";
const Offline = "Offline";
const Never = "Never";
const Today = "Today";
const Yesterday = "Yesterday";
const Tomorrow = "Tomorrow";
const Process1 = "Processing registration...";
const en = {
  _comment,
  "Navbar-1": "Active Inventory",
  "Navbar-2": "Register Object",
  "Navbar-3": "Archived",
  "Navbar-4": "Analytics",
  "Navbar-5": "Admin Panel",
  "Navbar-6": "Login",
  "Title-1": "DATATRACKER",
  "Title-1.1": "ORGANIZE",
  "Title-1.3": "TRACK",
  "Title-1.5": "ANALYZE",
  "Title-2": "ARCHIVED",
  "Phrase-1": "The smart inventory platform",
  "Phrase-2": "Historical record of decommissioned objects",
  "Move-Mouse": "Explore",
  "How-It-Works": "How It Works",
  "Step-1-Title": "Register",
  "Step-1-Desc": "Add new objects to inventory with detailed information: code, category, origin, location and more.",
  "Step-2-Title": "Organize",
  "Step-2-Desc": "Search and filter by any field. The system automatically detects search type and offers pagination.",
  "Step-3-Title": "Analyze",
  "Step-3-Desc": "Visualize statistics with interactive charts and generate professional PDF reports with detailed analysis.",
  "View-Analytics": "View Analytics",
  "Features-Title": "Technical Capabilities",
  "Feature-Search-Title": "Advanced Search",
  "Feature-Search-Desc": "Real-time search engine with automatic field detection, intelligent filtering and efficient pagination.",
  "Feature-Analytics-Title": "Analytics Dashboard",
  "Feature-Analytics-Desc": "Interactive charts with Recharts, professional PDF report generation and complete statistical analysis.",
  "Feature-I18n-Title": "Multi-Language Support",
  "Feature-I18n-Desc": "Complete internationalization system with Spanish and English, live language switching and full coverage.",
  "Feature-Security-Title": "Robust Security",
  "Feature-Security-Desc": "Two-factor authentication, JWT tokens, Cloudflare Turnstile and rate limiting for maximum security.",
  "Feature-Responsive-Title": "Responsive Design",
  "Feature-Responsive-Desc": "Mobile-first interface with dark mode, smooth transitions and optimized experience on all devices.",
  "Feature-Cloud-Title": "Cloud Architecture",
  "Feature-Cloud-Desc": "Scalable infrastructure with MongoDB, Cloudflare R2, Vercel and Redis for maximum performance.",
  "Component-1": "Search Records",
  "Component-S": "No results found",
  "List-Title-ID": "Code",
  "List-Title-Name": "Object Name",
  "List-Title-Location": "Location",
  "List-Info-Add": "Additional Information",
  "List-Info-Gender": "Category:",
  "List-Info-Age": "Age:",
  "List-Info-Yo": "years",
  "List-Info-P": "Type:",
  "List-Info-N": "Origin:",
  "List-Info-H": "Status:",
  "List-Info-D": "Condition:",
  "List-Info-PC": "Storage location:",
  "List-Info-Pd": "Last known location:",
  "List-Info-Dd": "Registration date:",
  "List-Info-Dt": "Registration time:",
  "List-Info-E": "Classification:",
  "List-Info-I": "Image",
  "List-Info-Ierror": "No image available",
  "Info-Details": "View details of {{name}}",
  "Form-Title": "Register New Object",
  "Form-Subtitle": "Complete the form with object information",
  "Form-Name": "Object Name",
  "Form-Code": "Identification Code",
  "Form-Category": "Category",
  "Form-Type": "Object Type",
  "Form-Origin": "Origin",
  "Form-Location": "Current Location",
  "Form-LastKnown": "Last Known Location",
  "Form-Date": "Registration Date",
  "Form-Time": "Registration Time",
  "Form-Age": "Age (years)",
  "Form-Condition": "Condition",
  "Form-Status": "Status",
  "Form-Classification": "Classification",
  "Form-A": "Age (years)",
  "Form-G": "Category",
  "Form-GS": "Select a category",
  "Form-GS-M": "Type A",
  "Form-GS-F": "Type B",
  "Form-L": "State (Venezuela)",
  "Form-LS": "Select a state",
  "Form-P": "Object Type",
  "Form-E": "Classification",
  "Form-HC": "Condition",
  "Form-D": "Conservation Status",
  "Form-PlaceC": "Current Location",
  "Form-LD": "Last Known Location",
  "Form-DD": "Registration Date",
  "Form-DT": "Registration Time",
  "Form-Image": "Object Image",
  "Form-Submit": "Register Object",
  "Form-NV": "Domestic",
  "Form-Success": "Object registered successfully",
  "Form-Error": "Error registering object",
  "Stats-Title": "Inventory Analytics",
  "Stats-Total": "Total Objects",
  "Stats-Active": "Active",
  "Stats-Archived": "Archived",
  "Stats-ByCategory": "By Category",
  "Stats-ByOrigin": "By Origin",
  "Stats-ByLocation": "By Location",
  "Stats-ByAge": "By Age",
  "Stats-Timeline": "Timeline",
  "Stats-Export": "Export Report",
  "Report-Header-Main": "Inventory Report - DataTracker",
  "Report-Header-Sub": "Statistical Analysis of Object Management System",
  "Report-Keywords": "Keywords",
  "Report-Keywords-Content": "Inventory, Object Management, Statistical Analysis, Asset Tracking, Registration System",
  "Report-Nat-Note": "Note: This report contains aggregated data from the inventory system.",
  "Report-Section-1": "Executive Summary",
  "Report-Section-2": "Distribution by Category",
  "Report-Section-3": "Distribution by Origin",
  "Report-Section-4": "Distribution by Location",
  "Report-Section-5": "Temporal Analysis",
  "Report-Section-6": "Age Statistics",
  "Report-Section-7": "Conclusions",
  "Report-Total-Label": "Total Registered Objects",
  "Report-Active-Label": "Active Objects",
  "Report-Archived-Label": "Archived Objects",
  "Report-Category-Label": "Category",
  "Report-Origin-Label": "Origin",
  "Report-Location-Label": "Location",
  "Report-Count-Label": "Count",
  "Report-Percentage-Label": "Percentage",
  "Report-Date-Label": "Generation Date",
  "Report-Footer": "DataTracker - Inventory Management System | Portfolio Project",
  "B-RequestRemoval": "Request Removal",
  "Removal-Title": "Request Object Removal",
  "Removal-Reason": "Reason for request",
  "Removal-Evidence": "Evidence URL (optional)",
  "Removal-Submit": "Submit Request",
  "Removal-Success": "Request submitted successfully",
  Process,
  Process2,
  "Error": "Error loading data",
  "Search-Placeholder": "Search by code, name, location...",
  "Search-Button": "Search",
  "Search-Clear": "Clear",
  "Search-Results": "Search results",
  "Search-NoResults": "No objects found matching your search",
  "Pagination-Previous": "Previous",
  "Pagination-Next": "Next",
  "Pagination-Page": "Page",
  "Pagination-Of": "of",
  "Admin-Title": "Administration Panel",
  "Admin-Pending": "Pending Requests",
  "Admin-Approve": "Approve",
  "Admin-Reject": "Reject",
  "Admin-NoRequests": "No pending requests",
  "Login-Title": "Login",
  "Login-Email": "Email",
  "Login-Password": "Password",
  "Login-Submit": "Sign In",
  "Login-Error": "Invalid credentials",
  Logout,
  "Dark-Mode": "Dark Mode",
  "Light-Mode": "Light Mode",
  Language,
  Spanish,
  English,
  Male,
  Female,
  Child,
  Adolescent,
  Adult,
  Senior,
  Minor,
  "Legal-Adult": "Major Category",
  "Category-1": "Electronics",
  "Category-2": "Furniture",
  "Category-3": "Tools",
  "Category-4": "Documents",
  "Category-5": "Equipment",
  "Category-6": "Other",
  "Origin-1": "Domestic",
  "Origin-2": "Imported",
  "Origin-3": "Local Manufacturing",
  "Location-1": "Main Warehouse",
  "Location-2": "Secondary Warehouse",
  "Location-3": "In Transit",
  "Location-4": "In Use",
  "Location-5": "In Maintenance",
  "Condition-Good": "Good",
  "Condition-Fair": "Fair",
  "Condition-Poor": "Poor",
  "Condition-Excellent": "Excellent",
  "Status-Active": "Active",
  "Status-Inactive": "Inactive",
  "Status-Archived": "Archived",
  "Status-Maintenance": "In Maintenance",
  "Classification-A": "Class A",
  "Classification-B": "Class B",
  "Classification-C": "Class C",
  "Classification-D": "Class D",
  "Consent-Title": "Usage Notice",
  "Consent-Message": "This is a demonstration platform. Entered data is fictional and used solely for portfolio purposes.",
  "Consent-Accept": "Understood",
  "Consent-Decline": "Cancel",
  "Upload-Success": "Upload successful",
  "Upload-Error": "Upload error",
  "Upload-Processing": "Processing file...",
  "Upload-SelectFile": "Select file",
  "Upload-DragDrop": "Drag and drop here",
  "Upload-MaxSize": "Max size: 5MB",
  "Upload-AllowedTypes": "Allowed types: JPG, PNG, PDF",
  "Delete-Confirm": "Are you sure you want to delete this object?",
  "Delete-Success": "Object deleted successfully",
  "Delete-Error": "Error deleting object",
  "Edit-Title": "Edit Object",
  "Edit-Success": "Object updated successfully",
  "Edit-Error": "Error updating object",
  "Filter-All": "All",
  "Filter-Active": "Active",
  "Filter-Archived": "Archived",
  "Filter-Category": "Filter by category",
  "Filter-Origin": "Filter by origin",
  "Filter-Location": "Filter by location",
  "Sort-Name": "Sort by name",
  "Sort-Date": "Sort by date",
  "Sort-Code": "Sort by code",
  "Sort-Ascending": "Ascending",
  "Sort-Descending": "Descending",
  "Export-PDF": "Export to PDF",
  "Export-Excel": "Export to Excel",
  "Export-CSV": "Export to CSV",
  Print,
  Share,
  "Copy-Link": "Copy link",
  Download,
  Refresh,
  Settings,
  Help,
  About,
  Contact,
  Privacy,
  Terms,
  Version,
  Loading,
  Saving,
  Saved,
  Cancel,
  Confirm,
  Close,
  Back,
  Next,
  Previous,
  Finish,
  Required,
  Optional,
  Yes,
  No,
  OK,
  Apply,
  Reset,
  "Clear-All": "Clear all",
  "Select-All": "Select all",
  "Deselect-All": "Deselect all",
  "Show-More": "Show more",
  "Show-Less": "Show less",
  Expand,
  Collapse,
  "Full-Screen": "Full screen",
  "Exit-Full-Screen": "Exit full screen",
  "Zoom-In": "Zoom in",
  "Zoom-Out": "Zoom out",
  "Fit-To-Screen": "Fit to screen",
  Rotate,
  Flip,
  Crop,
  Resize,
  Undo,
  Redo,
  Cut,
  Copy,
  Paste,
  Duplicate,
  Move,
  Rename,
  Properties,
  Details,
  Info,
  Warning,
  "Success-Message": "Operation completed successfully",
  "Error-Message": "An error has occurred",
  "Network-Error": "Connection error",
  "Server-Error": "Server error",
  "Not-Found": "Not found",
  Unauthorized,
  Forbidden,
  Timeout,
  "Invalid-Input": "Invalid input",
  "Required-Field": "This field is required",
  "Invalid-Email": "Invalid email",
  "Invalid-URL": "Invalid URL",
  "Invalid-Date": "Invalid date",
  "Invalid-Number": "Invalid number",
  "Min-Length": "Minimum length: {{min}}",
  "Max-Length": "Maximum length: {{max}}",
  "Min-Value": "Minimum value: {{min}}",
  "Max-Value": "Maximum value: {{max}}",
  "Pattern-Mismatch": "Invalid format",
  "Passwords-Must-Match": "Passwords must match",
  "File-Too-Large": "File too large",
  "Invalid-File-Type": "Invalid file type",
  "Upload-Failed": "Upload failed",
  "Download-Failed": "Download failed",
  "Connection-Lost": "Connection lost",
  Reconnecting,
  Connected,
  Disconnected,
  Online,
  Offline,
  "Last-Updated": "Last updated",
  Never,
  "Just-Now": "Just now",
  "Seconds-Ago": "{{count}} seconds ago",
  "Minutes-Ago": "{{count}} minutes ago",
  "Hours-Ago": "{{count}} hours ago",
  "Days-Ago": "{{count}} days ago",
  "Weeks-Ago": "{{count}} weeks ago",
  "Months-Ago": "{{count}} months ago",
  "Years-Ago": "{{count}} years ago",
  Today,
  Yesterday,
  Tomorrow,
  "This-Week": "This week",
  "Last-Week": "Last week",
  "This-Month": "This month",
  "Last-Month": "Last month",
  "This-Year": "This year",
  "Last-Year": "Last year",
  "Title-3": "Register New Object",
  Process1,
  "B-Upload": "Register",
  "Form-ID": "Identification Code",
  "Form-N": "Object Name",
  "Stats-Age-Years": "years",
  "Stats-Metric-Total": "Total Registered Objects",
  "Stats-Metric-WithPhoto": "With Image",
  "Stats-Metric-Minors": "New Items",
  "Stats-Metric-CompleteData": "Complete Data",
  "Stats-Chart-CasesPerMonth": "Registrations per Month",
  "Stats-Chart-GenderDistribution": "Distribution by Type",
  "Stats-Label-Men": "Type A",
  "Stats-Label-Women": "Type B",
  "Stats-Label-NotSpecified": "Not Specified",
  "Stats-Chart-ByNationality": "By Origin",
  "Stats-Label-Venezuelans": "Domestic",
  "Stats-Label-Foreigners": "Imported",
  "Stats-Chart-AgeDistribution": "Distribution by Age",
  "Stats-Label-Under18": "New (< 2 years)",
  "Stats-Label-Adults18to64": "Recent / Standard (2-9 years)",
  "Stats-Label-Over65": "Old (10+ years)",
  "Stats-Chart-DataQuality": "Data Quality",
  "Stats-Label-WithPhoto": "With Image",
  "Stats-Label-WithoutPhoto": "Without Image",
  "Stats-Chart-Top10Ages": "Top 10 Ages",
  "Stats-Chart-DisappearanceLocationsTop10": "Top 10 Registration Locations",
  "Stats-Chart-ConfinementCentersTop10": "Top 10 Warehouses",
  "Stats-Chart-ProfessionsMostAffected": "Most Frequent Categories",
  "Stats-Report-Title": "Inventory Report",
  "Stats-Report-Description": "Statistical analysis of the object management system",
  "Stats-Report-Generating": "Generating report...",
  "Stats-Report-GenerateButton": "Generate PDF Report",
  "Stats-Report-NoData": "No data available to generate the report",
  "Stats-Report-SuccessTitle": "Report Generated",
  "Stats-Report-SuccessSubtitle": "The PDF report has been downloaded successfully",
  "Stats-Report-AgeSummaryTitle": "Age Summary",
  "Stats-Report-AgeMean": "Mean",
  "Stats-Report-AgeMedian": "Median",
  "Stats-Report-AgeStdDev": "Standard Deviation",
  "Stats-Report-AgeCV": "Coefficient of Variation",
  "Stats-Report-ConclusionsTitle": "Conclusions",
  "Validation-Name1": "Name can only contain letters, numbers, spaces, dots and hyphens",
  "Validation-Name2": "Name must be at least 2 characters",
  "Validation-ID1": "Code can only contain letters, numbers and hyphens",
  "Validation-ID3": "Code can only contain letters, numbers, hyphens, dots and underscores",
  "Validation-N1": "Country of origin can only contain letters and spaces",
  "Validation-N2": "Country of origin must be at least 3 characters",
  "Validation-A1": "Age must be a number",
  "Validation-A2": "Age cannot be negative",
  "Validation-A3": "Age cannot be greater than 200",
  "Validation-Text1": "can only contain letters, numbers, spaces, dots, hyphens and commas",
  "Validation-Text2": "must be at least 2 characters",
  "Validation-Time": "Time must be in HH:MM format (24 hours)",
  "Component-2": "Search Engine",
  "Component-3": "Search...",
  "Component-4": "Results",
  "Component-5": "Search by field",
  "Component-P": "Pending Upload",
  "B-Delete": "Delete",
  "B-Blue": "Pending",
  "B-Green": "Approved",
  "B-Save": "Save",
  "B-Cancel": "Cancel",
  "B-Logout": "Logout",
  "B-All": "All",
  "B-Confirm": "Confirm",
  "B-Search": "Search",
  "Title-4": "Admin Panel",
  "Subtitle-5": "Confirmation",
  "Paragraph-6": "Are you sure you want to",
  "Paragraph-7": "this record?",
  "List-Info-G1": "New",
  "List-Info-G2": "Recent",
  "List-Info-G3": "Standard",
  "List-Info-A1": "Minor Category",
  "List-Info-A2": "Major Category",
  "List-Info-A3": "Unclassified",
  "List-Search-ID": "Code",
  "List-Search-Name": "Name",
  "List-Search-Location": "Location",
  "List-Search-Gender": "Category",
  "List-Search-Age": "Age",
  "List-Search-P": "Object Type",
  "List-Search-D": "Condition",
  "List-Search-Pd": "Last Known Location",
  "List-Search-Dd": "Registration Date",
  "List-Search-Dt": "Registration Time",
  "List-Search-E": "Classification",
  "List-Search-Ex": "Origin",
  "List-Search-H": "Status",
  "List-Search-N": "Country of Origin",
  "List-Search-PC": "Current Location",
  "Archive-Restore": "Restore",
  "Archive-Reason": "Reason",
  "Archive-ArchivedOn": "Archived on",
  "Archive-RegisteredOn": "Registered",
  "Archive-Empty": "No archived objects",
  "Archive-EmptyDesc": "Decommissioned objects will appear here",
  "Archive-RestoreConfirm": "Are you sure you want to restore this object to active inventory?",
  "Archive-RestoreSuccess": "Object restored successfully",
  "Archive-ShowMore": "Show details",
  "Archive-ShowLess": "Hide details",
  "Archive-CountSingular": "archived object",
  "Archive-CountPlural": "archived objects",
  "Archive-Condition": "Condition",
  "Archive-Conservation": "Conservation status",
  "Archive-CurrentLocation": "Current location",
  "Archive-LastLocation": "Last known location",
  "Archive-Origin": "Country of origin",
  "Archive-Age": "Age",
};

const translations = { es, en };
const LanguageContext = createContext({
  currentLang: "es",
  setLanguage: () => {
  },
  translate: (key) => key,
  forceUpdate: () => {
  }
});
const useLanguage = () => useContext(LanguageContext);
function isValidLanguage(lang) {
  return lang === "es" || lang === "en";
}
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
function getPersistedLanguage() {
  if (typeof window === "undefined") return "es";
  const cookieLang = getCookie("NEXT_LOCALE");
  if (cookieLang && isValidLanguage(cookieLang)) return cookieLang;
  const storedLang = localStorage.getItem("language");
  if (storedLang && isValidLanguage(storedLang)) return storedLang;
  const htmlLang = document.documentElement.lang;
  if (htmlLang && isValidLanguage(htmlLang)) return htmlLang;
  return "es";
}
function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState("es");
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    const persistedLang = getPersistedLanguage();
    if (persistedLang !== currentLang) {
      setCurrentLang(persistedLang);
    }
    setIsHydrated(true);
    const handleAstroPageLoad = () => {
      const newLang = getPersistedLanguage();
      setCurrentLang(newLang);
    };
    document.addEventListener("astro:page-load", handleAstroPageLoad);
    return () => {
      document.removeEventListener("astro:page-load", handleAstroPageLoad);
    };
  }, []);
  useEffect(() => {
    const handleLanguageChange = (event) => {
      setCurrentLang(event.detail.language);
    };
    window.addEventListener("languagechange", handleLanguageChange);
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange);
    };
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined" && isHydrated) {
      localStorage.setItem("language", currentLang);
      document.documentElement.lang = currentLang;
      document.cookie = `NEXT_LOCALE=${currentLang}; path=/; max-age=31536000; SameSite=Strict; Secure`;
      updateTranslations(currentLang);
    }
  }, [currentLang, isHydrated]);
  const setLanguageCallback = useCallback((lang) => {
    if (isValidLanguage(lang)) {
      setCurrentLang(lang);
    } else {
      console.error(`Invalid language: ${lang}`);
    }
  }, []);
  const translateCallback = useCallback(
    (key, vars) => translateWithVars(key, currentLang, vars),
    [currentLang]
  );
  const forceUpdateCallback = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("languagechange", { detail: { language: currentLang } }));
    }
  }, [currentLang]);
  const contextValue = useMemo(() => ({
    currentLang,
    setLanguage: setLanguageCallback,
    translate: translateCallback,
    forceUpdate: forceUpdateCallback
  }), [currentLang, setLanguageCallback, translateCallback, forceUpdateCallback]);
  return /* @__PURE__ */ jsx(LanguageContext.Provider, { value: contextValue, children });
}
function translate(key, lang) {
  return translations[lang][key] || key;
}
function translateWithVars(key, lang, vars) {
  let translation = translations[lang][key] || key;
  if (vars) {
    Object.entries(vars).forEach(([varKey, varValue]) => {
      translation = translation.replace(new RegExp(`\\{${varKey}\\}`, "g"), String(varValue));
    });
  }
  return translation;
}
function updateTranslations(lang) {
  if (typeof document !== "undefined") {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (key && key in translations[lang]) {
        element.textContent = translate(key, lang);
      }
    });
    const htmlElements = document.querySelectorAll("[data-i18n-html]");
    htmlElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-html");
      if (key && key in translations[lang]) {
        element.innerHTML = translate(key, lang);
      }
    });
    const attributeElements = document.querySelectorAll("[data-i18n-attr]");
    attributeElements.forEach((element) => {
      const attr = element.getAttribute("data-i18n-attr");
      const key = element.getAttribute("data-i18n");
      if (attr && key && key in translations[lang]) {
        element.setAttribute(attr, translate(key, lang));
      }
    });
  }
}
function useTranslation() {
  const { translate: translate2, currentLang, forceUpdate } = useLanguage();
  return { t: translate2, lang: currentLang, forceUpdate };
}

export { $$Layout as $, LanguageProvider as L, useLanguage as a, useTranslation as u };
