import { e as createComponent, m as maybeRenderHead, n as renderScript, k as renderComponent, l as Fragment, r as renderTemplate } from '../chunks/astro/server_CJfq-tyP.mjs';
import { $ as $$Layout } from '../chunks/Layout_BnVrAAn4.mjs';
/* empty css                                 */
import 'clsx';
import { jsx, jsxs } from 'react/jsx-runtime';
import React__default, { Component, lazy, useState, Suspense, useCallback, useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { u as useLanguage, L as LanguageProvider } from '../chunks/i18n_Bd6mPn--.mjs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, u as useFetchData, o as useFilteredData, p as SearchBar, q as SearchFieldSelector, E as ErrorBoundary, P as Pagination } from '../chunks/Pagination_Dzmz6ytF.mjs';
import { B as Button } from '../chunks/input_DaDLUbK_.mjs';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { g as getLegalCondition, a as getAgeStage, f as formatCedula, r as renderValue } from '../chunks/utils_CdDBA7zL.mjs';
/* empty css                                        */
export { renderers } from '../renderers.mjs';

const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="hero-gradient flex flex-col items-center justify-center px-3 sm:px-4 theme-transition relative" style="height: calc(100vh - 4rem); min-height: 400px;" data-astro-cid-hpnw4vwy> <div class="text-center max-w-4xl mx-auto w-full flex flex-col items-center justify-center flex-1" data-astro-cid-hpnw4vwy> <!-- Typewriter Title --> <h1 id="changing-title" class="changing-title text-gray-200 font-back text-center drop-shadow-lg px-2" data-i18n="Title-1" data-astro-cid-hpnw4vwy>
NO MÁS SECUESTROS
</h1> <!-- Stars --> <div class="flex items-center justify-center space-x-1 sm:space-x-2 my-3 sm:my-4" data-astro-cid-hpnw4vwy> ${[...Array(7)].map((_) => renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 star" data-astro-cid-hpnw4vwy> ${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-hpnw4vwy": true }, { "default": async ($$result2) => renderTemplate` <path stroke="none" d="M0 0h24v24H0z" fill="none" data-astro-cid-hpnw4vwy></path> <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" data-astro-cid-hpnw4vwy></path> ` })} </svg>`)} </div> <!-- Tricolor Bar --> <div class="flex justify-center" data-astro-cid-hpnw4vwy> <div class="tricolor-bar w-40 sm:w-56 md:w-72" data-astro-cid-hpnw4vwy> <div class="tricolor-yellow" data-astro-cid-hpnw4vwy></div> <div class="tricolor-blue" data-astro-cid-hpnw4vwy></div> <div class="tricolor-red" data-astro-cid-hpnw4vwy></div> </div> </div> <!-- Phrase --> <p class="mt-4 sm:mt-6 text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium px-4 sm:px-0" data-i18n="Phrase-1" style="font-family: 'Inter', sans-serif;" data-astro-cid-hpnw4vwy>
¡No son solo números, son personas!
</p> </div> <!-- Scroll Indicator --> <div class="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 scroll-indicator flex flex-col items-center justify-center flex-1" data-astro-cid-hpnw4vwy> <span data-i18n="Move-Mouse" class="text-center text-[10px] uppercase tracking-widest text-gray-800 dark:text-gray-300 mb-2 opacity-70 font-medium" data-astro-cid-hpnw4vwy>
Desplazar
</span> <!-- Mobile: Chevron arrow --> <svg class="w-8 h-8 text-gray-800 dark:text-gray-300 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-hpnw4vwy> <polyline points="6 9 12 15 18 9" data-astro-cid-hpnw4vwy></polyline> </svg> <!-- Desktop: Mouse --> <div class="hidden sm:flex w-6 h-10 border-2 border-gray-800 dark:border-gray-300 rounded-full items-start justify-center p-1" data-astro-cid-hpnw4vwy> <div class="w-1.5 h-2.5 bg-gray-800 dark:bg-gray-300 rounded-full" data-astro-cid-hpnw4vwy></div> </div> </div> </section> ${renderScript($$result, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/header.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/header.astro", void 0);

const $$InfoSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="py-10 sm:py-16 px-4 sm:px-6 bg-background theme-transition" data-astro-cid-bsieafsl> <div class="container mx-auto max-w-5xl" data-astro-cid-bsieafsl> <!-- Two-column grid layout - stack on mobile --> <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10" data-astro-cid-bsieafsl> <!-- Card 1: Nuestro Propósito --> <article data-astro-cid-bsieafsl> <h3 class="font-display text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 text-left" data-i18n="Subtitle-1" style="font-family: 'Playfair Display', serif;" data-astro-cid-bsieafsl>
Nuestro Propósito
</h3> <!-- Tricolor accent line --> <div class="flex h-[3px] w-20 sm:w-24 mb-3 sm:mb-4" data-astro-cid-bsieafsl> <div class="flex-1 tricolor-yellow" data-astro-cid-bsieafsl></div> <div class="flex-1 tricolor-blue" data-astro-cid-bsieafsl></div> <div class="flex-1 tricolor-red" data-astro-cid-bsieafsl></div> </div> <p class="text-muted-foreground leading-relaxed text-sm sm:text-base text-left" data-i18n="Paragraph-1" style="font-family: 'Inter', sans-serif;" data-astro-cid-bsieafsl>
Esta página ha sido creada con el propósito de divulgar un
                    registro detallado de todos los secuestros que han sido
                    producto de la persecución política ejecutada por el régimen
                    tras las elecciones presidenciales del 28 de julio del 2024.
                    Nuestro objetivo es que la información recolectada y
                    expuesta sea precisa y personal, a fin de evitar las
                    ambigüedades.
</p> </article> <!-- Card 2: Valor de cada vida --> <article data-astro-cid-bsieafsl> <h3 class="font-display text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 text-left" data-i18n="Subtitle-2" style="font-family: 'Playfair Display', serif;" data-astro-cid-bsieafsl>
Valor de cada vida
</h3> <!-- Tricolor accent line --> <div class="flex h-[3px] w-20 sm:w-24 mb-3 sm:mb-4" data-astro-cid-bsieafsl> <div class="flex-1 tricolor-yellow" data-astro-cid-bsieafsl></div> <div class="flex-1 tricolor-blue" data-astro-cid-bsieafsl></div> <div class="flex-1 tricolor-red" data-astro-cid-bsieafsl></div> </div> <p class="text-muted-foreground leading-relaxed text-sm sm:text-base text-left" data-i18n="Paragraph-2" style="font-family: 'Inter', sans-serif;" data-astro-cid-bsieafsl>
Cada persona en esta lista representa una vida: hijo/a,
                    padre/madre, abuelo/a, nieto/a, primo/a, tío/a, sobrino/a,
                    amigo/a, vecino/a. Los presos políticos no son un número a
                    contabilizar, sino personas con allegados y seres queridos
                    que los esperan y los recuerdan.
</p> </article> <!-- Card 3: Sobre esta iniciativa --> <article data-astro-cid-bsieafsl> <h3 class="font-display text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 text-left" data-i18n="Subtitle-3" style="font-family: 'Playfair Display', serif;" data-astro-cid-bsieafsl>
Sobre esta iniciativa
</h3> <!-- Tricolor accent line --> <div class="flex h-[3px] w-20 sm:w-24 mb-3 sm:mb-4" data-astro-cid-bsieafsl> <div class="flex-1 tricolor-yellow" data-astro-cid-bsieafsl></div> <div class="flex-1 tricolor-blue" data-astro-cid-bsieafsl></div> <div class="flex-1 tricolor-red" data-astro-cid-bsieafsl></div> </div> <p class="text-muted-foreground leading-relaxed text-sm sm:text-base text-left" data-i18n="Paragraph-3" style="font-family: 'Inter', sans-serif;" data-astro-cid-bsieafsl>
Esta iniciativa busca crear conciencia sobre la situación de
                    los presos políticos en Venezuela. Nuestro objetivo es
                    mantener viva la memoria de aquellos que han sido
                    injustamente detenidos y presionar por su liberación.
</p> </article> <!-- Card 4: Aviso Importante --> <article data-astro-cid-bsieafsl> <h3 class="font-display text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 text-left" data-i18n="Subtitle-4" style="font-family: 'Playfair Display', serif;" data-astro-cid-bsieafsl>
Aviso Importante
</h3> <!-- Tricolor accent line --> <div class="flex h-[3px] w-20 sm:w-24 mb-3 sm:mb-4" data-astro-cid-bsieafsl> <div class="flex-1 tricolor-yellow" data-astro-cid-bsieafsl></div> <div class="flex-1 tricolor-blue" data-astro-cid-bsieafsl></div> <div class="flex-1 tricolor-red" data-astro-cid-bsieafsl></div> </div> <p class="text-muted-foreground leading-relaxed text-sm sm:text-base text-left" data-i18n="Paragraph-4" style="font-family: 'Inter', sans-serif;" data-astro-cid-bsieafsl>
Si tienes información sobre casos de secuestros políticos o
                    deseas colaborar con nuestra causa, por favor rellena un
<a href="/subir-informacion" class="text-primary hover:underline" data-astro-cid-bsieafsl>formulario</a> o comunícate con nosotros en la red social X en nuestra cuenta
<a href="https://x.com/NoMasSecuestr0s" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline" data-astro-cid-bsieafsl>@NoMasSecuestr0s</a>.
</p> </article> </div> <!-- Arrow indicator to search section --> <div class="flex flex-col items-center mt-12 sm:mt-16" data-astro-cid-bsieafsl> <a href="#motor-busqueda" class="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="Ir al buscador" data-astro-cid-bsieafsl> <span class="text-sm mb-2" data-i18n="Component-1" data-astro-cid-bsieafsl>Buscar Detenidos</span> <svg class="w-6 h-6 sm:w-8 sm:h-8 arrow-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-bsieafsl> <polyline points="6 9 12 15 18 9" data-astro-cid-bsieafsl></polyline> </svg> </a> </div> </div> </section>`;
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/InfoSection.astro", void 0);

class UniversalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.handleReset = () => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    };
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    const componentName = this.props.componentName || "Componente desconocido";
    console.error(`[Error Boundary] Error en ${componentName}:`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    this.setState({
      errorInfo
    });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    if (process.env.NODE_ENV === "production") ;
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      const componentName = this.props.componentName || "este componente";
      const isDevelopment = process.env.NODE_ENV === "development";
      return /* @__PURE__ */ jsx("div", { className: "min-h-[200px] flex items-center justify-center p-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-12 h-12 mx-auto text-destructive",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-foreground mb-2", children: [
          "Error al cargar ",
          componentName
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Ocurrió un problema inesperado. Por favor, intenta recargar la página." }),
        isDevelopment && this.state.error && /* @__PURE__ */ jsxs("details", { className: "text-left mb-4 bg-background/50 rounded p-3", children: [
          /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-xs font-mono text-destructive mb-2", children: "Detalles del error (solo en desarrollo)" }),
          /* @__PURE__ */ jsxs("pre", { className: "text-xs overflow-auto max-h-40 text-foreground/70", children: [
            this.state.error.message,
            "\n\n",
            this.state.error.stack
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-center", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: this.handleReset,
              className: "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium",
              children: "Reintentar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => window.location.reload(),
              className: "px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors text-sm font-medium",
              children: "Recargar página"
            }
          )
        ] })
      ] }) });
    }
    return this.props.children;
  }
}

const LazyExpandedRow = lazy(() => import('../chunks/ExpandedRow_CSsVzNeA.mjs'));
function DesaparecidosTable({
  data,
  renderValue,
  formatCedula
}) {
  const [expandedRow, setExpandedRow] = useState(null);
  const { translate } = useLanguage();
  const toggleRow = (id) => {
    if (id) {
      setExpandedRow((prev) => prev === id ? null : id);
    }
  };
  if (data.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-4", children: translate("Component-S") });
  }
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { className: "w-[25%] text-center", children: translate("List-Title-ID") }),
      /* @__PURE__ */ jsx(TableHead, { className: "w-[50%] text-center", children: translate("List-Title-Name") }),
      /* @__PURE__ */ jsx(TableHead, { className: "w-[20%] text-center", children: translate("List-Title-Location") }),
      /* @__PURE__ */ jsx(TableHead, { className: "w-[5%]" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: data.map((item, index) => {
      const itemKey = item._id && item._id.trim() !== "" ? item._id : item.cedula || `row-fallback-${index}`;
      if (!item._id || item._id.trim() === "") {
        console.warn(`DesaparecidosTable: Item at index ${index} has empty/null _id, using fallback key:`, itemKey);
      }
      return /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
        /* @__PURE__ */ jsxs(
          TableRow,
          {
            className: "cursor-pointer",
            onClick: () => toggleRow(item._id),
            children: [
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: formatCedula(item) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: renderValue(item.nombre) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: renderValue(item.estado) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: (e) => {
                    e.stopPropagation();
                    toggleRow(item._id);
                  },
                  "aria-controls": `row-${item._id || item.cedula}`,
                  "aria-expanded": expandedRow === item._id,
                  "aria-label": translate("Info-Details", { name: item.nombre }),
                  children: expandedRow === item._id ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
                }
              ) })
            ]
          }
        ),
        expandedRow === item._id && /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, children: translate("Process2") }) }), children: /* @__PURE__ */ jsx(
          LazyExpandedRow,
          {
            item,
            getAgeStage: (edad) => getAgeStage(edad, translate),
            getLegalCondition: (edad) => getLegalCondition(edad, translate),
            renderValue
          }
        ) })
      ] }, itemKey);
    }) })
  ] }) });
}

const queryClient = new QueryClient();
function SearchEngineContent({ initialSearchTerm = "", focusSearchInput = false }) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchField, setSearchField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { translate } = useLanguage();
  const {
    data: allDesaparecidos,
    isLoading,
    isError
  } = useFetchData("aprobado");
  const filteredDesaparecidos = useFilteredData(allDesaparecidos, searchTerm, searchField);
  const totalPages = Math.ceil((filteredDesaparecidos?.length || 0) / itemsPerPage);
  const paginatedDesaparecidos = filteredDesaparecidos?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];
  const detectSearchField = useCallback((value) => {
    if (!value.trim()) return "";
    if (/^[\d.]+$/.test(value.trim())) {
      return "cedula";
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim()) || /^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(value.trim())) {
      return "fecha";
    }
    return "";
  }, []);
  const handleSearchTermChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (!searchField || searchField === "") {
      const detectedField = detectSearchField(value);
      if (detectedField && detectedField !== searchField) {
        setSearchField(detectedField);
      }
    }
  }, [searchField, detectSearchField]);
  const handleSearchFieldSelect = useCallback((value) => {
    setSearchField(value);
    setCurrentPage(1);
  }, []);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  const handleItemsPerPageChange = useCallback((items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);
  return /* @__PURE__ */ jsx("div", { id: "motor-busqueda", className: "bg-background py-8 scroll-mt-20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-4 text-center", children: translate("Component-1") }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-4 mb-8", children: /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 flex flex-col md:flex-row gap-4", children: [
      /* @__PURE__ */ jsx(
        SearchBar,
        {
          initialSearchTerm: searchTerm,
          onSearchTermChange: handleSearchTermChange,
          focusSearchInput
        }
      ),
      /* @__PURE__ */ jsx(
        SearchFieldSelector,
        {
          searchField,
          onSearchFieldSelect: handleSearchFieldSelect
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "text-center", children: translate("Process1") }), children: isLoading ? /* @__PURE__ */ jsx("div", { className: "text-center", children: translate("Process1") }) : isError ? /* @__PURE__ */ jsx("div", { className: "text-red-500 text-center", children: translate("Error") }) : filteredDesaparecidos && filteredDesaparecidos.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-6 text-center", children: translate("Component-2") }),
      /* @__PURE__ */ jsxs("div", { className: "w-full md:max-w-[85%] mx-auto", children: [
        /* @__PURE__ */ jsx(
          Pagination,
          {
            itemsPerPage,
            onItemsPerPageChange: handleItemsPerPageChange
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto mt-6", children: /* @__PURE__ */ jsx(
          DesaparecidosTable,
          {
            data: paginatedDesaparecidos,
            renderValue,
            formatCedula,
            getAgeStage,
            getLegalCondition
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full md:max-w-[85%] mx-auto mt-6", children: /* @__PURE__ */ jsx(
        Pagination,
        {
          currentPage,
          totalPages,
          onPageChange: handlePageChange
        }
      ) })
    ] }) : /* @__PURE__ */ jsx("div", { className: "text-center py-4", children: translate("Component-S") }) }) })
  ] }) });
}
function MotorDeBusqueda(props) {
  return /* @__PURE__ */ jsx(UniversalErrorBoundary, { componentName: "Motor de Búsqueda", children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(SearchEngineContent, { ...props }) }) }) });
}

function TweetCarouselContent({ autoScrollInterval = 5e3 }) {
  const { translate } = useLanguage();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch("/api/tweets?type=project&count=10");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setTweets(data);
        setError(null);
      } catch (err) {
        setError(translate("Tweets-Error"));
        console.error("Error fetching tweets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
  }, []);
  useEffect(() => {
    if (tweets.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tweets.length);
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [tweets.length, autoScrollInterval, isPaused]);
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tweets.length) % tweets.length);
  };
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tweets.length);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "w-full py-8 bg-secondary border-y border-border theme-transition", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: translate("Tweets-Loading") })
    ] }) }) });
  }
  if (error || tweets.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "w-full py-8 bg-secondary border-y border-border overflow-hidden theme-transition",
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => setIsPaused(false),
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground mb-6 text-center", style: { fontFamily: "'Playfair Display', serif" }, children: translate("Tweets-Title") }),
        /* @__PURE__ */ jsxs("div", { className: "relative", ref: carouselRef, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: goToPrev,
              className: "absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card rounded-full shadow-lg hover:bg-accent transition-colors border border-border",
              "aria-label": "Tweet anterior",
              children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden mx-10", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex transition-transform duration-500 ease-in-out",
              style: { transform: `translateX(-${currentIndex * 100}%)` },
              children: tweets.map((tweet) => /* @__PURE__ */ jsx("div", { className: "w-full flex-shrink-0 px-4", children: /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `https://twitter.com/${tweet.author?.username}/status/${tweet.id}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "block bg-card rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow border border-border",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                      tweet.author?.profileImage && /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: tweet.author.profileImage,
                          alt: tweet.author.name,
                          className: "w-10 h-10 rounded-full"
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                        /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground text-sm", children: tweet.author?.name }),
                        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-xs", children: [
                          "@",
                          tweet.author?.username,
                          " · ",
                          tweet.formattedDate
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-blue-400", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm line-clamp-3", children: tweet.text }),
                    tweet.metrics && /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-3 text-muted-foreground text-xs", children: [
                      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }),
                        tweet.metrics.reply_count
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
                        tweet.metrics.retweet_count
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }) }),
                        tweet.metrics.like_count
                      ] })
                    ] })
                  ]
                }
              ) }, tweet.id))
            }
          ) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: goToNext,
              className: "absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card rounded-full shadow-lg hover:bg-accent transition-colors border border-border",
              "aria-label": "Tweet siguiente",
              children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mt-4", children: tweets.map((_, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => goToSlide(index),
            className: `w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`,
            "aria-label": `Ir al tweet ${index + 1}`
          },
          index
        )) })
      ] })
    }
  );
}
function TweetCarousel() {
  return /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(TweetCarouselContent, {}) });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "No M\xE1s Secuestros" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex flex-col theme-transition"> <main class="flex-grow"> ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "InfoSection", $$InfoSection, {})} <!-- Motor de búsqueda: crítico, carga inmediata --> ${renderComponent($$result2, "MotorDeBusqueda", MotorDeBusqueda, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/MotorDeBusqueda.tsx", "client:component-export": "default" })} <!-- Carrusel de tweets: no crítico, carga cuando el navegador esté inactivo --> ${renderComponent($$result2, "TweetCarousel", TweetCarousel, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/components/TweetCarousel.tsx", "client:component-export": "default" })} </main> </div> ` })}`;
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/pages/index.astro", void 0);

const $$file = "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
