import { e as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate, f as createAstro, k as renderComponent } from '../chunks/astro/server_D0FKrmaD.mjs';
import { a as useLanguage, L as LanguageProvider, $ as $$Layout } from '../chunks/i18n_BgOPVVWt.mjs';
import 'clsx';
/* empty css                                 */
import { jsx, jsxs } from 'react/jsx-runtime';
import React__default, { Component, lazy, useState, Suspense, useCallback, useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, r as getCondicionEstado, s as getAntiguedadStage, u as useFetchData, o as useFilteredData, p as SearchBar, q as SearchFieldSelector, E as ErrorBoundary, P as Pagination, t as formatCodigo, v as renderValue } from '../chunks/Pagination_Biy3-Yvx.mjs';
import { B as Button } from '../chunks/input_DaDLUbK_.mjs';
import { ChevronUp, ChevronDown } from 'lucide-react';
/* empty css                                      */
export { renderers } from '../renderers.mjs';

const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="hero-gradient flex flex-col items-center justify-center px-3 sm:px-4 theme-transition relative" style="height: calc(100vh - 4rem); min-height: 400px;" data-astro-cid-hpnw4vwy> <div class="text-center max-w-4xl mx-auto w-full flex flex-col items-center justify-center flex-1" data-astro-cid-hpnw4vwy> <!-- Typewriter Title --> <h1 id="changing-title" class="changing-title text-gray-200 font-back text-center drop-shadow-lg px-2" data-i18n="Title-1" data-astro-cid-hpnw4vwy>
DATATRACKER
</h1> <!-- Accent Bar --> <div class="flex justify-center" data-astro-cid-hpnw4vwy> <div class="accent-bar w-40 sm:w-56 md:w-72" data-astro-cid-hpnw4vwy></div> </div> <!-- Phrase --> <p class="mt-4 sm:mt-6 text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium px-4 sm:px-0" data-i18n="Phrase-1" style="font-family: 'Inter', sans-serif;" data-astro-cid-hpnw4vwy>
La plataforma inteligente de inventario
</p> </div> <!-- Scroll Indicator --> <div class="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 scroll-indicator flex flex-col items-center justify-center flex-1" data-astro-cid-hpnw4vwy> <span data-i18n="Move-Mouse" class="text-center text-[10px] uppercase tracking-widest text-gray-800 dark:text-gray-300 mb-2 opacity-70 font-medium" data-astro-cid-hpnw4vwy>
Explorar
</span> <!-- Mobile: Chevron arrow --> <svg class="w-8 h-8 text-gray-800 dark:text-gray-300 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-hpnw4vwy> <polyline points="6 9 12 15 18 9" data-astro-cid-hpnw4vwy></polyline> </svg> <!-- Desktop: Mouse --> <div class="hidden sm:flex w-6 h-10 border-2 border-gray-800 dark:border-gray-300 rounded-full items-start justify-center p-1" data-astro-cid-hpnw4vwy> <div class="w-1.5 h-2.5 bg-gray-800 dark:bg-gray-300 rounded-full" data-astro-cid-hpnw4vwy></div> </div> </div> </section> ${renderScript($$result, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/header.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/header.astro", void 0);

const $$Astro = createAstro();
const $$InfoSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$InfoSection;
  Astro2.cookies.get("NEXT_LOCALE")?.value || "es";
  return renderTemplate`${maybeRenderHead()}<section class="py-10 sm:py-16 px-4 sm:px-6 bg-background theme-transition" data-astro-cid-bsieafsl> <div class="container mx-auto max-w-5xl" data-astro-cid-bsieafsl> <!-- Title --> <h2 class="text-2xl sm:text-3xl font-bold text-center mb-12" style="font-family: 'Playfair Display', serif;" data-i18n="How-It-Works" data-astro-cid-bsieafsl>
Cómo Funciona
</h2> <!-- 3-step horizontal flow --> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12" data-astro-cid-bsieafsl> <!-- Step 1: Register --> <article class="text-center" data-astro-cid-bsieafsl> <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center" data-astro-cid-bsieafsl> <span class="text-3xl font-bold text-primary" data-astro-cid-bsieafsl>1</span> </div> <h3 class="font-display text-xl font-semibold text-foreground mb-3" data-i18n="Step-1-Title" style="font-family: 'Playfair Display', serif;" data-astro-cid-bsieafsl>
Registra
</h3> <div class="accent-bar-small w-16 mx-auto mb-3" data-astro-cid-bsieafsl></div> <p class="text-muted-foreground leading-relaxed text-sm" data-i18n="Step-1-Desc" style="font-family: 'Inter', sans-serif;" data-astro-cid-bsieafsl>
Añade nuevos objetos al inventario con información
                    detallada: código, categoría, origen, ubicación y más.
</p> </article> <!-- Step 2: Organize --> <article class="text-center" data-astro-cid-bsieafsl> <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center" data-astro-cid-bsieafsl> <span class="text-3xl font-bold text-primary" data-astro-cid-bsieafsl>2</span> </div> <h3 class="font-display text-xl font-semibold text-foreground mb-3" data-i18n="Step-2-Title" style="font-family: 'Playfair Display', serif;" data-astro-cid-bsieafsl>
Organiza
</h3> <div class="accent-bar-small w-16 mx-auto mb-3" data-astro-cid-bsieafsl></div> <p class="text-muted-foreground leading-relaxed text-sm" data-i18n="Step-2-Desc" style="font-family: 'Inter', sans-serif;" data-astro-cid-bsieafsl>
Busca y filtra por cualquier campo. El sistema detecta
                    automáticamente el tipo de búsqueda y ofrece paginación.
</p> </article> <!-- Step 3: Analyze --> <article class="text-center" data-astro-cid-bsieafsl> <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center" data-astro-cid-bsieafsl> <span class="text-3xl font-bold text-primary" data-astro-cid-bsieafsl>3</span> </div> <h3 class="font-display text-xl font-semibold text-foreground mb-3" data-i18n="Step-3-Title" style="font-family: 'Playfair Display', serif;" data-astro-cid-bsieafsl>
Analiza
</h3> <div class="accent-bar-small w-16 mx-auto mb-3" data-astro-cid-bsieafsl></div> <p class="text-muted-foreground leading-relaxed text-sm" data-i18n="Step-3-Desc" style="font-family: 'Inter', sans-serif;" data-astro-cid-bsieafsl>
Visualiza estadísticas con gráficos interactivos y genera
                    informes profesionales en PDF con análisis detallado.
</p> </article> </div> <!-- Arrow indicator to analytics --> <div class="flex flex-col items-center mt-12 sm:mt-16" data-astro-cid-bsieafsl> <a href="/estadisticas" class="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="Ver analíticas" data-astro-cid-bsieafsl> <span class="text-sm mb-2" data-i18n="View-Analytics" data-astro-cid-bsieafsl>Ver Analíticas</span> <svg class="w-6 h-6 sm:w-8 sm:h-8 arrow-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-bsieafsl> <polyline points="6 9 12 15 18 9" data-astro-cid-bsieafsl></polyline> </svg> </a> </div> </div> </section>`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/InfoSection.astro", void 0);

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

const LazyExpandedRow = lazy(() => import('../chunks/ExpandedRow_Y3fTYiQ2.mjs'));
function ObjetosTable({
  data,
  renderValue,
  formatCodigo
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
      const itemKey = item.id && item.id.trim() !== "" ? item.id : item.codigo || `row-fallback-${index}`;
      if (!item.id || item.id.trim() === "") {
        console.warn(`ObjetosTable: Item at index ${index} has empty/null id, using fallback key:`, itemKey);
      }
      return /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
        /* @__PURE__ */ jsxs(
          TableRow,
          {
            className: "cursor-pointer",
            onClick: () => toggleRow(item.id),
            children: [
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: formatCodigo(item) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: renderValue(item.nombre) }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: renderValue(item.estado) }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: (e) => {
                    e.stopPropagation();
                    toggleRow(item.id);
                  },
                  "aria-controls": `row-${item.id || item.codigo}`,
                  "aria-expanded": expandedRow === item.id,
                  "aria-label": translate("Info-Details", { name: item.nombre }),
                  children: expandedRow === item.id ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
                }
              ) })
            ]
          }
        ),
        expandedRow === item.id && /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, children: translate("Process2") }) }), children: /* @__PURE__ */ jsx(
          LazyExpandedRow,
          {
            item,
            getAntiguedadStage: (antiguedad) => getAntiguedadStage(antiguedad, translate),
            getCondicionEstado: (antiguedad) => getCondicionEstado(antiguedad, translate),
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
    data: allObjetos,
    isLoading,
    isError
  } = useFetchData("aprobado");
  const filteredObjetos = useFilteredData(allObjetos, searchTerm, searchField);
  const totalPages = Math.ceil((filteredObjetos?.length || 0) / itemsPerPage);
  const paginatedObjetos = filteredObjetos?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];
  const detectSearchField = useCallback((value) => {
    if (!value.trim()) return "";
    if (/^[A-Za-z0-9\-]+$/.test(value.trim()) && value.includes("-")) {
      return "codigo";
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value.trim()) || /^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(value.trim())) {
      return "fecha_registro";
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
    /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "text-center", children: translate("Process1") }), children: isLoading ? /* @__PURE__ */ jsx("div", { className: "text-center", children: translate("Process1") }) : isError ? /* @__PURE__ */ jsx("div", { className: "text-red-500 text-center", children: translate("Error") }) : filteredObjetos && filteredObjetos.length > 0 ? /* @__PURE__ */ jsxs("div", { children: [
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
          ObjetosTable,
          {
            data: paginatedObjetos,
            renderValue,
            formatCodigo,
            getAntiguedadStage,
            getCondicionEstado
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

const features = [
  {
    id: "search",
    icon: "🔍",
    titleKey: "Feature-Search-Title",
    descKey: "Feature-Search-Desc",
    tags: ["Real-time", "Auto-detection", "Pagination"]
  },
  {
    id: "analytics",
    icon: "📊",
    titleKey: "Feature-Analytics-Title",
    descKey: "Feature-Analytics-Desc",
    tags: ["Recharts", "PDF Reports", "Statistics"]
  },
  {
    id: "i18n",
    icon: "🌐",
    titleKey: "Feature-I18n-Title",
    descKey: "Feature-I18n-Desc",
    tags: ["ES/EN", "Live Toggle", "Full Coverage"]
  },
  {
    id: "security",
    icon: "🔒",
    titleKey: "Feature-Security-Title",
    descKey: "Feature-Security-Desc",
    tags: ["2FA", "JWT", "Turnstile", "Rate Limiting"]
  },
  {
    id: "responsive",
    icon: "📱",
    titleKey: "Feature-Responsive-Title",
    descKey: "Feature-Responsive-Desc",
    tags: ["Mobile-first", "Dark Mode", "Smooth Transitions"]
  },
  {
    id: "cloud",
    icon: "☁️",
    titleKey: "Feature-Cloud-Title",
    descKey: "Feature-Cloud-Desc",
    tags: ["MongoDB", "R2", "Vercel", "Redis"]
  }
];
function FeatureShowcaseContent({ autoScrollInterval = 5e3 }) {
  const { translate } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  useEffect(() => {
    if (features.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [autoScrollInterval, isPaused]);
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "w-full py-8 bg-secondary border-y border-border overflow-hidden theme-transition",
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => setIsPaused(false),
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground mb-6 text-center", style: { fontFamily: "'Playfair Display', serif" }, children: translate("Features-Title") }),
        /* @__PURE__ */ jsxs("div", { className: "relative", ref: carouselRef, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: goToPrev,
              className: "absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card rounded-full shadow-lg hover:bg-accent transition-colors border border-border",
              "aria-label": "Previous feature",
              children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden mx-10", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex transition-transform duration-500 ease-in-out",
              style: { transform: `translateX(-${currentIndex * 100}%)` },
              children: features.map((feature) => /* @__PURE__ */ jsx("div", { className: "w-full flex-shrink-0 px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl shadow-lg p-6 border border-border", children: [
                /* @__PURE__ */ jsx("div", { className: "text-5xl mb-4 text-center", children: feature.icon }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground mb-3 text-center", children: translate(feature.titleKey) }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm text-center mb-4", children: translate(feature.descKey) }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: feature.tags.map((tag) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "px-2 py-1 text-xs bg-primary/10 text-primary rounded-md",
                    children: tag
                  },
                  tag
                )) })
              ] }) }, feature.id))
            }
          ) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: goToNext,
              className: "absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-card rounded-full shadow-lg hover:bg-accent transition-colors border border-border",
              "aria-label": "Next feature",
              children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mt-4", children: features.map((_, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => goToSlide(index),
            className: `w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`,
            "aria-label": `Go to feature ${index + 1}`
          },
          index
        )) })
      ] })
    }
  );
}
function FeatureShowcase() {
  return /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(FeatureShowcaseContent, {}) });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "DataTracker" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex flex-col theme-transition"> <main class="flex-grow"> ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "InfoSection", $$InfoSection, {})} <!-- Motor de búsqueda: crítico, carga inmediata --> ${renderComponent($$result2, "MotorDeBusqueda", MotorDeBusqueda, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/MotorDeBusqueda.tsx", "client:component-export": "default" })} <!-- Feature Showcase: no crítico, carga cuando el navegador esté inactivo --> ${renderComponent($$result2, "FeatureShowcase", FeatureShowcase, { "client:idle": true, "client:component-hydration": "idle", "client:component-path": "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/FeatureShowcase.tsx", "client:component-export": "default" })} </main> </div> ` })}`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/index.astro", void 0);

const $$file = "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
