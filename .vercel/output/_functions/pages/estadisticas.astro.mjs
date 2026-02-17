import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D0FKrmaD.mjs';
import { a as useLanguage, L as LanguageProvider, $ as $$Layout } from '../chunks/i18n_BgOPVVWt.mjs';
/* empty css                                      */
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Users, Camera, Baby, AlertTriangle, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Sector, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { c as categorizarProfesion } from '../chunks/professionCategorizer_Bsh3D5TZ.mjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export { renderers } from '../renderers.mjs';

function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  className = ""
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `bg-card border border-border rounded-xl p-4 sm:p-6 stats-fade-in flex flex-col gap-2 ${className}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs sm:text-sm font-medium uppercase tracking-wide", children: title }),
          /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 text-muted-foreground", strokeWidth: 1.5 })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-bold text-foreground", children: value }),
        description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: description })
      ]
    }
  );
}

const STATS_COLORS = {
  primary: "#1e3a5f",
  // Institutional Blue
  critical: "#be123c",
  // Rose (desaturated red)
  neutral: "#64748b",
  // Slate
  secondary: "#0e7490",
  // Cyan Dark
  gray1: "#475569",
  gray2: "#6b7280",
  gray3: "#334155",
  muted: "#94a3b8"
  // Gray for labels
};
function useStripRechartsGTabIndex() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const strip = () => {
      root.querySelectorAll("[tabindex]").forEach((el) => el.removeAttribute("tabindex"));
      root.querySelectorAll("svg").forEach((svg) => {
        svg.setAttribute("focusable", "false");
        svg.style.outline = "none";
      });
      root.querySelectorAll("g, path, rect, circle, sector").forEach((el) => {
        el.style.outline = "none";
        el.style.boxShadow = "none";
      });
    };
    strip();
    const observer = new MutationObserver(() => strip());
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["tabindex"]
    });
    return () => observer.disconnect();
  }, []);
  return ref;
}
const CHART_PALETTE = [
  STATS_COLORS.primary,
  STATS_COLORS.critical,
  STATS_COLORS.secondary,
  STATS_COLORS.neutral,
  STATS_COLORS.gray1,
  STATS_COLORS.gray2,
  STATS_COLORS.gray3
];
const EnhancedTooltip = ({ active, payload, label, total, isMobile }) => {
  const { translate } = useLanguage();
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0].value;
  const name = label || payload[0].name;
  const percentage = total ? (value / total * 100).toFixed(1) : null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `bg-card border border-primary/20 rounded-md shadow-xl backdrop-blur-sm ${isMobile ? "p-1.5 max-w-[140px]" : "p-3 max-w-[200px]"}`,
      style: { pointerEvents: "none" },
      children: [
        /* @__PURE__ */ jsx("p", { className: `font-semibold text-foreground mb-1 truncate leading-tight ${isMobile ? "text-[10px]" : "text-[13px]"}`, children: name }),
        /* @__PURE__ */ jsxs("div", { className: `flex items-center ${isMobile ? "gap-1.5" : "gap-2"}`, children: [
          /* @__PURE__ */ jsx("span", { className: `font-bold text-primary ${isMobile ? "text-sm" : "text-xl"}`, children: value }),
          /* @__PURE__ */ jsx("span", { className: `text-muted-foreground ${isMobile ? "text-[9px]" : "text-[11px]"}`, children: translate("Chart-Cases") })
        ] }),
        percentage && /* @__PURE__ */ jsxs("p", { className: `text-muted-foreground mt-1 font-medium leading-tight ${isMobile ? "text-[9px]" : "text-[11px]"}`, children: [
          percentage,
          "% ",
          translate("Chart-Of-Total")
        ] })
      ]
    }
  );
};
function ChartCard({
  title,
  children,
  className = "",
  fullWidth = false
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `bg-card border border-border rounded-xl p-4 sm:p-6 stats-fade-in ${fullWidth ? "col-span-1 md:col-span-2" : ""} ${className}`,
      children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-base sm:text-lg font-semibold text-foreground mb-4", style: { fontFamily: "'Playfair Display', serif" }, children: title }),
        children
      ]
    }
  );
}
const CustomXAxisTick = ({ x, y, payload }) => {
  const maxLength = 12;
  const text = payload.value || "";
  const truncated = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  return /* @__PURE__ */ jsx("g", { transform: `translate(${x},${y})`, children: /* @__PURE__ */ jsx(
    "text",
    {
      x: 0,
      y: 0,
      dx: -8,
      dy: 10,
      textAnchor: "end",
      fill: "#94a3b8",
      fontSize: 8,
      transform: "rotate(-35)",
      style: { fontFamily: "system-ui, sans-serif" },
      children: truncated
    }
  ) });
};
function StatsBarChart({
  data,
  height = 250,
  color = STATS_COLORS.primary
}) {
  const { translate } = useLanguage();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedItem = selectedIndex !== null ? data[selectedIndex] : null;
  const selectedPercent = useMemo(() => {
    if (!selectedItem || total === 0) return null;
    return (selectedItem.value / total * 100).toFixed(1);
  }, [selectedItem, total]);
  const containerRef = useStripRechartsGTabIndex();
  return /* @__PURE__ */ jsxs("div", { className: "w-full", ref: containerRef, children: [
    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(
      BarChart,
      {
        data,
        margin: { top: 20, right: 10, left: 0, bottom: 50 },
        accessibilityLayer: true,
        children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#334155", vertical: false }),
          /* @__PURE__ */ jsx(
            XAxis,
            {
              dataKey: "name",
              tick: /* @__PURE__ */ jsx(CustomXAxisTick, {}),
              tickLine: false,
              axisLine: { stroke: "#334155" },
              interval: 0,
              height: 45
            }
          ),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              tick: { fill: STATS_COLORS.muted, fontSize: 11 },
              tickLine: false,
              axisLine: false,
              width: 35
            }
          ),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              allowEscapeViewBox: { x: true, y: true },
              content: /* @__PURE__ */ jsx(EnhancedTooltip, { total, isMobile: typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches }),
              cursor: { fill: "rgba(100, 116, 139, 0.1)" },
              wrapperStyle: { zIndex: 50, pointerEvents: "none" },
              offset: 12
            }
          ),
          /* @__PURE__ */ jsx(
            Bar,
            {
              dataKey: "value",
              fill: color,
              stroke: "transparent",
              strokeWidth: 0,
              radius: [4, 4, 0, 0],
              isAnimationActive: false,
              onClick: (_, index) => {
                if (typeof index !== "number") return;
                setSelectedIndex((prev) => prev === index ? null : index);
              },
              children: data.map((_, index) => /* @__PURE__ */ jsx(
                Cell,
                {
                  fill: selectedIndex === index ? STATS_COLORS.secondary : color
                },
                `cell-${index}`
              ))
            }
          )
        ]
      }
    ) }),
    selectedItem && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: selectedItem.name }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-primary", children: selectedItem.value })
      ] }),
      selectedPercent && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
        selectedPercent,
        "% ",
        translate("Chart-Of-Total")
      ] })
    ] })
  ] });
}
function StatsDonutChart({
  data,
  height = 200,
  colors = CHART_PALETTE
}) {
  const { translate } = useLanguage();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedItem = selectedIndex !== null ? data[selectedIndex] : null;
  const selectedPercent = useMemo(() => {
    if (!selectedItem || total === 0) return null;
    return (selectedItem.value / total * 100).toFixed(1);
  }, [selectedItem, total]);
  const containerRef = useStripRechartsGTabIndex();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const renderPieShape = useCallback((props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      index
    } = props;
    const isSelected = typeof index === "number" && index === selectedIndexRef.current;
    return /* @__PURE__ */ jsx(
      Sector,
      {
        cx,
        cy,
        innerRadius,
        outerRadius: isSelected ? outerRadius + 4 : outerRadius,
        startAngle,
        endAngle,
        fill,
        stroke: "none"
      }
    );
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "w-full", ref: containerRef, children: [
    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(PieChart, { accessibilityLayer: true, margin: { top: 0, right: isMobile ? 45 : 35, left: isMobile ? 45 : 35, bottom: 0 }, children: [
      /* @__PURE__ */ jsx(
        Pie,
        {
          data,
          cx: "50%",
          cy: "50%",
          innerRadius: 45,
          outerRadius: 70,
          paddingAngle: 2,
          dataKey: "value",
          shape: renderPieShape,
          isAnimationActive: false,
          onClick: (_, index) => {
            if (typeof index !== "number") return;
            setSelectedIndex((prev) => prev === index ? null : index);
          },
          stroke: "transparent",
          strokeWidth: 0,
          label: ({ name, value }) => {
            const percent = (value / total * 100).toFixed(0);
            return isMobile ? `${percent}%` : `${name}: ${percent}%`;
          },
          labelLine: false,
          children: data.map((_, index) => /* @__PURE__ */ jsx(Cell, { fill: colors[index % colors.length] }, `cell-${index}`))
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          allowEscapeViewBox: { x: true, y: true },
          content: /* @__PURE__ */ jsx(EnhancedTooltip, { total, isMobile }),
          wrapperStyle: { zIndex: 50, pointerEvents: "none" },
          offset: 12
        }
      )
    ] }) }),
    selectedItem && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: selectedItem.name }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-primary", children: selectedItem.value })
      ] }),
      selectedPercent && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
        selectedPercent,
        "% ",
        translate("Chart-Of-Total")
      ] })
    ] })
  ] });
}
function StatsTimelineChart({
  data,
  height = 250
}) {
  const total = data.reduce((sum, item) => sum + item.cases, 0);
  const containerRef = useStripRechartsGTabIndex();
  return /* @__PURE__ */ jsx("div", { ref: containerRef, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(
    AreaChart,
    {
      data,
      margin: { top: 10, right: 10, left: -10, bottom: 0 },
      accessibilityLayer: true,
      children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorCases", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: STATS_COLORS.primary, stopOpacity: 0.3 }),
          /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: STATS_COLORS.primary, stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#334155", strokeOpacity: 0.35, vertical: false, className: "dark:stroke-slate-700" }),
        /* @__PURE__ */ jsx(
          XAxis,
          {
            dataKey: "date",
            tick: { fill: STATS_COLORS.muted, fontSize: 11 },
            tickLine: false,
            axisLine: false
          }
        ),
        /* @__PURE__ */ jsx(
          YAxis,
          {
            tick: { fill: STATS_COLORS.muted, fontSize: 11 },
            tickLine: false,
            axisLine: false
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            allowEscapeViewBox: { x: true, y: true },
            content: /* @__PURE__ */ jsx(EnhancedTooltip, { total, isMobile: typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches }),
            wrapperStyle: { zIndex: 50, pointerEvents: "none" },
            offset: 12
          }
        ),
        /* @__PURE__ */ jsx(
          Area,
          {
            type: "monotone",
            dataKey: "cases",
            stroke: STATS_COLORS.primary,
            strokeWidth: 2,
            fill: "url(#colorCases)",
            isAnimationActive: false
          }
        )
      ]
    }
  ) }) });
}

function calculateMean(data) {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}
function calculateMedian(data) {
  if (data.length === 0) return 0;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}
function calculateMode(data) {
  if (data.length === 0) return null;
  const frequency = /* @__PURE__ */ new Map();
  let maxFreq = 0;
  let mode = null;
  for (const item of data) {
    const count = (frequency.get(item) || 0) + 1;
    frequency.set(item, count);
    if (count > maxFreq) {
      maxFreq = count;
      mode = item;
    }
  }
  return mode;
}
function calculateVariance(data) {
  if (data.length === 0) return 0;
  const mean = calculateMean(data);
  const squaredDiffs = data.map((val) => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((acc, val) => acc + val, 0) / data.length;
}
function calculateStdDev(data) {
  return Math.sqrt(calculateVariance(data));
}
function calculateRange(data) {
  if (data.length === 0) return { min: 0, max: 0, range: 0 };
  const min = Math.min(...data);
  const max = Math.max(...data);
  return { min, max, range: max - min };
}
function calculateCV(data) {
  const mean = calculateMean(data);
  if (mean === 0) return 0;
  const stdDev = calculateStdDev(data);
  return stdDev / mean * 100;
}
function buildFrequencyTable(data) {
  const n = data.length;
  if (n === 0) return [];
  const counts = /* @__PURE__ */ new Map();
  for (const item of data) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  const items = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([value, fi], index, arr) => {
    const hi = fi / n;
    const pi = hi * 100;
    const Fi = arr.slice(0, index + 1).reduce((acc, [, f]) => acc + f, 0);
    return { value, fi, hi, pi, Fi };
  });
  return items;
}
function calculateDescriptiveStats(data) {
  const validData = data.filter((d) => !isNaN(d) && d !== null && d !== void 0);
  if (validData.length === 0) return null;
  const { min, max, range } = calculateRange(validData);
  return {
    count: validData.length,
    mean: calculateMean(validData),
    median: calculateMedian(validData),
    mode: calculateMode(validData),
    min,
    max,
    range,
    variance: calculateVariance(validData),
    stdDev: calculateStdDev(validData),
    cv: calculateCV(validData)
  };
}
function calculateSubgroupPercentage(data, filterFn) {
  if (data.length === 0) return 0;
  const count = data.filter(filterFn).length;
  return count / data.length * 100;
}
function analyzeTemporalTrends(monthlyTrend) {
  if (monthlyTrend.length < 4) return null;
  const recent = monthlyTrend.slice(-3);
  const previous = monthlyTrend.slice(-6, -3);
  const avgRecent = calculateMean(recent.map((m) => m.count));
  const avgPrevious = calculateMean(previous.map((m) => m.count));
  if (avgPrevious === 0) return null;
  const change = (avgRecent - avgPrevious) / avgPrevious * 100;
  if (change > 50) return `Alerta de crecimiento acelerado: Se ha detectado un incremento del ${change.toFixed(1)}% en el promedio de registros del último trimestre respecto al anterior. Este crecimiento acelerado del inventario requiere una revisión de la capacidad de almacenamiento y los procesos logísticos para garantizar una gestión eficiente.`;
  if (change < -50) return `Desaceleración significativa: Se observa una disminución del ${Math.abs(change).toFixed(1)}% en el flujo de registros recientes. Esto podría indicar una estabilización del inventario, una reducción en las adquisiciones, o posibles demoras en los procesos de registro que deben ser verificadas.`;
  return null;
}
function identifyCategoryConcentration(data) {
  const typeA = calculateSubgroupPercentage(data, (d) => d.categoria === "Tipo A");
  const typeB = calculateSubgroupPercentage(data, (d) => d.categoria === "Tipo B");
  if (typeA > 70) return `La categoría Tipo A domina el inventario con un ${typeA.toFixed(1)}% del total, lo que sugiere una concentración excesiva que podría afectar la diversificación del catálogo y la resiliencia operativa ante cambios en la demanda.`;
  if (typeB > 70) return `La categoría Tipo B domina el inventario con un ${typeB.toFixed(1)}% del total. Se recomienda evaluar si esta concentración obedece a una estrategia deliberada o a una deficiencia en la captación de otros tipos de artículos.`;
  if (Math.abs(typeA - typeB) < 10) return `El inventario presenta una distribución equilibrada entre Tipo A (${typeA.toFixed(1)}%) y Tipo B (${typeB.toFixed(1)}%), lo que indica una buena diversificación por categoría.`;
  return null;
}
function generateConclusions(report, rawData = []) {
  const conclusions = [];
  const formatDateSpan = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("es-VE", { year: "numeric", month: "long", day: "numeric" });
  };
  conclusions.push(`Resumen del inventario: El presente informe analiza ${report.totalCases} objetos registrados en el sistema${report.periodStart ? ` desde el ${formatDateSpan(report.periodStart)}` : ""}${report.periodEnd ? ` hasta el ${formatDateSpan(report.periodEnd)}` : ""}. El volumen de datos permite identificar patrones operativos significativos para la optimización de la gestión.`);
  const categoryFinding = identifyCategoryConcentration(rawData);
  if (categoryFinding) {
    conclusions.push(`Distribución por categoría: ${categoryFinding}`);
  }
  const newItemsGroup = report.ageGroups.find((g) => g.label.includes("Nuevos"));
  const oldItemsGroup = report.ageGroups.find((g) => g.label.includes("Antiguos"));
  if (newItemsGroup && oldItemsGroup) {
    if (oldItemsGroup.percentage > 40) {
      conclusions.push(`Envejecimiento del inventario: El ${oldItemsGroup.percentage.toFixed(1)}% de los objetos registrados supera los 10 años de antigüedad (${oldItemsGroup.count} artículos). Se recomienda una auditoría de obsolescencia y un plan de renovación para mantener la calidad y operatividad del inventario.`);
    } else if (newItemsGroup.percentage > 60) {
      conclusions.push(`Inventario renovado: El ${newItemsGroup.percentage.toFixed(1)}% de los artículos tiene menos de 2 años de antigüedad, lo que refleja una política activa de adquisiciones recientes y un inventario en buen estado operativo.`);
    }
  }
  if (report.topProfessions.length > 0) {
    const topSubcat = report.topProfessions[0];
    let subcatText = `Clasificación predominante: La subcategoría "${topSubcat.value}" concentra el ${topSubcat.pi.toFixed(1)}% del inventario total.`;
    if (report.topProfessions.length >= 3) {
      const top3 = report.topProfessions.slice(0, 3);
      const top3Pct = top3.reduce((sum, p) => sum + p.pi, 0);
      subcatText += ` Las tres subcategorías principales (${top3.map((p) => p.value).join(", ")}) representan conjuntamente el ${top3Pct.toFixed(1)}% del inventario.`;
      if (top3Pct > 75) {
        subcatText += ` Esta alta concentración indica una especialización marcada que podría ser una ventaja competitiva o un riesgo de dependencia.`;
      }
    }
    conclusions.push(subcatText);
  }
  if (report.topConfinementLocations.length > 0) {
    const topLoc = report.topConfinementLocations[0];
    const concentrationIndex = topLoc.pi;
    if (concentrationIndex > 30) {
      conclusions.push(`Concentración de almacenamiento: El ${concentrationIndex.toFixed(1)}% del inventario se encuentra en ${topLoc.value}. Esta alta centralización puede representar un riesgo logístico significativo. Se recomienda evaluar una estrategia de distribución para reducir la vulnerabilidad ante eventualidades locales.`);
    } else if (report.topConfinementLocations.length >= 5) {
      conclusions.push(`Distribución geográfica saludable: El inventario se encuentra distribuido en múltiples ubicaciones, con ${topLoc.value} como sede principal (${concentrationIndex.toFixed(1)}%). Esta dispersión reduce riesgos y facilita la logística de distribución regional.`);
    }
  }
  const trendAnalysis = analyzeTemporalTrends(report.monthlyTrend);
  if (trendAnalysis) {
    conclusions.push(trendAnalysis);
  }
  const photoPct = report.casesWithPhoto / report.totalCases * 100;
  const completenessPct = report.casesWithCompleteData / report.totalCases * 100;
  if (photoPct < 50 || completenessPct < 50) {
    conclusions.push(`Calidad de datos: Solo el ${completenessPct.toFixed(1)}% de los registros cuenta con ficha técnica completa y el ${photoPct.toFixed(1)}% con imagen asociada. Se recomienda implementar validaciones más estrictas en el proceso de registro y campañas de actualización de datos para mejorar la trazabilidad del inventario.`);
  } else {
    conclusions.push(`Calidad de datos: El ${completenessPct.toFixed(1)}% de los registros cuenta con ficha completa y el ${photoPct.toFixed(1)}% incluye imagen. Estos indicadores reflejan un proceso de registro robusto y confiable.`);
  }
  conclusions.push(`Recomendaciones operativas: Con base en los patrones identificados en este análisis de ${report.totalCases} objetos, se sugiere: (1) revisar periódicamente la distribución por categoría para mantener un balance óptimo, (2) monitorear las tendencias temporales de registro para anticipar picos de demanda, y (3) fortalecer los procesos de documentación fotográfica para garantizar la trazabilidad completa del inventario.`);
  return conclusions;
}
const normalizeNationality = (nat) => {
  if (!nat) return "No especificada";
  const n = nat.toLowerCase().trim();
  if (n === "nacional" || n === "venezuela" || n === "vzla" || n === "ve" || n === "venezolana") return "Nacional";
  return nat.trim();
};
const normalizeLocation = (loc) => {
  if (!loc) return "";
  const l = loc.toLowerCase().trim();
  if (l.includes("saliendo") || l.includes("ingresando") || l.includes("camino a") || l.includes("cerca de") || l.includes("frente a") || l.length > 80) {
    if (l.includes("pnb") && l.includes("barcelona")) return "Barcelona (Anzoátegui) - PNB";
    if (l.includes("barcelona")) return "C.P. Agroproductivo Barcelona (Anzoátegui)";
    return "";
  }
  if (l.includes("helicoide")) return "El Helicoide (SEBIN - Caracas)";
  if (l.includes("dgcim") && l.includes("boleita")) return "DGCIM Boleíta (Zona 7 - Caracas)";
  if (l.includes("zona 7") || l.includes("pnb") && l.includes("boleíta")) return "DGCIM Boleíta (Zona 7 - Caracas)";
  if (l.includes("la tumba")) return "La Tumba (SEBIN - Plaza Venezuela)";
  if (l.includes("sebin") && l.includes("maracaibo")) return "SEBIN Maracaibo (Zulia)";
  if (l.includes("sebin") && l.includes("naguanagua")) return "SEBIN Naguanagua (Carabobo)";
  if (l.includes("sebin") && l.includes("caroní") || l.includes("sebin") && l.includes("caroni")) return "SEBIN Caroní (Bolívar)";
  if (l.includes("tocuyito") || l.includes("internado") && l.includes("carabobo")) {
    return "Internado Judicial Carabobo - Tocuyito (Valencia)";
  }
  if (l.includes("hombre nuevo") && l.includes("libertador")) return 'C.P. Hombre Nuevo "El Libertador" - Tocuyito (Carabobo)';
  if (l.includes("tocorón") || l.includes("tocoron")) return "C.P. Tocorón (Aragua)";
  if (l.includes("alayón") || l.includes("alayon")) return "Retén de Alayón - Maracay (Aragua)";
  if (l.includes("ramo verde")) return "C.P. Ramo Verde - Los Teques (Miranda)";
  if (l.includes("yare")) return "C.P. Yare I, II y III - San Fco. de Yare (Miranda)";
  if (l.includes("rodeo")) return "C.P. El Rodeo - Guatire (Miranda)";
  if (l.includes("inof") && l.includes("mujeres")) return "INOF (Mujeres) - Los Teques (Miranda)";
  if (l.includes("cenaprofemil") || l.includes("cenaprof")) return "CENAPROFEMIL - Los Teques (Miranda)";
  if (l.includes("uribana") || l.includes("david viloria")) return "C.P. David Viloria - Uribana (Lara)";
  if (l.includes("fénix") || l.includes("fenix")) return "Fénix Lara - Barquisimeto (Lara)";
  if (l.includes("sabaneta")) return "Cárcel de Sabaneta - Maracaibo (Zulia)";
  if (l.includes("santa ana") || l.includes("cpo") || l.includes("occidente")) {
    return "C.P. de Occidente (CPO) - Santa Ana (Táchira)";
  }
  if (l.includes("santa inés") || l.includes("santa ines")) {
    if (l.includes("barinas")) return "Santa Inés (Barinas) - Destacamento Policial";
    return "C.P. de Occidente (CPO) - Santa Ana (Táchira)";
  }
  if (l.includes("dorado") && l.includes("el")) return "Cárcel de El Dorado (Bolívar)";
  if (l.includes("vista hermosa")) return "Vista Hermosa - Ciudad Bolívar (Bolívar)";
  if (l.includes("la pica") || l.includes("nelson mandela")) return 'La Pica (Hombre Nuevo "Nelson Mandela") - Maturín';
  if (l.includes("cepra")) return "CEPRA - Mérida (Región Andina)";
  if (l.includes("26 de julio") || l.includes("san juan") && l.includes("morros")) {
    return "C.P. 26 de Julio - San Juan de los Morros (Guárico)";
  }
  if (l.includes("internado") && l.includes("trujillo")) return "Internado Judicial de Trujillo";
  if (l.includes("coro")) return "Comunidad Penitenciaria de Coro (Falcón)";
  if (l.includes("cumaná") || l.includes("cumana")) return "Internado Judicial de Cumaná (Sucre)";
  if (l.includes("san antonio") && l.includes("internado")) return "Internado Judicial San Antonio (Nueva Esparta)";
  if (l.includes("agroproductivo") && l.includes("barcelona")) return "C.P. Agroproductivo Barcelona (Anzoátegui)";
  if (l.includes("el valle") && !l.includes("tocuyito")) return "Caracas (D.C.) - PNB El Valle";
  if (l.includes("la yaguara") || l.includes("yaguara")) return "Caracas (D.C.) - PNB La Yaguara";
  if (l.includes("cicpc") && l.includes("parque carabobo")) return "Caracas (D.C.) - CICPC Parque Carabobo";
  if (l.includes("cicpc") && l.includes("rosal")) return "Caracas (D.C.) - CICPC El Rosal";
  if (l.includes("pnb") && l.includes("barcelona")) return "Barcelona (Anzoátegui) - PNB";
  if (l.includes("destacamento 33") || l.includes("gnb") && l.includes("barinas")) {
    return "Destacamento 33 GNB - Barinas";
  }
  if (l.includes("destacamento 15") || l.includes("gnb") && l.includes("valera")) {
    return "Destacamento 15 GNB - Valera (Trujillo)";
  }
  if (l.includes("brigada 41") || l.includes("blindada")) return "Brigada 41 Blindada - Naguanagua (Carabobo)";
  if (l.includes("caracas") || l.includes("distrito capital") || l.includes("libertador")) {
    return "Caracas (Distrito Capital)";
  }
  if (l.includes("maracay")) return "Maracay (Aragua)";
  if (l.includes("valencia") && !l.includes("tocuyito")) return "Valencia (Carabobo)";
  if (l.includes("barquisimeto")) return "Barquisimeto (Lara)";
  if (l.includes("maracaibo")) return "Maracaibo (Zulia)";
  if (l.includes("san cristóbal") || l.includes("san cristobal")) return "San Cristóbal (Táchira)";
  if (l.includes("maturín") || l.includes("maturin")) return "Maturín (Monagas)";
  if (l.includes("barcelona") && !l.includes("agroproductivo")) return "Barcelona (Anzoátegui)";
  if (l.includes("mérida") || l === "merida") return "Mérida (Mérida)";
  if (l.includes("valera")) return "Valera (Trujillo)";
  if (l.includes("guanare")) return "Guanare (Portuguesa)";
  if (l.includes("barinas") && !l.includes("santa")) return "Barinas (Barinas)";
  if (l.includes("los teques")) return "Los Teques (Miranda)";
  if (l.includes("ciudad bolívar") || l.includes("ciudad bolivar")) return "Ciudad Bolívar (Bolívar)";
  if (l.includes("coro")) return "Coro (Falcón)";
  if (l.includes("catia")) return "Catia (Caracas)";
  if (l.includes("petare")) return "Petare (Miranda)";
  if (l.includes("chacao")) return "Chacao (Miranda)";
  if (l.includes("carabobo")) return "Edo. Carabobo";
  if (l.includes("zulia")) return "Edo. Zulia";
  if (l.includes("miranda")) return "Edo. Miranda";
  if (l.includes("táchira") || l.includes("tachira")) return "Edo. Táchira";
  if (l.includes("bolívar") || l.includes("bolivar") && !l.includes("bolivariano")) return "Edo. Bolívar";
  if (l.includes("aragua")) return "Edo. Aragua";
  if (l.includes("lara")) return "Edo. Lara";
  if (l.includes("anzoátegui") || l.includes("anzoategui")) return "Edo. Anzoátegui";
  if (l.includes("monagas")) return "Edo. Monagas";
  if (l.includes("sucre") && !l.includes("jose")) return "Edo. Sucre";
  if (l.includes("falcón") || l.includes("falcon")) return "Edo. Falcón";
  if (l.includes("apure")) return "Edo. Apure";
  if (l.includes("guárico") || l.includes("guarico")) return "Edo. Guárico";
  if (l.includes("portuguesa")) return "Edo. Portuguesa";
  if (l.includes("carúpano") || l.includes("carupano")) return "Carúpano (Sucre) - Centro de Coordinación Policial";
  if (l.includes("el valle") || l.includes("ei valle") || l.includes("e/ valle")) return "PNB El Valle";
  if (l.startsWith("edo ") || l.startsWith("edo. ")) {
    const parts = l.split(" ");
    if (parts.length > 1) {
      const stateName = parts.slice(1).map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
      return `Edo. ${stateName}`;
    }
  }
  if (l.includes("nueva esparta")) return "Edo. Nueva Esparta";
  return loc.trim();
};
function generateStatisticalReport(data) {
  const now = /* @__PURE__ */ new Date();
  const totalCases = data.length;
  const casesWithPhoto = data.filter((d) => d.imagen && d.imagen.length > 0).length;
  const casesWithCompleteData = data.filter((d) => d.nombre && d.antiguedad && d.categoria).length;
  const dates = data.map((d) => d.fecha_registro).filter((f) => f !== void 0 && f !== null && f.length > 0).sort();
  const periodStart = dates.length > 0 ? dates[0] : null;
  const periodEnd = dates.length > 0 ? dates[dates.length - 1] : null;
  const ages = data.map((d) => d.antiguedad).filter((age) => age !== void 0 && age !== null && age > 0 && age <= 120);
  const ageStats = calculateDescriptiveStats(ages);
  const newItems = data.filter((d) => d.antiguedad !== void 0 && d.antiguedad < 2).length;
  const recentItems = data.filter((d) => d.antiguedad !== void 0 && d.antiguedad >= 2 && d.antiguedad < 5).length;
  const standardItems = data.filter((d) => d.antiguedad !== void 0 && d.antiguedad >= 5 && d.antiguedad < 10).length;
  const oldItems = data.filter((d) => d.antiguedad !== void 0 && d.antiguedad >= 10).length;
  const ageUnknown = data.filter((d) => d.antiguedad === void 0 || d.antiguedad === null).length;
  const ageGroups = [
    { label: "Nuevos (< 2 años)", count: newItems, percentage: newItems / totalCases * 100 },
    { label: "Recientes (2-4 años)", count: recentItems, percentage: recentItems / totalCases * 100 },
    { label: "Estándar (5-9 años)", count: standardItems, percentage: standardItems / totalCases * 100 },
    { label: "Antiguos (10+ años)", count: oldItems, percentage: oldItems / totalCases * 100 },
    { label: "Antigüedad no especificada", count: ageUnknown, percentage: ageUnknown / totalCases * 100 }
  ];
  const categories = data.map((d) => d.categoria || "No especificado");
  const tipoA = categories.filter((c) => c === "Tipo A").length;
  const tipoB = categories.filter((c) => c === "Tipo B").length;
  const genderDistribution = {
    masculino: tipoA,
    femenino: tipoB,
    noEspecificado: totalCases - tipoA - tipoB,
    total: totalCases
  };
  const professions = data.filter((d) => d.tipo_objeto && d.tipo_objeto.trim()).map((d) => categorizarProfesion(d.tipo_objeto));
  const topProfessions = buildFrequencyTable(professions).slice(0, 10);
  const nationalities = data.map((d) => normalizeNationality(d.pais_origen));
  const nacional = nationalities.filter((n) => n === "Nacional").length;
  const noEspecificada = nationalities.filter((n) => n === "No especificada").length;
  const extranjera = totalCases - nacional - noEspecificada;
  const foreignNationalities = data.filter((d) => d.pais_origen && normalizeNationality(d.pais_origen) !== "Nacional" && normalizeNationality(d.pais_origen) !== "No especificada").map((d) => normalizeNationality(d.pais_origen));
  const nationalityDistribution = {
    nacional,
    extranjera,
    noEspecificada,
    total: totalCases,
    topForeignNationalities: buildFrequencyTable(foreignNationalities).slice(0, 5)
  };
  const disappearanceLocations = data.filter((d) => d.ultimo_lugar_conocido && d.ultimo_lugar_conocido.trim()).map((d) => {
    const lugar = d.ultimo_lugar_conocido;
    const parts = lugar.split(",");
    const baseLugar = parts.length > 1 ? parts[parts.length - 1].trim() : lugar.trim();
    return normalizeLocation(baseLugar);
  }).filter((l) => l && l.length > 0);
  const topDisappearanceLocations = buildFrequencyTable(disappearanceLocations).slice(0, 10);
  const confinementLocations = data.filter((d) => d.ubicacion_actual && d.ubicacion_actual.trim()).map((d) => {
    const lugar = d.ubicacion_actual;
    const parts = lugar.split(",");
    const baseLugar = parts.length > 1 ? parts[parts.length - 1].trim() : lugar.trim();
    return normalizeLocation(baseLugar);
  }).filter((l) => l && l.length > 0);
  const topConfinementLocations = buildFrequencyTable(confinementLocations).slice(0, 10);
  const monthlyMap = /* @__PURE__ */ new Map();
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  data.forEach((d) => {
    if (d.fecha_registro) {
      const parts = d.fecha_registro.split("-");
      if (parts.length >= 2) {
        const key = `${parts[0]}-${parts[1]}`;
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
      }
    }
  });
  const monthlyTrend = Array.from(monthlyMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-12).map(([key, count]) => {
    const [year, month] = key.split("-");
    return {
      month: `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`,
      count
    };
  });
  const partialReport = {
    generatedAt: now.toISOString(),
    periodStart,
    periodEnd,
    totalCases,
    casesWithPhoto,
    casesWithCompleteData,
    ageStats,
    ageGroups,
    genderDistribution,
    nationalityDistribution,
    topProfessions,
    topDisappearanceLocations,
    topConfinementLocations,
    monthlyTrend
  };
  const conclusions = generateConclusions(partialReport, data);
  return {
    ...partialReport,
    conclusions
  };
}

const DEFAULT_THEME = {
  primary: [30, 58, 95],
  // Institutional Blue #1e3a5f
  accent: [190, 18, 60],
  // Red for critical items #be123c
  grid: [200, 200, 200],
  // Light gray
  text: [0, 0, 0]};
const setFillColor = (doc, color) => {
  doc.setFillColor(color[0], color[1], color[2]);
};
const setDrawColor = (doc, color) => {
  doc.setDrawColor(color[0], color[1], color[2]);
};
const setTextColor = (doc, color) => {
  doc.setTextColor(color[0], color[1], color[2]);
};
function sanitizeChartText(text) {
  return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "").replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s\.,:;()!?"'\/\-\+\=%]/g, "").trim();
}
function drawHorizontalBarChart(doc, data, dims, title) {
  const { x, y, width, height } = dims;
  const chartBottom = y + height;
  const labelWidth = 50;
  const valueWidth = 15;
  const chartAreaWidth = width - labelWidth - valueWidth;
  const barHeight = 6;
  const gap = 4;
  const maxValue = Math.max(...data.map((d) => d.value)) || 1;
  setDrawColor(doc, DEFAULT_THEME.grid);
  doc.line(x + labelWidth, y, x + labelWidth, chartBottom);
  let currentY = y + 2;
  data.forEach((item) => {
    doc.setFontSize(9);
    doc.setFont("times", "normal");
    setTextColor(doc, DEFAULT_THEME.text);
    let label = sanitizeChartText(item.label);
    const maxLabelW = labelWidth - 3;
    if (doc.getTextWidth(label) > maxLabelW) {
      let truncated = label;
      while (doc.getTextWidth(truncated + "...") > maxLabelW && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
      }
      label = truncated + "...";
    }
    doc.text(label, x + labelWidth - 2, currentY + barHeight - 1.5, { align: "right" });
    const barWidth = item.value / maxValue * chartAreaWidth;
    const color = item.isHighlight ? DEFAULT_THEME.accent : DEFAULT_THEME.primary;
    setFillColor(doc, color);
    doc.rect(x + labelWidth, currentY, barWidth, barHeight, "F");
    doc.setFontSize(8);
    setTextColor(doc, DEFAULT_THEME.text);
    const valText = `${item.value} (${item.percentage.toFixed(1)}%)`;
    doc.text(valText, x + labelWidth + barWidth + 2, currentY + barHeight - 1);
    currentY += barHeight + gap;
  });
  return currentY;
}
function drawLineChart(doc, data, dims) {
  const { x, y, width, height } = dims;
  const chartBottom = y + height;
  const padding = { left: 10, bottom: 10, top: 5, right: 5 };
  const plotX = x + padding.left;
  const plotY = y + padding.top;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.bottom - padding.top;
  const maxValue = Math.max(...data.map((d) => d.value)) * 1.1;
  const stepX = plotWidth / (data.length - 1 || 1);
  setDrawColor(doc, DEFAULT_THEME.text);
  doc.setLineWidth(0.3);
  doc.line(plotX, plotY, plotX, plotY + plotHeight);
  doc.line(plotX, plotY + plotHeight, plotX + plotWidth, plotY + plotHeight);
  const gridSteps = 4;
  setDrawColor(doc, DEFAULT_THEME.grid);
  doc.setLineWidth(0.1);
  doc.setFontSize(7);
  setTextColor(doc, DEFAULT_THEME.text);
  for (let i = 0; i <= gridSteps; i++) {
    const val = maxValue / gridSteps * i;
    const lineY = plotY + plotHeight - val / maxValue * plotHeight;
    doc.line(plotX, lineY, plotX + plotWidth, lineY);
    doc.text(Math.round(val).toString(), plotX - 2, lineY + 1, { align: "right" });
  }
  const points = data.map((d, i) => {
    const px = plotX + i * stepX;
    const py = plotY + plotHeight - d.value / maxValue * plotHeight;
    return [px, py];
  });
  setDrawColor(doc, DEFAULT_THEME.primary);
  doc.setLineWidth(0.5);
  for (let i = 0; i < points.length - 1; i++) {
    doc.line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
  }
  setFillColor(doc, DEFAULT_THEME.primary);
  points.forEach((p, i) => {
    doc.circle(p[0], p[1], 1, "F");
    if (i === 0 || i === data.length - 1 || i % 3 === 0) {
      const safeLabel = sanitizeChartText(data[i].label);
      doc.text(safeLabel, p[0], chartBottom + 4, { align: "center", angle: 0 });
    }
  });
}
function drawPartToWholeChart(doc, data, dims) {
  const { x, y, width} = dims;
  const total = data.reduce((s, i) => s + i.value, 0);
  let currentX = x;
  const barH = 15;
  data.forEach((item, i) => {
    const segWidth = item.value / total * width;
    const color = item.color || DEFAULT_THEME.primary;
    setFillColor(doc, color);
    doc.rect(currentX, y, segWidth, barH, "F");
    currentX += segWidth;
  });
  let legendY = y + barH + 5;
  const legendXStart = x;
  let currentLegendX = legendXStart;
  data.forEach((item, i) => {
    const color = item.color || DEFAULT_THEME.primary;
    const percent = (item.value / total * 100).toFixed(1) + "%";
    const labelText = `${sanitizeChartText(item.label)} (${percent})`;
    setFillColor(doc, color);
    doc.rect(currentLegendX, legendY, 3, 3, "F");
    doc.setFontSize(8);
    setTextColor(doc, DEFAULT_THEME.text);
    doc.text(labelText, currentLegendX + 4, legendY + 2.5);
    const textW = doc.getTextWidth(labelText);
    currentLegendX += textW + 10;
    if (currentLegendX > x + width) {
      currentLegendX = legendXStart;
      legendY += 4;
    }
  });
}

const COLORS = {
  primary: [21, 101, 192],
  // Venezuelan blue
  secondary: [66, 66, 66],
  // Dark gray
  text: [0, 0, 0],
  // Black
  border: [189, 189, 189]};
const MARGINS = {
  top: 25.4,
  right: 25.4,
  bottom: 25.4,
  left: 25.4
};
const FONTS = {
  title: 12,
  // APA Title is 12pt bold
  heading1: 12,
  // APA L1 is 12pt bold centered
  heading2: 12,
  // APA L2 is 12pt bold left
  body: 12,
  // APA Body is 12pt
  small: 11,
  // Tables can be slightly smaller but strictly 12pt is preferred.
  tiny: 10};
const APA_TABLE_STYLE = {
  theme: "plain",
  styles: {
    fontSize: 10,
    cellPadding: 3,
    font: "times",
    // Strict APA
    textColor: COLORS.text,
    valign: "middle",
    halign: "left"
    // Default left alignment
  },
  headStyles: {
    fontStyle: "bold",
    fillColor: [255, 255, 255],
    textColor: COLORS.text,
    lineWidth: { bottom: 0.5, top: 0.5 },
    lineColor: [0, 0, 0]
  },
  bodyStyles: {
    lineWidth: { bottom: 0 }
  },
  footStyles: {
    lineWidth: { top: 0.5 }
    // Bottom of table
  },
  tableLineColor: [0, 0, 0],
  tableLineWidth: 0,
  columnStyles: {
    0: { cellWidth: "auto" }
  }
};
function generateProfessionalPDF(report, t) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter"
  });
  let currentY = MARGINS.top;
  addCoverPage(doc, report, t);
  doc.addPage();
  currentY = MARGINS.top;
  currentY = addExecutiveSummary(doc, report, currentY, t);
  currentY = checkPageBreak(doc, currentY, 50);
  currentY = addIntroduction(doc, report, currentY, t);
  currentY = addJurisdictionalNote(doc, currentY, t);
  if (report.ageStats || report.genderDistribution) {
    currentY = checkPageBreak(doc, currentY, 50);
    currentY = addDemographicsAnalysis(doc, report, currentY, t);
    currentY = checkPageBreak(doc, currentY, 50);
    currentY = addGenderAnalysis(doc, report, currentY, t);
  }
  currentY = checkPageBreak(doc, currentY, 50);
  currentY = addNationalityAnalysis(doc, report, currentY, t);
  currentY = checkPageBreak(doc, currentY, 50);
  currentY = addOccupationalAnalysis(doc, report, currentY, t);
  if (report.topDisappearanceLocations.length > 0) {
    currentY = checkPageBreak(doc, currentY, 50);
    currentY = addGeographicDistribution(doc, report, currentY, t);
  }
  if (report.monthlyTrend.length > 0) {
    currentY = checkPageBreak(doc, currentY, 50);
    currentY = addTemporalAnalysis(doc, report, currentY, t);
  }
  currentY = checkPageBreak(doc, currentY, 50);
  currentY = addConclusions(doc, report, currentY, t);
  addDisclaimer(doc, t);
  const pageCount = doc.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(FONTS.small);
    doc.setFont("times", "normal");
    doc.setTextColor(...COLORS.text);
    doc.text("INFORME ESTADÍSTICO", MARGINS.left, MARGINS.top - 10);
    doc.text(`${i} / ${pageCount}`, 195, 270, { align: "right" });
  }
  doc.save(`Reporte_DataTracker_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`);
}
function addCoverPage(doc, report, t) {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, 15, pageHeight, "F");
  let y = 80;
  doc.setFontSize(24);
  doc.setFont("times", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text(t("Report-Header-Main"), 30, y);
  y += 15;
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.secondary);
  doc.text(t("Report-Header-Sub"), 30, y);
  y += 100;
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.text);
  const dateStr = (/* @__PURE__ */ new Date()).toLocaleDateString();
  doc.text(`${t("Report-Header-GenDate")} ${dateStr}`, 30, y);
  y += 20;
  doc.setDrawColor(...COLORS.border);
  doc.line(30, y, 180, y);
  y += 10;
  doc.setFontSize(10);
  doc.setFont("times", "italic");
  const disclaimerParts = doc.splitTextToSize(t("Report-Disclaimer-Text"), 150);
  doc.text(disclaimerParts, 30, y);
  return pageHeight;
}
function addExecutiveSummary(doc, report, startY, t) {
  let y = startY;
  y = addSectionTitle(doc, t("Report-Section-Summary"), y);
  const summary = generateExecutiveSummaryText(report, t).trim();
  doc.setFontSize(FONTS.body);
  doc.setFont("times", "normal");
  doc.setTextColor(...COLORS.text);
  const lines = doc.splitTextToSize(summary, doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right);
  for (const line of lines) {
    y = checkPageBreak(doc, y, 10);
    doc.text(line, MARGINS.left, y, { align: "left" });
    y += 10;
  }
  const kwLabel = t("Report-Keywords-Label") + " ";
  const kwContent = t("Report-Keywords-Content");
  const kwFull = kwLabel + kwContent;
  y = checkPageBreak(doc, y, 20);
  const kwWords = kwFull.split(" ");
  let kwLine = "";
  const kwIndent = 12.7;
  const kwMaxW = doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right - kwIndent;
  kwWords.forEach((word, idx) => {
    const test = kwLine ? kwLine + " " + word : word;
    doc.setFont("times", "normal");
    if (doc.getTextWidth(test) > kwMaxW) {
      renderKwLine(doc, kwLine, MARGINS.left + kwIndent, y, kwLabel);
      y += 10;
      kwLine = word;
    } else {
      kwLine = test;
    }
    if (idx === kwWords.length - 1) {
      renderKwLine(doc, kwLine, MARGINS.left + kwIndent, y, kwLabel);
      y += 10;
    }
  });
  return y;
}
function renderKwLine(doc, text, x, y, label) {
  if (text.startsWith(label)) {
    doc.setFont("times", "italic");
    doc.text(label, x, y);
    const lw = doc.getTextWidth(label);
    doc.setFont("times", "normal");
    doc.text(text.substring(label.length), x + lw, y);
  } else {
    doc.setFont("times", "normal");
    doc.text(text, x, y);
  }
}
function generateExecutiveSummaryText(report, t) {
  const totalCases = report.totalCases.toLocaleString();
  const avgAge = report.ageStats?.mean.toFixed(1) || "N/A";
  const malePercent = (report.genderDistribution.masculino / report.totalCases * 100).toFixed(1);
  const topProfession = report.topProfessions[0]?.value || "N/A";
  const topLocation = report.topDisappearanceLocations[0]?.value || "N/A";
  return sanitizeText(t("Report-Summary-Text", {
    total: totalCases,
    period: report.periodStart && report.periodEnd ? ` (${formatDate(report.periodStart)} - ${formatDate(report.periodEnd)})` : "",
    avgAge,
    topGender: report.genderDistribution.masculino > report.genderDistribution.femenino ? t("Stats-Label-Men") : t("Stats-Label-Women"),
    // Simple heuristic
    genderPct: malePercent,
    topProf: topProfession,
    profPct: report.topProfessions[0]?.pi.toFixed(1) || "0",
    topLoc: topLocation
  }));
}
function addIntroduction(doc, report, startY, t) {
  let y = startY;
  const title = t("Report-Intro-Title");
  y = checkPageBreak(doc, y, 20);
  doc.setFontSize(FONTS.title);
  doc.setFont("times", "bold");
  doc.setTextColor(...COLORS.text);
  const textWidth = doc.getTextWidth(title);
  doc.text(title, (doc.internal.pageSize.getWidth() - textWidth) / 2, y);
  y += 12;
  const intro = t("Report-Intro-Text", {
    cases: report.totalCases.toLocaleString(),
    period: report.periodStart && report.periodEnd ? ` (${formatDate(report.periodStart)} - ${formatDate(report.periodEnd)})` : ""
  });
  doc.setFontSize(FONTS.body);
  doc.setFont("times", "normal");
  const paragraphs = intro.split("\n\n");
  paragraphs.forEach((p) => {
    y = printAPAParagraph(doc, p, y);
  });
  return y;
}
function addJurisdictionalNote(doc, startY, t) {
  let y = startY;
  doc.internal.pageSize.getWidth();
  y = checkPageBreak(doc, y, 50);
  y = checkPageBreak(doc, y, 50);
  doc.setFont("times", "bold");
  doc.setFontSize(FONTS.small);
  doc.setTextColor(0, 0, 0);
  doc.text(t("Report-Jurisdiction-Title"), MARGINS.left, y);
  y += 10;
  doc.setFont("times", "normal");
  const noteText = t("Report-Jurisdiction-Text");
  y = printAPAParagraph(doc, noteText, y);
  return y;
}
function addDemographicsAnalysis(doc, report, startY, t) {
  let y = startY;
  y = addSectionTitle(doc, t("Report-Section-Demographics"), y);
  y = checkPageBreak(doc, y, 75);
  y = addSubsectionTitle(doc, t("Report-Sub-Age"), y);
  if (report.ageStats) {
    doc.setFontSize(FONTS.small);
    doc.setFont("times", "bold");
    doc.text("Tabla 1", MARGINS.left, y - 6);
    doc.setFont("times", "italic");
    doc.text(t("Report-Table-Age-Title"), MARGINS.left, y - 2);
    autoTable(doc, {
      ...APA_TABLE_STYLE,
      startY: y,
      head: [[t("Report-Table-Metric"), t("Report-Table-Value")]],
      body: [
        [t("Report-Metric-Mean"), `${report.ageStats.mean.toFixed(2)} ${t("Stats-Info-Yo") || "años"}`],
        [t("Report-Metric-Median"), `${report.ageStats.median.toFixed(2)} ${t("Stats-Info-Yo") || "años"}`],
        ["Moda", `${report.ageStats.mode ?? "N/A"} ${t("Stats-Info-Yo") || "años"}`],
        [t("Report-Metric-StdDev"), `±${report.ageStats.stdDev.toFixed(2)}`],
        ["Varianza", `${report.ageStats.variance.toFixed(2)}`],
        [t("Report-Metric-Range"), `${report.ageStats.min} - ${report.ageStats.max}`],
        [t("Stats-Report-AgeCV"), `${report.ageStats.cv.toFixed(2)}%`]
      ],
      margin: { left: MARGINS.left, right: MARGINS.right }
    });
    y = doc.lastAutoTable.finalY + 10;
  }
  y = addSubsectionTitle(doc, t("Report-Sub-Age") + " (Detalle)", y);
  y = checkPageBreak(doc, y, 60);
  doc.setFontSize(FONTS.small);
  doc.setFont("times", "bold");
  doc.text("Tabla 2", MARGINS.left, y - 6);
  doc.setFont("times", "italic");
  doc.text(t("Report-Table-Age-Title") + " - Grupos", MARGINS.left, y - 2);
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [[t("Report-Table-Metric"), t("Report-Col-FreqAbs"), t("Report-Col-Percent")]],
    body: report.ageGroups.map((group) => [
      group.label,
      group.count.toString(),
      `${group.percentage.toFixed(1)}%`
    ]),
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 15;
  return y;
}
function addGenderAnalysis(doc, report, startY, t) {
  let y = startY;
  y = checkPageBreak(doc, y, 70);
  y = addSubsectionTitle(doc, t("Report-Sub-Gender"), y);
  const genderData = [
    [t("Stats-Label-Men"), report.genderDistribution.masculino, (report.genderDistribution.masculino / report.totalCases * 100).toFixed(1)],
    [t("Stats-Label-Women"), report.genderDistribution.femenino, (report.genderDistribution.femenino / report.totalCases * 100).toFixed(1)],
    [t("Stats-Label-NotSpecified"), report.genderDistribution.noEspecificado, (report.genderDistribution.noEspecificado / report.totalCases * 100).toFixed(1)]
  ];
  y = checkPageBreak(doc, y, 60);
  doc.setFontSize(FONTS.small);
  doc.setFont("times", "bold");
  doc.text("Tabla 3", MARGINS.left, y - 6);
  doc.setFont("times", "italic");
  doc.text(t("Report-Table-Gender-Title"), MARGINS.left, y - 2);
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [[t("Report-Col-Gender"), t("Report-Col-FreqAbs"), t("Report-Col-Percent")]],
    body: genderData.map((row) => [row[0], row[1].toString(), `${row[2]}%`]),
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 15;
  y = checkPageBreak(doc, y, 70);
  doc.setFont("times", "bold");
  doc.setFontSize(FONTS.small);
  doc.text("Figura 1", MARGINS.left, y - 6);
  doc.setFont("times", "italic");
  doc.text(t("Report-Fig1-Title"), MARGINS.left, y - 1);
  y += 4;
  const chartWidth = 160;
  const genderChartData = [
    { label: t("Stats-Label-Men"), value: report.genderDistribution.masculino, color: [30, 58, 95] },
    // Blue
    { label: t("Stats-Label-Women"), value: report.genderDistribution.femenino, color: [190, 18, 60] },
    // Red
    { label: t("Stats-Label-NotSpecified"), value: report.genderDistribution.noEspecificado, color: [150, 150, 150] }
    // Gray
  ].filter((d) => d.value > 0);
  drawPartToWholeChart(doc, genderChartData, {
    x: MARGINS.left,
    y,
    width: chartWidth});
  y += 35;
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const genderNote = t("Report-Fig1-Note");
  y = printAPAParagraph(doc, genderNote, y);
  y += 15;
  return y;
}
function addNationalityAnalysis(doc, report, startY, t) {
  let y = startY;
  if (checkPageBreak(doc, y, 120) !== y) {
    y = MARGINS.top;
  }
  y = addSectionTitle(doc, t("Report-Section-Nationality"), y);
  doc.setFontSize(FONTS.small);
  doc.setFont("times", "bold");
  doc.text("Tabla 4", MARGINS.left, y - 6);
  doc.setFont("times", "italic");
  doc.text(t("Report-Table-Nat-Title"), MARGINS.left, y - 2);
  const nat = report.nationalityDistribution;
  const tableData = [
    [t("Stats-Label-Venezuelans"), nat.nacional.toString(), (nat.nacional / nat.total).toFixed(4), `${(nat.nacional / nat.total * 100).toFixed(1)}%`],
    [t("Stats-Label-Foreigners"), nat.extranjera.toString(), (nat.extranjera / nat.total).toFixed(4), `${(nat.extranjera / nat.total * 100).toFixed(1)}%`],
    [t("Stats-Label-NotSpecified"), nat.noEspecificada.toString(), (nat.noEspecificada / nat.total).toFixed(4), `${(nat.noEspecificada / nat.total * 100).toFixed(1)}%`]
  ];
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [[t("Report-Col-Nationality"), { content: t("Report-Col-FreqAbs"), styles: { halign: "right" } }, { content: t("Report-Col-FreqRel"), styles: { halign: "right" } }, { content: t("Report-Col-Percent"), styles: { halign: "right" } }]],
    body: tableData,
    headStyles: { ...APA_TABLE_STYLE.headStyles, fontSize: FONTS.tiny },
    styles: { ...APA_TABLE_STYLE.styles, fontSize: FONTS.tiny },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 10;
  if (nat.extranjera > 0 && nat.topForeignNationalities.length > 0) {
    y = checkPageBreak(doc, y, 50);
    doc.setFontSize(FONTS.small);
    doc.setFont("times", "bold");
    doc.text("Tabla 4.1", MARGINS.left, y - 6);
    doc.setFont("times", "italic");
    doc.text(t("Report-Table-Nat-Title") + " (Detalle)", MARGINS.left, y - 2);
    autoTable(doc, {
      ...APA_TABLE_STYLE,
      startY: y,
      head: [["#", t("Report-Col-Nationality"), { content: t("Report-Col-FreqAbs"), styles: { halign: "right" } }, { content: t("Report-Col-Percent"), styles: { halign: "right" } }]],
      body: nat.topForeignNationalities.map((n, index) => [
        (index + 1).toString(),
        sanitizeText(n.value),
        n.fi.toString(),
        `${n.pi.toFixed(1)}%`
      ]),
      headStyles: { ...APA_TABLE_STYLE.headStyles, fontSize: FONTS.tiny },
      styles: { ...APA_TABLE_STYLE.styles, fontSize: FONTS.tiny },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        2: { halign: "right" },
        3: { halign: "right" }
      },
      margin: { left: MARGINS.left, right: MARGINS.right }
    });
    y = doc.lastAutoTable.finalY + 10;
    y = printAPAParagraph(doc, t("Report-Note-Vienna"), y);
    y += 10;
  }
  return y;
}
function addOccupationalAnalysis(doc, report, startY, t) {
  let y = startY;
  if (checkPageBreak(doc, y, 130) !== y) {
    y = MARGINS.top;
  }
  y = addSectionTitle(doc, t("Report-Section-Occupation"), y);
  y = addSubsectionTitle(doc, t("Report-Sub-Professions"), y);
  doc.setFontSize(FONTS.small);
  doc.setFontSize(FONTS.small);
  doc.setFont("times", "bold");
  doc.text("Tabla 5", MARGINS.left, y - 6);
  doc.setFont("times", "italic");
  doc.text(t("Report-Table-Occ-Title"), MARGINS.left, y - 2);
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [["#", t("Report-Col-Occupation"), { content: t("Report-Col-FreqAbs"), styles: { halign: "right" } }, { content: t("Report-Col-FreqRel"), styles: { halign: "right" } }, { content: t("Report-Col-Percent"), styles: { halign: "right" } }]],
    body: report.topProfessions.map((prof, index) => [
      (index + 1).toString(),
      sanitizeText(prof.value),
      prof.fi.toString(),
      prof.hi.toFixed(4),
      `${prof.pi.toFixed(1)}%`
    ]),
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 15;
  y = checkPageBreak(doc, y, 90);
  y += 5;
  doc.setFont("times", "bold");
  doc.setFontSize(FONTS.small);
  doc.text("Figura 2", MARGINS.left, y - 6);
  doc.setFont("times", "italic");
  doc.text(t("Report-Fig2-Title"), MARGINS.left, y - 1);
  y += 4;
  const occupationChartData = report.topProfessions.slice(0, 10).map((p) => ({
    label: sanitizeText(p.value),
    value: p.fi,
    percentage: p.pi,
    isHighlight: p.value.toLowerCase().includes("estudiante")
  }));
  y = drawHorizontalBarChart(doc, occupationChartData, {
    x: MARGINS.left,
    y: y + 5,
    // Add more internal padding just in case
    width: 170,
    height: 60
  });
  y += 10;
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const occNote = t("Report-Fig2-Note");
  y = printAPAParagraph(doc, occNote, y);
  y += 15;
  return y;
}
function addGeographicDistribution(doc, report, startY, t) {
  let y = startY;
  if (checkPageBreak(doc, y, 120) !== y) {
    y = MARGINS.top;
  }
  y = addSectionTitle(doc, t("Report-Section-Geography"), y);
  y = addSubsectionTitle(doc, t("Report-Sub-Geo-Disap"), y);
  doc.setFontSize(FONTS.small);
  doc.setFont("times", "bold");
  doc.text("Tabla 6", MARGINS.left, y - 6);
  doc.setFont("times", "italic");
  doc.text(t("Report-Table-Geo-Title"), MARGINS.left, y - 2);
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [["#", t("Report-Col-Location"), { content: t("Report-Col-FreqAbs"), styles: { halign: "right" } }, { content: t("Report-Col-FreqRel"), styles: { halign: "right" } }, { content: t("Report-Col-Percent"), styles: { halign: "right" } }]],
    body: report.topDisappearanceLocations.map((loc, index) => [
      (index + 1).toString(),
      sanitizeText(loc.value),
      loc.fi.toString(),
      loc.hi.toFixed(4),
      `${loc.pi.toFixed(1)}%`
    ]),
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 15;
  if (report.topConfinementLocations.length > 0) {
    y = checkPageBreak(doc, y, 90);
    y = addSubsectionTitle(doc, t("Report-Sub-Geo-Conf"), y);
    doc.setFontSize(FONTS.small);
    doc.setFont("times", "bold");
    doc.text("Tabla 7", MARGINS.left, y - 6);
    doc.setFont("times", "italic");
    doc.text(t("Report-Table-Geo-Title") + " (Confinamiento)", MARGINS.left, y - 2);
    autoTable(doc, {
      ...APA_TABLE_STYLE,
      startY: y,
      head: [["#", t("Report-Col-Location"), { content: t("Report-Col-FreqAbs"), styles: { halign: "right" } }, { content: t("Report-Col-FreqRel"), styles: { halign: "right" } }, { content: t("Report-Col-Percent"), styles: { halign: "right" } }]],
      body: report.topConfinementLocations.map((loc, index) => [
        (index + 1).toString(),
        sanitizeText(loc.value),
        loc.fi.toString(),
        loc.hi.toFixed(4),
        `${loc.pi.toFixed(1)}%`
      ]),
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" }
      },
      margin: { left: MARGINS.left, right: MARGINS.right }
    });
    y = doc.lastAutoTable.finalY + 10;
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    const geoNote = t("Report-Note-Centralization");
    y = printAPAParagraph(doc, geoNote, y);
    y += 10;
  }
  return y;
}
function addTemporalAnalysis(doc, report, startY, t) {
  let y = startY;
  if (checkPageBreak(doc, y, 130) !== y) {
    y = MARGINS.top;
  }
  y = addSectionTitle(doc, t("Report-Section-Temporal"), y);
  y = addSubsectionTitle(doc, t("Report-Sub-Time-Trend"), y);
  doc.setFontSize(FONTS.small);
  doc.setFont("times", "bold");
  doc.text("Tabla 8", MARGINS.left, y - 6);
  doc.setFont("times", "italic");
  doc.text(t("Report-Table-Temp-Title"), MARGINS.left, y - 2);
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [["#", t("Report-Col-Month"), { content: t("Report-Col-Cases"), styles: { halign: "right" } }, { content: t("Report-Col-Percent"), styles: { halign: "right" } }]],
    body: report.monthlyTrend.map((m, index) => [
      (index + 1).toString(),
      m.month,
      m.count.toString(),
      (m.count / report.totalCases * 100).toFixed(1) + "%"
    ]),
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "right" },
      3: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 15;
  if (report.monthlyTrend.length > 1) {
    y = checkPageBreak(doc, y, 90);
    doc.setFont("times", "bold");
    doc.setFontSize(FONTS.small);
    doc.text("Figura 3", MARGINS.left, y - 6);
    doc.setFont("times", "italic");
    doc.text(t("Report-Fig3-Title"), MARGINS.left, y - 1);
    y += 4;
    const lineData = report.monthlyTrend.map((m) => ({
      label: m.month.split(" ")[0],
      value: m.count
    }));
    drawLineChart(doc, lineData, {
      x: MARGINS.left,
      y,
      width: doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right,
      height: 60
    });
    y += 75;
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    const trendNote = t("Report-Fig3-Note");
    y = printAPAParagraph(doc, trendNote, y);
    y += 10;
  }
  return y;
}
function addConclusions(doc, report, startY, t) {
  let y = startY;
  y = addSectionTitle(doc, t("Report-Section-Conclusions"), y);
  doc.setFontSize(FONTS.body);
  doc.setFont("times", "normal");
  doc.setTextColor(...COLORS.text);
  report.conclusions.forEach((conclusion, index) => {
    y = checkPageBreak(doc, y, 15);
    y += 4;
    doc.setCharSpace(0);
    const isAlert = conclusion.startsWith("ALERTA") || conclusion.startsWith("GRAVE") || conclusion.startsWith("CRÍMENES");
    if (isAlert) {
      doc.setTextColor(0, 0, 0);
      doc.setFont("times", "bold");
    } else {
      doc.setTextColor(0, 0, 0);
      doc.setFont("times", "normal");
    }
    const cleanText = sanitizeText(conclusion);
    y = printAPAParagraph(doc, cleanText, y);
  });
  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setCharSpace(0);
  return y;
}
function addDisclaimer(doc, t) {
  doc.addPage();
  let y = MARGINS.top;
  y = addSectionTitle(doc, "Referencias", y);
  const references = [
    "Corte Penal Internacional. (1998). Estatuto de Roma de la Corte Penal Internacional. https://www.un.org/spanish/law/icc/statute/spanish/rome_statute(s).pdf",
    "Foro Penal. (2026). Reporte de Represión en Venezuela: Listado de Presos Políticos. https://foropenal.com/",
    "Naciones Unidas. (1948). Declaración Universal de Derechos Humanos. https://www.un.org/es/about-us/universal-declaration-of-human-rights",
    "Organización de los Estados Americanos. (1969). Convención Americana sobre Derechos Humanos (Pacto de San José). https://www.oas.org/dil/esp/1969_Convenci%C3%B3n_Americana_sobre_Derechos_Humanos.pdf"
  ];
  doc.setFontSize(FONTS.body);
  doc.setFont("times", "normal");
  references.forEach((ref) => {
    let tokens = [{ text: ref, fontStyle: "normal" }];
    const firstParen = ref.indexOf("(");
    const closingParen = ref.indexOf("). ", firstParen);
    if (closingParen > -1) {
      const titleStart = closingParen + 3;
      const titleEnd = ref.indexOf(". ", titleStart);
      if (titleEnd > -1) {
        const authorYear = ref.substring(0, titleStart);
        const title = ref.substring(titleStart, titleEnd + 2);
        const rest = ref.substring(titleEnd + 2);
        tokens = [
          { text: authorYear, fontStyle: "normal" },
          { text: title, fontStyle: "italic" },
          { text: rest, fontStyle: "normal" }
        ];
      }
    }
    y = renderStyledReference(doc, tokens, y);
  });
  y += 20;
  y = checkPageBreak(doc, y, 30);
  doc.setFontSize(FONTS.small);
  doc.setFont("times", "italic");
  const disclaimer = t("Report-Disclaimer-Text");
  y = printAPAParagraph(doc, disclaimer, y);
}
function addSectionTitle(doc, title, y) {
  y = checkPageBreak(doc, y, 25);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(FONTS.heading1);
  doc.setFont("times", "bold");
  doc.setTextColor(...COLORS.text);
  const textWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - textWidth) / 2, y);
  y += 12;
  return y;
}
function addSubsectionTitle(doc, title, y) {
  const nextY = checkPageBreak(doc, y, 15);
  doc.setFontSize(FONTS.heading2);
  doc.setFont("times", "bold");
  doc.setTextColor(...COLORS.text);
  doc.text(title, MARGINS.left, nextY);
  return nextY + 10;
}
function checkPageBreak(doc, currentY, requiredSpace) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY + requiredSpace > pageHeight - MARGINS.bottom) {
    doc.addPage();
    return MARGINS.top;
  }
  return currentY;
}
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function sanitizeText(text) {
  if (!text) return "";
  return text.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s\.,:;()!?"'\/\-\+\=%]/g, "").replace(/\s+/g, " ").trim();
}
function printAPAParagraph(doc, text, y) {
  const indent = 12.7;
  const maxWidth = doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right;
  const words = text.split(" ");
  let currentLine = "";
  let isFirstLine = true;
  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    const testWidth = doc.getTextWidth(testLine);
    const availableWidth = isFirstLine ? maxWidth - indent : maxWidth;
    if (testWidth > availableWidth) {
      y = checkPageBreak(doc, y, 10);
      const xPos = isFirstLine ? MARGINS.left + indent : MARGINS.left;
      doc.text(currentLine, xPos, y);
      y += 10;
      currentLine = word;
      isFirstLine = false;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) {
    y = checkPageBreak(doc, y, 10);
    const xPos = isFirstLine ? MARGINS.left + indent : MARGINS.left;
    doc.text(currentLine, xPos, y);
    y += 6;
  }
  return y + 4;
}
function renderStyledReference(doc, tokens, startY) {
  let y = checkPageBreak(doc, startY, 15);
  const maxWidth = doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right;
  const indent = 12.7;
  let currentLineTokens = [];
  let currentLineWidth = 0;
  let isFirstLine = true;
  tokens.forEach((token) => {
    const words = token.text.split(/(\s+)/).filter((w) => w.length > 0);
    doc.setFont("times", token.fontStyle);
    words.forEach((word) => {
      const wordWidth = doc.getTextWidth(word);
      const availableWidth = maxWidth - (isFirstLine ? 0 : indent);
      if (currentLineWidth + wordWidth > availableWidth) {
        const startX = MARGINS.left + (isFirstLine ? 0 : indent);
        currentLineTokens.forEach((t) => {
          doc.setFont("times", t.fontStyle);
          doc.text(t.text, startX + t.x, y);
        });
        y += 6;
        y = checkPageBreak(doc, y, 5);
        isFirstLine = false;
        currentLineWidth = 0;
        currentLineTokens = [];
        const indWidth = maxWidth - indent;
        if (wordWidth > indWidth) {
          let remaining = word;
          while (doc.getTextWidth(remaining) > indWidth) {
            let splitIdx = remaining.length;
            while (doc.getTextWidth(remaining.substring(0, splitIdx)) > indWidth && splitIdx > 0) {
              splitIdx--;
            }
            if (splitIdx === 0) splitIdx = 10;
            const chunk = remaining.substring(0, splitIdx);
            doc.setFont("times", token.fontStyle);
            doc.text(chunk, MARGINS.left + indent, y);
            y += 6;
            y = checkPageBreak(doc, y, 5);
            remaining = remaining.substring(splitIdx);
          }
          if (remaining) {
            currentLineTokens.push({ text: remaining, fontStyle: token.fontStyle, x: 0 });
            currentLineWidth = doc.getTextWidth(remaining);
          }
          return;
        }
      }
      currentLineTokens.push({
        text: word,
        fontStyle: token.fontStyle,
        x: currentLineWidth
      });
      currentLineWidth += wordWidth;
    });
  });
  if (currentLineTokens.length > 0) {
    const startX = MARGINS.left + (isFirstLine ? 0 : indent);
    currentLineTokens.forEach((t) => {
      doc.setFont("times", t.fontStyle);
      doc.text(t.text, startX + t.x, y);
    });
    y += 6;
  }
  return y + 6;
}

function StatsEngineContent() {
  const { translate, currentLang } = useLanguage();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("/api/inventario?estado_registro=aprobado").then((response) => response.json()).then((data2) => {
      setData(data2.objetos || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);
  const casosRegistrados = data.length;
  const casosConDatosCompletos = data.filter((d) => d.nombre && d.antiguedad && d.categoria).length;
  const tipoA = data.filter((d) => d.categoria === "Tipo A").length;
  const tipoB = data.filter((d) => d.categoria === "Tipo B").length;
  const sinCategoria = casosRegistrados - tipoA - tipoB;
  const nuevos = data.filter((d) => d.antiguedad !== void 0 && d.antiguedad < 2).length;
  const recientes = data.filter((d) => d.antiguedad !== void 0 && d.antiguedad >= 2 && d.antiguedad < 5).length;
  const estandar = data.filter((d) => d.antiguedad !== void 0 && d.antiguedad >= 5 && d.antiguedad < 10).length;
  const antiguos = data.filter((d) => d.antiguedad !== void 0 && d.antiguedad >= 10).length;
  const sinAntiguedad = data.filter((d) => d.antiguedad === void 0).length;
  const conImagen = data.filter((d) => d.imagen && d.imagen.length > 0).length;
  const paisesOrigen = data.map((d) => normalizeNationality(d.pais_origen));
  const nacionales = paisesOrigen.filter((n) => n === "Nacional").length;
  const sinPaisOrigen = paisesOrigen.filter((n) => n === "No especificada").length;
  const importados = casosRegistrados - nacionales - sinPaisOrigen;
  const top10Edades = useMemo(() => {
    const antiguedadesCount = {};
    data.forEach((d) => {
      if (d.antiguedad && d.antiguedad > 0 && d.antiguedad <= 100) {
        antiguedadesCount[d.antiguedad] = (antiguedadesCount[d.antiguedad] || 0) + 1;
      }
    });
    return Object.entries(antiguedadesCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([antiguedad, count]) => ({ name: translate("Stats-Age-Years", { age: antiguedad }), value: count }));
  }, [data, translate]);
  const ultimoLugarConocido = useMemo(() => {
    const locationsCount = {};
    data.forEach((d) => {
      if (d.ultimo_lugar_conocido && d.ultimo_lugar_conocido.trim()) {
        const lugar = d.ultimo_lugar_conocido;
        const parts = lugar.split(",");
        const baseName = parts.length > 1 ? parts[parts.length - 1].trim() : lugar.trim();
        const normalized = normalizeLocation(baseName);
        if (normalized) {
          locationsCount[normalized] = (locationsCount[normalized] || 0) + 1;
        }
      }
    });
    return Object.entries(locationsCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([location, count]) => ({ name: location, value: count }));
  }, [data]);
  const ubicacionActual = useMemo(() => {
    const centersCount = {};
    data.forEach((d) => {
      if (d.ubicacion_actual && d.ubicacion_actual.trim()) {
        const lugar = d.ubicacion_actual;
        const parts = lugar.split(",");
        const baseName = parts.length > 1 ? parts[parts.length - 1].trim() : lugar.trim();
        const normalized = normalizeLocation(baseName);
        if (normalized) {
          centersCount[normalized] = (centersCount[normalized] || 0) + 1;
        }
      }
    });
    return Object.entries(centersCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([center, count]) => ({ name: center, value: count }));
  }, [data]);
  const casosPorMes = useMemo(() => {
    const mesesCount = {};
    data.forEach((d) => {
      if (d.fecha_registro) {
        const parts = d.fecha_registro.split("-");
        if (parts.length >= 2) {
          const mesKey = `${parts[0]}-${parts[1]}`;
          mesesCount[mesKey] = (mesesCount[mesKey] || 0) + 1;
        }
      }
    });
    const locale = currentLang === "es" ? "es-ES" : "en-US";
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: "short" });
    return Object.entries(mesesCount).sort((a, b) => a[0].localeCompare(b[0])).slice(-12).map(([mes, count]) => {
      const [year, month] = mes.split("-");
      const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      let monthLabel = monthFormatter.format(monthDate);
      monthLabel = monthLabel.replace(".", "");
      monthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
      return { date: `${monthLabel} ${year.slice(2)}`, cases: count };
    });
  }, [data, currentLang]);
  const profesionesTop = useMemo(() => {
    const categoriasCount = {};
    data.forEach((d) => {
      if (d.tipo_objeto && d.tipo_objeto.trim()) {
        const categoria = categorizarProfesion(d.tipo_objeto);
        categoriasCount[categoria] = (categoriasCount[categoria] || 0) + 1;
      }
    });
    return Object.entries(categoriasCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([profesion, count]) => ({ name: profesion, value: count }));
  }, [data]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center min-h-[400px]", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsx(
        "h1",
        {
          className: "text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3",
          style: { fontFamily: "'Playfair Display', serif" },
          children: translate("Navbar-4")
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex h-1.5 w-32 sm:w-48 mx-auto rounded-full overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 tricolor-yellow" }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 tricolor-blue" }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 tricolor-red" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6", children: [
      /* @__PURE__ */ jsx(
        MetricCard,
        {
          title: translate("Stats-Metric-Total"),
          value: casosRegistrados.toLocaleString(),
          icon: Users
        }
      ),
      /* @__PURE__ */ jsx(
        MetricCard,
        {
          title: translate("Stats-Metric-WithPhoto"),
          value: conImagen.toLocaleString(),
          icon: Camera
        }
      ),
      /* @__PURE__ */ jsx(
        MetricCard,
        {
          title: translate("Stats-Metric-Minors"),
          value: nuevos.toLocaleString(),
          icon: Baby
        }
      ),
      /* @__PURE__ */ jsx(
        MetricCard,
        {
          title: translate("Stats-Metric-CompleteData"),
          value: casosConDatosCompletos.toLocaleString(),
          icon: AlertTriangle
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6", children: [
      casosPorMes.length > 0 && /* @__PURE__ */ jsx(ChartCard, { title: translate("Stats-Chart-CasesPerMonth"), fullWidth: true, children: /* @__PURE__ */ jsx(StatsTimelineChart, { data: casosPorMes, height: 280 }) }),
      /* @__PURE__ */ jsx(ChartCard, { title: translate("Stats-Chart-GenderDistribution"), children: /* @__PURE__ */ jsx(
        StatsDonutChart,
        {
          data: [
            { name: translate("Stats-Label-Men"), value: tipoA },
            { name: translate("Stats-Label-Women"), value: tipoB },
            { name: translate("Stats-Label-NotSpecified"), value: sinCategoria }
          ].filter((d) => d.value > 0)
        }
      ) }),
      /* @__PURE__ */ jsx(ChartCard, { title: translate("Stats-Chart-ByNationality"), children: /* @__PURE__ */ jsx(
        StatsDonutChart,
        {
          data: [
            { name: translate("Stats-Label-Venezuelans"), value: nacionales },
            { name: translate("Stats-Label-Foreigners"), value: importados },
            { name: translate("Stats-Label-NotSpecified"), value: sinPaisOrigen }
          ].filter((d) => d.value > 0),
          colors: [STATS_COLORS.secondary, STATS_COLORS.neutral, STATS_COLORS.gray1]
        }
      ) }),
      /* @__PURE__ */ jsx(ChartCard, { title: translate("Stats-Chart-AgeDistribution"), children: /* @__PURE__ */ jsx(
        StatsDonutChart,
        {
          data: [
            { name: translate("Stats-Label-Under18"), value: nuevos },
            { name: translate("Stats-Label-Adults18to64"), value: recientes + estandar },
            { name: translate("Stats-Label-Over65"), value: antiguos },
            { name: translate("Stats-Label-NotSpecified"), value: sinAntiguedad }
          ].filter((d) => d.value > 0),
          colors: [STATS_COLORS.critical, STATS_COLORS.primary, STATS_COLORS.neutral, STATS_COLORS.gray1]
        }
      ) }),
      /* @__PURE__ */ jsx(ChartCard, { title: translate("Stats-Chart-DataQuality"), children: /* @__PURE__ */ jsx(
        StatsDonutChart,
        {
          data: [
            { name: translate("Stats-Label-WithPhoto"), value: conImagen },
            { name: translate("Stats-Label-WithoutPhoto"), value: casosRegistrados - conImagen }
          ],
          colors: [STATS_COLORS.primary, STATS_COLORS.gray1]
        }
      ) }),
      top10Edades.length > 0 && /* @__PURE__ */ jsx(ChartCard, { title: translate("Stats-Chart-Top10Ages"), fullWidth: true, children: /* @__PURE__ */ jsx(StatsBarChart, { data: top10Edades, color: STATS_COLORS.secondary, height: 300 }) }),
      ultimoLugarConocido.length > 0 && /* @__PURE__ */ jsx(ChartCard, { title: translate("Stats-Chart-DisappearanceLocationsTop10"), fullWidth: true, children: /* @__PURE__ */ jsx(StatsBarChart, { data: ultimoLugarConocido, color: STATS_COLORS.critical, height: 350 }) }),
      ubicacionActual.length > 0 && /* @__PURE__ */ jsx(ChartCard, { title: translate("Stats-Chart-ConfinementCentersTop10"), fullWidth: true, children: /* @__PURE__ */ jsx(StatsBarChart, { data: ubicacionActual, color: STATS_COLORS.primary, height: 350 }) }),
      profesionesTop.length > 0 && /* @__PURE__ */ jsx(ChartCard, { title: translate("Stats-Chart-ProfessionsMostAffected"), fullWidth: true, children: /* @__PURE__ */ jsx(StatsBarChart, { data: profesionesTop, color: STATS_COLORS.neutral, height: 350 }) })
    ] }),
    /* @__PURE__ */ jsx(ReportSection, { data })
  ] });
}
function ReportSection({ data }) {
  const { translate } = useLanguage();
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedReport = generateStatisticalReport(data);
      setReport(generatedReport);
      setIsGenerating(false);
    }, 500);
  }, [data]);
  const handleGeneratePDF = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedReport = generateStatisticalReport(data);
      setReport(generatedReport);
      generateProfessionalPDF(generatedReport, translate);
      setIsGenerating(false);
    }, 500);
  }, [data]);
  return /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-xl p-6 text-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-4", style: { fontFamily: "'Playfair Display', serif" }, children: translate("Stats-Report-Title") }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mb-4", children: translate("Stats-Report-Description") }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleGeneratePDF,
          disabled: isGenerating || data.length === 0,
          className: "inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold",
          children: isGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-current" }),
            translate("Stats-Report-Generating")
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
            translate("Stats-Report-GenerateButton")
          ] })
        }
      ),
      data.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs mt-3", children: translate("Stats-Report-NoData") })
    ] }),
    report && /* @__PURE__ */ jsxs("div", { className: "space-y-6 stats-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-green-200 font-semibold", children: translate("Stats-Report-SuccessTitle") }),
        /* @__PURE__ */ jsx("p", { className: "text-green-200/70 text-sm mt-1", children: translate("Stats-Report-SuccessSubtitle") })
      ] }),
      report.ageStats && /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-4", style: { fontFamily: "'Playfair Display', serif" }, children: translate("Stats-Report-AgeSummaryTitle") }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground", children: report.ageStats.mean.toFixed(1) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: translate("Stats-Report-AgeMean") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground", children: report.ageStats.median.toFixed(1) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: translate("Stats-Report-AgeMedian") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
              "±",
              report.ageStats.stdDev.toFixed(1)
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: translate("Stats-Report-AgeStdDev") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
              report.ageStats.cv.toFixed(1),
              "%"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: translate("Stats-Report-AgeCV") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-4", style: { fontFamily: "'Playfair Display', serif" }, children: translate("Stats-Report-ConclusionsTitle") }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: report.conclusions.map((conclusion, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `p-4 rounded-lg text-sm leading-relaxed ${conclusion.includes("ALERTA") || conclusion.includes("PREOCUPANTE") || conclusion.includes("GRAVE") || conclusion.includes("CRÍMENES") ? "bg-red-500/10 border border-red-500/30 text-red-200" : "bg-background/50 text-foreground/80"}`,
            children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
                index + 1,
                "."
              ] }),
              " ",
              conclusion
            ]
          },
          index
        )) })
      ] })
    ] })
  ] });
}
function StatsEngine() {
  return /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(StatsEngineContent, {}) });
}

const $$Estadisticas = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "DataTracker - Anal\xEDticas" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "StatsEngine", StatsEngine, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/StatsEngine", "client:component-export": "default" })} ${maybeRenderHead()}<div style="height: 60px;"></div> ` })}`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/estadisticas.astro", void 0);

const $$file = "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/estadisticas.astro";
const $$url = "/estadisticas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Estadisticas,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
