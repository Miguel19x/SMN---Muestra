import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D0FKrmaD.mjs';
import { u as useTranslation, $ as $$Layout } from '../chunks/i18n_BgOPVVWt.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useCallback, useEffect } from 'react';
/* empty css                                      */
export { renderers } from '../renderers.mjs';

function Archivados() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const fetchArchived = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/inventario?estado_registro=archivado");
      if (!res.ok) throw new Error("Error al cargar archivados");
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchArchived();
  }, [fetchArchived]);
  const handleRestore = async (id) => {
    if (!confirm(t("Archive-RestoreConfirm"))) return;
    setRestoringId(id);
    try {
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
      const res = await fetch(`/api/inventario/${id}/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: `Bearer ${token}` } : {}
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al restaurar");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al restaurar");
    } finally {
      setRestoringId(null);
    }
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-VE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center py-20", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-white" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-400 text-lg", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchArchived,
          className: "mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors",
          children: "Reintentar"
        }
      )
    ] });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsx("svg", { className: "mx-auto h-16 w-16 text-gray-400 mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        }
      ) }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-lg font-medium", children: t("Archive-Empty") }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-2", children: t("Archive-EmptyDesc") })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 text-center", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        }
      ) }),
      items.length,
      " ",
      items.length === 1 ? t("Archive-CountSingular") : t("Archive-CountPlural")
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: items.map((item) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "group bg-slate-100/95 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-2xl border border-transparent hover:border-amber-400/30 transition-all duration-300 overflow-hidden",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-5 pb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-800 dark:text-gray-100 truncate", children: item.nombre }),
                item.codigo && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 font-mono mt-0.5", children: item.codigo })
              ] }),
              item.categoria && /* @__PURE__ */ jsx("span", { className: "shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300", children: item.categoria })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1.5", children: [
              item.tipo_objeto && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300", children: [
                /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 shrink-0 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }) }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: item.tipo_objeto })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300", children: [
                /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 shrink-0 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
                /* @__PURE__ */ jsxs("span", { children: [
                  t("Archive-ArchivedOn"),
                  ": ",
                  /* @__PURE__ */ jsx("strong", { children: formatDate(item.fecha_archivado) })
                ] })
              ] }),
              item.fecha_registro && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400", children: [
                /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5 shrink-0 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
                /* @__PURE__ */ jsxs("span", { children: [
                  t("Archive-RegisteredOn"),
                  ": ",
                  formatDate(item.fecha_registro)
                ] })
              ] })
            ] })
          ] }),
          item.motivo_archivado && /* @__PURE__ */ jsxs("div", { className: "mx-5 mb-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-300 font-medium mb-0.5", children: [
              t("Archive-Reason"),
              ":"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-800 dark:text-amber-200", children: item.motivo_archivado })
          ] }),
          expandedId === item.id && /* @__PURE__ */ jsxs("div", { className: "mx-5 mb-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 space-y-2 text-sm animate-fadeIn", children: [
            item.condicion && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-gray-500 dark:text-gray-400", children: [
                t("Archive-Condition"),
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-200", children: item.condicion })
            ] }),
            item.estado_conservacion && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-gray-500 dark:text-gray-400", children: [
                t("Archive-Conservation"),
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-200", children: item.estado_conservacion })
            ] }),
            item.ubicacion_actual && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-gray-500 dark:text-gray-400", children: [
                t("Archive-CurrentLocation"),
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-200", children: item.ubicacion_actual })
            ] }),
            item.ultimo_lugar_conocido && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-gray-500 dark:text-gray-400", children: [
                t("Archive-LastLocation"),
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-200", children: item.ultimo_lugar_conocido })
            ] }),
            item.pais_origen && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-gray-500 dark:text-gray-400", children: [
                t("Archive-Origin"),
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-200", children: item.pais_origen })
            ] }),
            item.antiguedad !== void 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-gray-500 dark:text-gray-400", children: [
                t("Archive-Age"),
                ":"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-200", children: item.antiguedad })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-5 pb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setExpandedId(expandedId === item.id ? null : item.id),
                className: "flex-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors",
                children: expandedId === item.id ? t("Archive-ShowLess") : t("Archive-ShowMore")
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleRestore(item.id),
                disabled: restoringId === item.id,
                className: "flex-1 px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                children: restoringId === item.id ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", children: [
                    /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
                    /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
                  ] }),
                  "..."
                ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }),
                  t("Archive-Restore")
                ] })
              }
            )
          ] })
        ]
      },
      item.id
    )) })
  ] });
}

const $$Archivados = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "DataTracker - Archivados" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen relative"> <!-- Background image and overlay removed, replaced with a single background div --> <div class="absolute inset-0 bg-cover bg-center bg-fixed" style="background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%);"></div> <!-- Content layer --> <div class="relative z-10 flex flex-col items-center justify-center min-h-[50vh] px-4 sm:px-6 py-12 sm:py-16"> <!-- Header Section --> <header class="py-12 lg:py-16 text-center px-4"> <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 drop-shadow-lg" style="font-family: 'Playfair Display', serif;" data-i18n="Title-2">
ARCHIVADOS
</h1> <!-- Accent Bar --> <div class="flex justify-center"> <div class="accent-bar w-40 sm:w-56 md:w-72"></div> </div> <p class="mt-4 sm:mt-6 text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium px-4 sm:px-0" data-i18n="Phrase-2" style="font-family: 'Inter', sans-serif;">
Registro histórico de objetos dados de baja
</p> </header> <!-- Cards Grid --> <main class="container mx-auto px-4 pb-12"> ${renderComponent($$result2, "Archivadoss", Archivados, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/Archivados.tsx", "client:component-export": "default" })} </main> </div> </div> ` })}`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/archivados.astro", void 0);

const $$file = "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/archivados.astro";
const $$url = "/archivados";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Archivados,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
