import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CJfq-tyP.mjs';
import { $ as $$Layout } from '../chunks/Layout_BnVrAAn4.mjs';
/* empty css                                        */
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Camera, Baby, AlertTriangle, FileText } from 'lucide-react';
import { L as LanguageProvider, u as useLanguage } from '../chunks/i18n_Bd6mPn--.mjs';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
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
const CHART_PALETTE = [
  STATS_COLORS.primary,
  STATS_COLORS.critical,
  STATS_COLORS.secondary,
  STATS_COLORS.neutral,
  STATS_COLORS.gray1,
  STATS_COLORS.gray2,
  STATS_COLORS.gray3
];
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
      dy: 12,
      textAnchor: "middle",
      fill: "#94a3b8",
      fontSize: 9,
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
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(BarChart, { data, margin: { top: 20, right: 10, left: 0, bottom: 40 }, children: [
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
        contentStyle: {
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          fontSize: "12px"
        },
        formatter: (value) => value !== void 0 ? [`${value} casos`, ""] : ["", ""],
        cursor: { fill: "rgba(100, 116, 139, 0.1)" }
      }
    ),
    /* @__PURE__ */ jsx(Bar, { dataKey: "value", fill: color, radius: [4, 4, 0, 0] })
  ] }) });
}
function StatsDonutChart({
  data,
  height = 200,
  colors = CHART_PALETTE
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(PieChart, { children: [
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
        label: ({ name, value }) => `${name}: ${(value / total * 100).toFixed(0)}%`,
        labelLine: false,
        children: data.map((_, index) => /* @__PURE__ */ jsx(Cell, { fill: colors[index % colors.length] }, `cell-${index}`))
      }
    ),
    /* @__PURE__ */ jsx(
      Tooltip,
      {
        contentStyle: {
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          fontSize: "12px"
        },
        formatter: (value) => typeof value === "number" ? [`${value} casos (${(value / total * 100).toFixed(1)}%)`, ""] : ["", ""]
      }
    )
  ] }) });
}
function StatsTimelineChart({
  data,
  height = 250
}) {
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxs(AreaChart, { data, margin: { top: 10, right: 10, left: -10, bottom: 0 }, children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorCases", x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: STATS_COLORS.primary, stopOpacity: 0.3 }),
      /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: STATS_COLORS.primary, stopOpacity: 0 })
    ] }) }),
    /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0", vertical: false, className: "dark:stroke-slate-700" }),
    /* @__PURE__ */ jsx(
      XAxis,
      {
        dataKey: "date",
        tick: { fill: STATS_COLORS.muted, fontSize: 11 },
        tickLine: false,
        axisLine: { stroke: "#e2e8f0" }
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
        contentStyle: {
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          fontSize: "12px"
        },
        formatter: (value) => value !== void 0 ? [`${value} casos`, ""] : ["", ""]
      }
    ),
    /* @__PURE__ */ jsx(
      Area,
      {
        type: "monotone",
        dataKey: "cases",
        stroke: STATS_COLORS.primary,
        strokeWidth: 2,
        fill: "url(#colorCases)"
      }
    )
  ] }) });
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
function generateConclusions(report) {
  const conclusions = [];
  const photoPercentage = report.casesWithPhoto / report.totalCases * 100;
  if (photoPercentage >= 80) {
    conclusions.push(`El ${photoPercentage.toFixed(1)}% de los casos de presos políticos cuenta con registro fotográfico, lo cual es fundamental para la documentación de violaciones a los derechos humanos.`);
  } else if (photoPercentage >= 50) {
    conclusions.push(`El ${photoPercentage.toFixed(1)}% de los presos políticos documentados cuenta con fotografía. Es importante continuar recopilando material visual para fortalecer los expedientes de denuncia internacional.`);
  } else {
    conclusions.push(`Solo el ${photoPercentage.toFixed(1)}% de los casos cuenta con registro fotográfico. La falta de documentación visual dificulta las denuncias ante organismos internacionales de derechos humanos.`);
  }
  if (report.ageStats) {
    const { mean, stdDev, mode } = report.ageStats;
    conclusions.push(`La edad promedio de los presos políticos es de ${mean.toFixed(1)} años (desviación estándar: ±${stdDev.toFixed(1)} años), siendo ${mode} años la edad más frecuente. Esto evidencia que la persecución política afecta principalmente a la población en edad productiva.`);
    const minorsGroup = report.ageGroups.find((g) => g.label.includes("Menores"));
    if (minorsGroup && minorsGroup.percentage > 5) {
      conclusions.push(`GRAVE VIOLACIÓN: El ${minorsGroup.percentage.toFixed(1)}% de los detenidos son menores de edad (${minorsGroup.count} personas). La detención de menores constituye una violación flagrante de la Convención sobre los Derechos del Niño y el Estatuto de Roma.`);
    }
  }
  const { masculino, femenino, total } = report.genderDistribution;
  const malePercentage = masculino / total * 100;
  const femalePercentage = femenino / total * 100;
  if (malePercentage > 70) {
    conclusions.push(`El ${malePercentage.toFixed(1)}% de los presos políticos son hombres, lo cual refleja patrones de persecución selectiva. Sin embargo, el ${femalePercentage.toFixed(1)}% de mujeres detenidas también evidencia que la represión no discrimina por género.`);
  } else if (femalePercentage > 30) {
    conclusions.push(`El ${femalePercentage.toFixed(1)}% de los presos políticos son mujeres, una proporción significativamente alta que evidencia la persecución sistemática sin distinción de género.`);
  }
  if (report.topProfessions.length > 0) {
    const topProf = report.topProfessions.slice(0, 3);
    const topProfNames = topProf.map((p) => p.value).join(", ");
    conclusions.push(`Los sectores más afectados por la detención arbitraria son: ${topProfNames}. Este patrón sugiere persecución dirigida a grupos específicos de la sociedad civil.`);
    const studentProf = report.topProfessions.find((p) => p.value.includes("Estudiante"));
    if (studentProf && studentProf.pi > 10) {
      conclusions.push(`ALERTA: Los estudiantes representan el ${studentProf.pi.toFixed(1)}% de los presos políticos, evidenciando la criminalización del activismo estudiantil y la represión del derecho a la protesta.`);
    }
    const activistProf = report.topProfessions.find(
      (p) => p.value.includes("Político") || p.value.includes("Activista") || p.value.includes("DDHH")
    );
    if (activistProf) {
      conclusions.push(`El ${activistProf.pi.toFixed(1)}% de los detenidos son activistas políticos, defensores de derechos humanos o dirigentes de partidos de oposición, confirmando el carácter político de las detenciones.`);
    }
  }
  if (report.topLocations.length > 0) {
    const topLoc = report.topLocations[0];
    if (topLoc.pi > 15) {
      conclusions.push(`Se identifica una alta concentración de detenciones en ${topLoc.value} (${topLoc.pi.toFixed(1)}% del total), lo cual podría indicar operativos coordinados de represión en esta zona.`);
    }
  }
  if (report.monthlyTrend.length >= 3) {
    const lastThreeMonths = report.monthlyTrend.slice(-3);
    const firstMonth = lastThreeMonths[0].count;
    const lastMonth = lastThreeMonths[lastThreeMonths.length - 1].count;
    if (lastMonth > firstMonth * 1.5) {
      conclusions.push(`ALERTA: Se observa un incremento alarmante en las detenciones durante los últimos meses, lo cual podría indicar una escalada represiva. Es urgente la atención de la comunidad internacional.`);
    } else if (lastMonth < firstMonth * 0.5) {
      conclusions.push(`Se observa una disminución en el registro de nuevas detenciones. Esto podría deberse a liberaciones, pero también a dificultades en la documentación de casos nuevos.`);
    }
  }
  conclusions.push(`En total, se han documentado ${report.totalCases} casos de presos políticos. Esta información constituye evidencia de violaciones sistemáticas a los derechos humanos en Venezuela y debe ser utilizada para exigir la liberación inmediata de todos los detenidos políticos, así como para sustentar denuncias ante la Corte Penal Internacional, la CIDH y otros organismos internacionales.`);
  return conclusions;
}
function generateStatisticalReport(data) {
  const now = /* @__PURE__ */ new Date();
  const totalCases = data.length;
  const casesWithPhoto = data.filter((d) => d.imagen && d.imagen.length > 0).length;
  const casesWithCompleteData = data.filter((d) => d.nombre && d.edad && d.sexo).length;
  const dates = data.map((d) => d.fecha).filter((f) => f !== void 0 && f !== null && f.length > 0).sort();
  const periodStart = dates.length > 0 ? dates[0] : null;
  const periodEnd = dates.length > 0 ? dates[dates.length - 1] : null;
  const ages = data.map((d) => d.edad).filter((age) => age !== void 0 && age !== null && age > 0 && age <= 120);
  const ageStats = calculateDescriptiveStats(ages);
  const minors = data.filter((d) => d.edad !== void 0 && d.edad < 18).length;
  const adults = data.filter((d) => d.edad !== void 0 && d.edad >= 18 && d.edad < 65).length;
  const seniors = data.filter((d) => d.edad !== void 0 && d.edad >= 65).length;
  const ageUnknown = data.filter((d) => d.edad === void 0 || d.edad === null).length;
  const ageGroups = [
    { label: "Menores de 18", count: minors, percentage: minors / totalCases * 100 },
    { label: "Adultos (18-64)", count: adults, percentage: adults / totalCases * 100 },
    { label: "Mayores de 65", count: seniors, percentage: seniors / totalCases * 100 },
    { label: "Edad no especificada", count: ageUnknown, percentage: ageUnknown / totalCases * 100 }
  ];
  const normalizeGender = (sex) => {
    if (!sex) return "U";
    const s = sex.toLowerCase().trim();
    if (s === "masculino" || s === "hombre" || s === "m") return "M";
    if (s === "femenino" || s === "mujer" || s === "f") return "F";
    return "U";
  };
  const genders = data.map((d) => normalizeGender(d.sexo));
  const masculino = genders.filter((g) => g === "M").length;
  const femenino = genders.filter((g) => g === "F").length;
  const genderDistribution = {
    masculino,
    femenino,
    noEspecificado: totalCases - masculino - femenino,
    total: totalCases
  };
  const professions = data.filter((d) => d.profesion && d.profesion.trim()).map((d) => categorizarProfesion(d.profesion));
  const topProfessions = buildFrequencyTable(professions).slice(0, 10);
  const normalizeLocation = (loc) => {
    if (!loc) return "";
    const l = loc.toLowerCase().trim();
    if (l.includes("tocuyito")) return "C.P. Tocuyito";
    if (l.includes("trujillo") || l === "valera") return "Edo. Trujillo";
    if (l.includes("helicoide")) return "El Helicoide (SEBIN)";
    if (l.includes("bolivar")) return "Edo. Bolívar";
    if (l.includes("caracas") || l.includes("distrito capital")) return "Caracas (D.C.)";
    return loc.trim();
  };
  const locations = data.filter((d) => d.lugar_de_desaparicion || d.lugar_de_confinamiento).map((d) => {
    const lugar = d.lugar_de_desaparicion || d.lugar_de_confinamiento || "";
    const parts = lugar.split(",");
    const baseLugar = parts.length > 1 ? parts[parts.length - 1].trim() : lugar.trim();
    return normalizeLocation(baseLugar);
  }).filter((l) => l && l.length > 0);
  const topLocations = buildFrequencyTable(locations).slice(0, 10);
  const monthlyMap = /* @__PURE__ */ new Map();
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  data.forEach((d) => {
    if (d.fecha) {
      const parts = d.fecha.split("-");
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
    topProfessions,
    topLocations,
    monthlyTrend
  };
  const conclusions = generateConclusions(partialReport);
  return {
    ...partialReport,
    conclusions
  };
}

function generateTextReport(report) {
  const lines = [];
  const divider = "═".repeat(70);
  const subDivider = "─".repeat(50);
  lines.push(divider);
  lines.push("           INFORME ESTADÍSTICO - NO MÁS SECUESTROS");
  lines.push(`                    Generado: ${formatDate$1(report.generatedAt)}`);
  lines.push(divider);
  lines.push("");
  lines.push("1. RESUMEN GENERAL");
  lines.push("   " + subDivider);
  lines.push(`   • Total de casos registrados: ${report.totalCases.toLocaleString()}`);
  lines.push(`   • Casos con datos completos: ${report.casesWithCompleteData.toLocaleString()} (${(report.casesWithCompleteData / report.totalCases * 100).toFixed(1)}%)`);
  lines.push(`   • Casos con fotografía: ${report.casesWithPhoto.toLocaleString()} (${(report.casesWithPhoto / report.totalCases * 100).toFixed(1)}%)`);
  if (report.periodStart && report.periodEnd) {
    lines.push(`   • Período analizado: ${report.periodStart} al ${report.periodEnd}`);
  }
  lines.push("");
  lines.push("2. ANÁLISIS DEMOGRÁFICO - EDAD");
  lines.push("   " + subDivider);
  if (report.ageStats) {
    lines.push(`   • Media aritmética: ${report.ageStats.mean.toFixed(1)} años`);
    lines.push(`   • Mediana: ${report.ageStats.median.toFixed(1)} años`);
    lines.push(`   • Moda: ${report.ageStats.mode ?? "N/A"} años`);
    lines.push(`   • Desviación estándar: ±${report.ageStats.stdDev.toFixed(2)} años`);
    lines.push(`   • Rango: ${report.ageStats.min} - ${report.ageStats.max} años`);
    lines.push(`   • Coeficiente de variación: ${report.ageStats.cv.toFixed(2)}%`);
  } else {
    lines.push("   • Datos de edad insuficientes para análisis");
  }
  lines.push("");
  lines.push("   Distribución por grupos de edad:");
  lines.push("   ┌──────────────────────────┬──────────┬──────────┐");
  lines.push("   │ Grupo                    │ Casos    │ %        │");
  lines.push("   ├──────────────────────────┼──────────┼──────────┤");
  for (const group of report.ageGroups) {
    const label = group.label.padEnd(24);
    const count = group.count.toString().padStart(8);
    const pct = group.percentage.toFixed(1).padStart(7) + "%";
    lines.push(`   │ ${label} │ ${count} │ ${pct} │`);
  }
  lines.push("   └──────────────────────────┴──────────┴──────────┘");
  lines.push("");
  lines.push("3. ANÁLISIS POR GÉNERO");
  lines.push("   " + subDivider);
  lines.push("   ┌──────────────────────────┬──────────┬──────────┐");
  lines.push("   │ Género                   │ Casos    │ %        │");
  lines.push("   ├──────────────────────────┼──────────┼──────────┤");
  const genders = [
    { label: "Masculino", count: report.genderDistribution.masculino },
    { label: "Femenino", count: report.genderDistribution.femenino },
    { label: "No especificado", count: report.genderDistribution.noEspecificado }
  ];
  for (const g of genders) {
    const label = g.label.padEnd(24);
    const count = g.count.toString().padStart(8);
    const pct = (g.count / report.genderDistribution.total * 100).toFixed(1).padStart(7) + "%";
    lines.push(`   │ ${label} │ ${count} │ ${pct} │`);
  }
  lines.push("   └──────────────────────────┴──────────┴──────────┘");
  lines.push("");
  lines.push("4. TOP 10 PROFESIONES MÁS AFECTADAS");
  lines.push("   " + subDivider);
  lines.push("   ┌────┬──────────────────────────────┬──────────┬──────────┐");
  lines.push("   │ #  │ Profesión                    │ Casos    │ %        │");
  lines.push("   ├────┼──────────────────────────────┼──────────┼──────────┤");
  report.topProfessions.forEach((prof, index) => {
    const num = (index + 1).toString().padStart(2);
    const label = prof.value.substring(0, 28).padEnd(28);
    const count = prof.fi.toString().padStart(8);
    const pct = prof.pi.toFixed(1).padStart(7) + "%";
    lines.push(`   │ ${num} │ ${label} │ ${count} │ ${pct} │`);
  });
  lines.push("   └────┴──────────────────────────────┴──────────┴──────────┘");
  lines.push("");
  lines.push("5. DISTRIBUCIÓN GEOGRÁFICA (Top 10)");
  lines.push("   " + subDivider);
  lines.push("   ┌────┬──────────────────────────────┬──────────┬──────────┐");
  lines.push("   │ #  │ Ubicación                    │ Casos    │ %        │");
  lines.push("   ├────┼──────────────────────────────┼──────────┼──────────┤");
  report.topLocations.forEach((loc, index) => {
    const num = (index + 1).toString().padStart(2);
    const label = loc.value.substring(0, 28).padEnd(28);
    const count = loc.fi.toString().padStart(8);
    const pct = loc.pi.toFixed(1).padStart(7) + "%";
    lines.push(`   │ ${num} │ ${label} │ ${count} │ ${pct} │`);
  });
  lines.push("   └────┴──────────────────────────────┴──────────┴──────────┘");
  lines.push("");
  if (report.monthlyTrend.length > 0) {
    lines.push("6. TENDENCIA TEMPORAL (Últimos 12 meses)");
    lines.push("   " + subDivider);
    lines.push("   ┌──────────────┬──────────┐");
    lines.push("   │ Mes          │ Casos    │");
    lines.push("   ├──────────────┼──────────┤");
    for (const m of report.monthlyTrend) {
      const month = m.month.padEnd(12);
      const count = m.count.toString().padStart(8);
      lines.push(`   │ ${month} │ ${count} │`);
    }
    lines.push("   └──────────────┴──────────┘");
    lines.push("");
  }
  lines.push("7. CONCLUSIONES Y OBSERVACIONES");
  lines.push("   " + subDivider);
  report.conclusions.forEach((conclusion, index) => {
    lines.push(`   ${index + 1}. ${conclusion}`);
    lines.push("");
  });
  lines.push(divider);
  lines.push("   Este informe fue generado automáticamente por el sistema");
  lines.push("   NoMásSecuestros. Los datos presentados son de carácter");
  lines.push("   informativo y deben ser verificados con fuentes oficiales.");
  lines.push(divider);
  return lines.join("\n");
}
function generateCSVReport(report) {
  const lines = [];
  lines.push("RESUMEN GENERAL");
  lines.push("Métrica,Valor,Porcentaje");
  lines.push(`Total de casos,${report.totalCases},100%`);
  lines.push(`Casos con fotografía,${report.casesWithPhoto},${(report.casesWithPhoto / report.totalCases * 100).toFixed(1)}%`);
  lines.push(`Casos con datos completos,${report.casesWithCompleteData},${(report.casesWithCompleteData / report.totalCases * 100).toFixed(1)}%`);
  lines.push("");
  if (report.ageStats) {
    lines.push("ESTADÍSTICAS DE EDAD");
    lines.push("Medida,Valor");
    lines.push(`Media,${report.ageStats.mean.toFixed(2)}`);
    lines.push(`Mediana,${report.ageStats.median.toFixed(2)}`);
    lines.push(`Moda,${report.ageStats.mode ?? "N/A"}`);
    lines.push(`Desviación Estándar,${report.ageStats.stdDev.toFixed(2)}`);
    lines.push(`Varianza,${report.ageStats.variance.toFixed(2)}`);
    lines.push(`Rango,${report.ageStats.range}`);
    lines.push(`CV,${report.ageStats.cv.toFixed(2)}%`);
    lines.push("");
  }
  lines.push("DISTRIBUCIÓN POR EDAD");
  lines.push("Grupo,Casos,Porcentaje");
  for (const group of report.ageGroups) {
    lines.push(`${group.label},${group.count},${group.percentage.toFixed(1)}%`);
  }
  lines.push("");
  lines.push("DISTRIBUCIÓN POR GÉNERO");
  lines.push("Género,Casos,Porcentaje");
  lines.push(`Masculino,${report.genderDistribution.masculino},${(report.genderDistribution.masculino / report.totalCases * 100).toFixed(1)}%`);
  lines.push(`Femenino,${report.genderDistribution.femenino},${(report.genderDistribution.femenino / report.totalCases * 100).toFixed(1)}%`);
  lines.push(`No especificado,${report.genderDistribution.noEspecificado},${(report.genderDistribution.noEspecificado / report.totalCases * 100).toFixed(1)}%`);
  lines.push("");
  lines.push("TOP PROFESIONES");
  lines.push("Profesión,Frecuencia Absoluta,Frecuencia Relativa,Porcentaje,Frecuencia Acumulada");
  for (const prof of report.topProfessions) {
    lines.push(`"${prof.value}",${prof.fi},${prof.hi.toFixed(4)},${prof.pi.toFixed(2)}%,${prof.Fi}`);
  }
  lines.push("");
  lines.push("TOP UBICACIONES");
  lines.push("Ubicación,Frecuencia Absoluta,Frecuencia Relativa,Porcentaje,Frecuencia Acumulada");
  for (const loc of report.topLocations) {
    lines.push(`"${loc.value}",${loc.fi},${loc.hi.toFixed(4)},${loc.pi.toFixed(2)}%,${loc.Fi}`);
  }
  lines.push("");
  lines.push("TENDENCIA MENSUAL");
  lines.push("Mes,Casos");
  for (const m of report.monthlyTrend) {
    lines.push(`${m.month},${m.count}`);
  }
  return lines.join("\n");
}
function formatDate$1(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function downloadReport(content, filename, type) {
  const mimeType = type === "csv" ? "text/csv;charset=utf-8;" : "text/plain;charset=utf-8;";
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const COLORS = {
  primary: [21, 101, 192],
  // Dark gray
  text: [0, 0, 0],
  // Gray
  tableHeader: [227, 242, 253],
  // Light gray
  alert: [198, 40, 40]
  // Red
};
const MARGINS = {
  top: 25.4,
  right: 25.4,
  bottom: 25.4,
  left: 25.4
};
const FONTS = {
  title: 16,
  heading1: 14,
  heading2: 12,
  body: 11,
  small: 10,
  tiny: 9};
const APA_TABLE_STYLE = {
  theme: "plain",
  styles: {
    fontSize: FONTS.small,
    cellPadding: 2,
    font: "helvetica",
    textColor: COLORS.text
  },
  headStyles: {
    fontStyle: "bold",
    fillColor: [255, 255, 255],
    textColor: COLORS.text,
    lineWidth: { bottom: 0.2 },
    lineColor: [0, 0, 0]
  },
  tableLineColor: [0, 0, 0],
  tableLineWidth: { top: 0.2, bottom: 0.2 }
};
function generateProfessionalPDF(report) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter"
  });
  let currentY = MARGINS.top;
  currentY = addCoverPage(doc, report);
  doc.addPage();
  currentY = MARGINS.top;
  currentY = addExecutiveSummary(doc, report, currentY);
  currentY = addIntroduction(doc, report, currentY);
  currentY = addJurisdictionalNote(doc, currentY);
  currentY = addDemographicAnalysis(doc, report, currentY);
  currentY = addGenderAnalysis(doc, report, currentY);
  currentY = addOccupationalAnalysis(doc, report, currentY);
  currentY = addGeographicAnalysis(doc, report, currentY);
  if (report.monthlyTrend.length > 0) {
    currentY = addTemporalAnalysis(doc, report, currentY);
  }
  currentY = addConclusions(doc, report, currentY);
  addPageNumbers(doc);
  const filename = `Informe_Estadistico_${formatDateForFilename(report.generatedAt)}.pdf`;
  doc.save(filename);
}
function addCoverPage(doc, report) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = pageHeight / 3;
  doc.setFontSize(FONTS.title + 4);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  const title = "INFORME ESTADÍSTICO";
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, y);
  y += 15;
  doc.setFontSize(FONTS.heading1);
  const subtitle = "Análisis de Presos Políticos en Venezuela";
  const subtitleWidth = doc.getTextWidth(subtitle);
  doc.text(subtitle, (pageWidth - subtitleWidth) / 2, y);
  y += 20;
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.text);
  if (report.periodStart && report.periodEnd) {
    const period = `Período: ${report.periodStart} - ${report.periodEnd}`;
    const periodWidth = doc.getTextWidth(period);
    doc.text(period, (pageWidth - periodWidth) / 2, y);
    y += 10;
  }
  const genDate = `Fecha de generación: ${formatDate(report.generatedAt)}`;
  const genDateWidth = doc.getTextWidth(genDate);
  doc.text(genDate, (pageWidth - genDateWidth) / 2, y);
  y += 30;
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "italic");
  const org = "Sistema Automatizado de Análisis Estadístico";
  const orgWidth = doc.getTextWidth(org);
  doc.text(org, (pageWidth - orgWidth) / 2, y);
  y += 5;
  const project = "NO MÁS SECUESTROS";
  const projectWidth = doc.getTextWidth(project);
  doc.text(project, (pageWidth - projectWidth) / 2, y);
  return y;
}
function addExecutiveSummary(doc, report, startY) {
  let y = startY;
  y = addSectionTitle(doc, "RESUMEN EJECUTIVO", y);
  const summary = generateExecutiveSummaryText(report);
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.text);
  const lines = doc.splitTextToSize(summary, doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right);
  for (const line of lines) {
    y = checkPageBreak(doc, y, 10);
    doc.text(line, MARGINS.left, y);
    y += 6;
  }
  y += 10;
  return y;
}
function generateExecutiveSummaryText(report) {
  const totalCases = report.totalCases.toLocaleString();
  const avgAge = report.ageStats?.mean.toFixed(1) || "N/A";
  const malePercent = (report.genderDistribution.masculino / report.totalCases * 100).toFixed(1);
  const topProfession = report.topProfessions[0]?.value || "N/A";
  const topLocation = report.topLocations[0]?.value || "N/A";
  return sanitizeText(`El presente informe analiza ${totalCases} casos registrados de presos políticos en Venezuela. Los datos revelan que la edad promedio de las personas afectadas es de ${avgAge} años, con una distribución de género donde el ${malePercent}% son hombres. El análisis ocupacional muestra que "${topProfession}" es la profesión más afectada, mientras que "${topLocation}" representa la ubicación geográfica con mayor concentración de casos. Este informe presenta un análisis estadístico detallado que evidencia patrones sistemáticos de persecución política y violaciones a los derechos humanos en el país.`);
}
function addIntroduction(doc, report, startY) {
  let y = startY;
  y = addSectionTitle(doc, "Introducción", y);
  const intro = `El presente análisis estadístico se inscribe en el marco de la documentación sistemática de situaciones de detención arbitraria con fines políticos en la República Bolivariana de Venezuela. El objetivo primordial de este documento es proporcionar un sustrato cuantitativo que coadyuve a la identificación de patrones de persecución sistemática, en concordancia con los estándares internacionales de derechos humanos.

Metodología y Transparencia Técnica: La presente base de datos se construye mediante la técnica de monitoreo ciudadano y agregación de fuentes abiertas (Open Source Intelligence - OSINT). La información ha sido sistematizada a partir del cruce de reportes de organizaciones no gubernamentales reconocidas (como Foro Penal), denuncias públicas en plataformas digitales y reportes directos verificados de la comunidad. Este mecanismo busca vencer la opacidad institucional, sirviendo como un registro sombra o "shadow report" que alerta sobre tendencias y patrones de vulneración, aunque su naturaleza es de alerta temprana y no sustituye el expediente judicial individual.

Alcance y Sustento Jurídico: Este informe abarca un universo de ${report.totalCases.toLocaleString()} casos registrados` + (report.periodStart && report.periodEnd ? ` durante el período comprendido entre ${report.periodStart} y ${report.periodEnd}` : "") + `. Las conductas aquí descritas podrían subsumirse en los supuestos previstos en el Artículo 7 del Estatuto de Roma de la Corte Penal Internacional (Corte Penal Internacional [CPI], 1998), particularmente en lo relativo al encarcelamiento u otra privación grave de la libertad física en violación de normas fundamentales de derecho internacional.`;
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.text);
  const lines = doc.splitTextToSize(intro, doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right);
  for (const line of lines) {
    y = checkPageBreak(doc, y, 10);
    doc.text(line, MARGINS.left, y);
    y += 6;
  }
  y += 10;
  return y;
}
function addJurisdictionalNote(doc, startY) {
  let y = startY;
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxWidth = pageWidth - MARGINS.left - MARGINS.right;
  y = checkPageBreak(doc, y, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONTS.small);
  doc.setTextColor(...COLORS.alert);
  doc.text("NOTA SOBRE ESTATUS JURISDICCIONAL (Actualización Enero 2026):", MARGINS.left, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.text);
  const noteText = `Se hace constar que la reciente sanción legislativa (Diciembre 2025) orientada a derogar el Estatuto de Roma por parte de la Asamblea Nacional no afecta la competencia material de la Corte Penal Internacional sobre los hechos aquí documentados (2018-2024). De conformidad con el Artículo 127.2 del Estatuto, la retirada no exime al Estado de las obligaciones surgidas durante su permanencia. Por el contrario, esta maniobra legislativa se interpreta en este informe como un elemento agravante que evidencia la "falta de disposición" (unwillingness) genuina del Estado para administrar justicia doméstica, reforzando la admisibilidad del caso ante la jurisdicción internacional.`;
  const lines = doc.splitTextToSize(noteText, boxWidth);
  for (const line of lines) {
    y = checkPageBreak(doc, y, 7);
    doc.text(line, MARGINS.left, y);
    y += 5;
  }
  y += 10;
  return y;
}
function addDemographicAnalysis(doc, report, startY) {
  let y = startY;
  y = addSectionTitle(doc, "Análisis Demográfico", y);
  y = addSubsectionTitle(doc, "Estadísticas Descriptivas de la Variable Edad", y);
  if (report.ageStats) {
    y = checkPageBreak(doc, y, 60);
    doc.setFontSize(FONTS.small);
    doc.setFont("helvetica", "italic");
    doc.text("Tabla 1. Medidas de tendencia central y dispersión de la edad", MARGINS.left, y - 2);
    autoTable(doc, {
      ...APA_TABLE_STYLE,
      startY: y,
      head: [["Medida Estadística", "Valor"]],
      body: [
        ["Media aritmética", `${report.ageStats.mean.toFixed(2)} años`],
        ["Mediana", `${report.ageStats.median.toFixed(2)} años`],
        ["Moda", `${report.ageStats.mode ?? "N/A"} años`],
        ["Desviación estándar", `±${report.ageStats.stdDev.toFixed(2)} años`],
        ["Varianza", `${report.ageStats.variance.toFixed(2)}`],
        ["Rango", `${report.ageStats.min} - ${report.ageStats.max} años`],
        ["Coeficiente de variación", `${report.ageStats.cv.toFixed(2)}%`]
      ],
      margin: { left: MARGINS.left, right: MARGINS.right }
    });
    y = doc.lastAutoTable.finalY + 10;
  }
  y = addSubsectionTitle(doc, "Distribución por Intervalos de Edad", y);
  y = checkPageBreak(doc, y, 60);
  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "italic");
  doc.text("Tabla 2. Frecuencias por grupos de edad", MARGINS.left, y - 2);
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [["Grupo de Edad", "Frecuencia Absoluta", "Porcentaje"]],
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
function addGenderAnalysis(doc, report, startY) {
  let y = startY;
  y = addSectionTitle(doc, "Análisis por Género", y);
  y = checkPageBreak(doc, y, 50);
  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "italic");
  doc.text("Tabla 3. Distribución de casos según género", MARGINS.left, y - 2);
  const genderData = [
    ["Masculino", report.genderDistribution.masculino, (report.genderDistribution.masculino / report.totalCases * 100).toFixed(1)],
    ["Femenino", report.genderDistribution.femenino, (report.genderDistribution.femenino / report.totalCases * 100).toFixed(1)],
    ["No especificado", report.genderDistribution.noEspecificado, (report.genderDistribution.noEspecificado / report.totalCases * 100).toFixed(1)]
  ];
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [["Género", "Frecuencia Absoluta", "Porcentaje"]],
    body: genderData.map((row) => [row[0], row[1].toString(), `${row[2]}%`]),
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 15;
  return y;
}
function addOccupationalAnalysis(doc, report, startY) {
  let y = startY;
  y = addSectionTitle(doc, "Análisis Ocupacional", y);
  y = addSubsectionTitle(doc, "Principales Sectores Ocupacionales Afectados", y);
  y = checkPageBreak(doc, y, 80);
  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "italic");
  doc.text("Tabla 4. Distribución de frecuencias por ocupación", MARGINS.left, y - 2);
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [["#", "Profesión", "Frec. Absoluta", "Frec. Relativa", "Porcentaje"]],
    body: report.topProfessions.map((prof, index) => [
      (index + 1).toString(),
      sanitizeText(prof.value),
      prof.fi.toString(),
      prof.hi.toFixed(4),
      `${prof.pi.toFixed(1)}%`
    ]),
    headStyles: { ...APA_TABLE_STYLE.headStyles, fontSize: FONTS.tiny },
    styles: { ...APA_TABLE_STYLE.styles, fontSize: FONTS.tiny },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 15;
  return y;
}
function addGeographicAnalysis(doc, report, startY) {
  let y = startY;
  y = addSectionTitle(doc, "Distribución Geográfica", y);
  y = addSubsectionTitle(doc, "Concentración de Casos por Ubicación", y);
  y = checkPageBreak(doc, y, 80);
  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "italic");
  doc.text("Tabla 5. Distribución de frecuencias por ubicación geográfica", MARGINS.left, y - 2);
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [["#", "Ubicación", "Frec. Absoluta", "Frec. Relativa", "Porcentaje"]],
    body: report.topLocations.map((loc, index) => [
      (index + 1).toString(),
      sanitizeText(loc.value),
      loc.fi.toString(),
      loc.hi.toFixed(4),
      `${loc.pi.toFixed(1)}%`
    ]),
    headStyles: { ...APA_TABLE_STYLE.headStyles, fontSize: FONTS.tiny },
    styles: { ...APA_TABLE_STYLE.styles, fontSize: FONTS.tiny },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 15;
  return y;
}
function addTemporalAnalysis(doc, report, startY) {
  let y = startY;
  y = addSectionTitle(doc, "6. ANÁLISIS TEMPORAL", y);
  y = addSubsectionTitle(doc, "Tendencia Mensual (Últimos 12 meses)", y);
  y = checkPageBreak(doc, y, 80);
  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "italic");
  doc.text("Tabla 6. Evolución cronológica de registros", MARGINS.left, y - 2);
  autoTable(doc, {
    ...APA_TABLE_STYLE,
    startY: y,
    head: [["Mes", "Casos Registrados"]],
    body: report.monthlyTrend.map((m) => [sanitizeText(m.month), m.count.toString()]),
    theme: "grid",
    headStyles: { fillColor: COLORS.tableHeader, textColor: COLORS.text, fontStyle: "bold" },
    styles: { fontSize: FONTS.small, cellPadding: 3 },
    columnStyles: {
      1: { halign: "right" }
    },
    margin: { left: MARGINS.left, right: MARGINS.right }
  });
  y = doc.lastAutoTable.finalY + 15;
  return y;
}
function addConclusions(doc, report, startY) {
  let y = startY;
  y = addSectionTitle(doc, "Conclusiones y Dictamen Técnico", y);
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.text);
  const formalConclusions = [
    `Primus: Los hallazgos estadísticos descritos en el presente informe evidencian una praxis sistemática de detenciones que afectan desproporcionadamente a la población civil en rango de edad productiva, lo cual sugiere una política de Estado orientada a la desarticulación de sectores sociales específicos.`,
    `Secundus: La alta incidencia constatada en el sector estudiantil (${(report.topProfessions.find((p) => p.value.includes("Estudiante"))?.pi || 0).toFixed(1)}%) constituye un sólido indicio de la criminalización del ejercicio del derecho a la protesta y a la libertad de expresión, conductas protegidas por instrumentos internacionales.`,
    `Tertius: Desde una perspectiva jurídica, la agregación de estos datos permite identificar elementos de juicio que podrían configurar crímenes de lesa humanidad, de conformidad con lo establecido en el Artículo 7.1.e del Estatuto de Roma (CPI, 1998), dada la naturaleza sistemática y dirigida contra una población civil.`,
    `Quartus: Se recomienda con carácter de urgencia la elevación de este sustrato probatorio ante la Oficina del Fiscal de la Corte Penal Internacional y la Misión Internacional Independiente de determinación de los hechos sobre la República Bolivariana de Venezuela, a los fines de sustentar procesos de investigación y determinación de responsabilidades individuales y de mando.`,
    `Quintus: La existencia de un porcentaje significativo de datos no especificados obedece a las condiciones de opacidad institucional y barreras en la documentación, lo cual refuerza la necesidad de este registro sombra para la visibilización de casos que de otro modo quedarían en el anonimato administrativo.`
  ];
  formalConclusions.forEach((conclusion, index) => {
    y = checkPageBreak(doc, y, 15);
    y += 4;
    const lines = doc.splitTextToSize(conclusion, doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right);
    for (const line of lines) {
      y = checkPageBreak(doc, y, 7);
      doc.text(line, MARGINS.left, y);
      y += 6;
    }
  });
  doc.setTextColor(...COLORS.text);
  doc.setFont("helvetica", "normal");
  y = checkPageBreak(doc, y, 30);
  doc.setFontSize(FONTS.small);
  doc.setFont("helvetica", "italic");
  const disclaimer = "Descargo de Responsabilidad: Los casos y datos aquí reflejados corresponden a denuncias ciudadanas recibidas y monitoreadas por el sistema NO MÁS SECUESTROS. Su inclusión obedece a criterios de verosimilitud y sistematización de fuentes abiertas, sin que ello constituya per se una sentencia judicial condenatoria o un expediente forense oficial e independiente de cotejo estatal.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right);
  for (const line of disclaimerLines) {
    y = checkPageBreak(doc, y, 7);
    doc.text(line, MARGINS.left, y);
    y += 5;
  }
  y += 10;
  y = addReferencesSection(doc, y);
  return y;
}
function addReferencesSection(doc, startY) {
  let y = startY;
  y = addSectionTitle(doc, "Referencias", y);
  const references = [
    "Corte Penal Internacional. (1998). Estatuto de Roma de la Corte Penal Internacional. https://www.icc-cpi.int/sites/default/files/RS-Spa.pdf",
    "Foro Penal. (2024). Reporte de Represión en Venezuela: Listado de Presos Políticos. https://foropenal.com/",
    "Naciones Unidas. (1948). Declaración Universal de Derechos Humanos. https://www.un.org/es/about-us/universal-declaration-of-human-rights",
    "Organización de los Estados Americanos. (1969). Convención Americana sobre Derechos Humanos (Pacto de San José). https://www.oas.org/dil/esp/tratados_b-32_convencion_americana_sobre_derechos_humanos.htm"
  ];
  doc.setFontSize(FONTS.body);
  doc.setFont("helvetica", "normal");
  references.forEach((ref) => {
    y = checkPageBreak(doc, y, 15);
    const lines = doc.splitTextToSize(ref, doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right);
    lines.forEach((line, index) => {
      const xPos = index === 0 ? MARGINS.left : MARGINS.left + 5;
      doc.text(line, xPos, y);
      y += 6;
    });
    y += 2;
  });
  return y;
}
function addSectionTitle(doc, title, y) {
  y = checkPageBreak(doc, y, 25);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(FONTS.heading1);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.text);
  const textWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - textWidth) / 2, y);
  y += 12;
  return y;
}
function addSubsectionTitle(doc, title, y) {
  const nextY = checkPageBreak(doc, y, 15);
  doc.setFontSize(FONTS.heading2);
  doc.setFont("helvetica", "bold");
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
function addPageNumbers(doc) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(FONTS.small);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.text);
    const pageText = `Página ${i - 1} de ${pageCount - 1}`;
    const textWidth = doc.getTextWidth(pageText);
    doc.text(pageText, pageWidth - MARGINS.right - textWidth, MARGINS.top - 10);
  }
}
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function formatDateForFilename(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}
function sanitizeText(text) {
  if (!text) return "";
  return text.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s\.,:;()!?"'\/\-\+\=]/g, "").replace(/\s+/g, " ").trim();
}

function StatsEngineContent() {
  const { translate } = useLanguage();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("/api/desaparecidos?estado_registro=aprobado").then((response) => response.json()).then((data2) => {
      setData(data2.desaparecidos || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);
  const casosRegistrados = data.length;
  const casosConDatosCompletos = data.filter((d) => d.nombre && d.edad && d.sexo).length;
  const hombres = data.filter((d) => d.sexo === "Masculino").length;
  const mujeres = data.filter((d) => d.sexo === "Femenino").length;
  const sinGenero = casosRegistrados - hombres - mujeres;
  const menores = data.filter((d) => d.edad !== void 0 && d.edad < 18).length;
  const adultos = data.filter((d) => d.edad !== void 0 && d.edad >= 18 && d.edad < 65).length;
  const mayores = data.filter((d) => d.edad !== void 0 && d.edad >= 65).length;
  const sinEdad = data.filter((d) => d.edad === void 0).length;
  const conImagen = data.filter((d) => d.imagen && d.imagen.length > 0).length;
  const venezolanos = data.filter((d) => d.extranjero === "V").length;
  const extranjeros = data.filter((d) => d.extranjero === "E").length;
  const top10Edades = useMemo(() => {
    const edadesCount = {};
    data.forEach((d) => {
      if (d.edad && d.edad > 0 && d.edad <= 100) {
        edadesCount[d.edad] = (edadesCount[d.edad] || 0) + 1;
      }
    });
    return Object.entries(edadesCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([edad, count]) => ({ name: `${edad} años`, value: count }));
  }, [data]);
  const casosPorEstado = useMemo(() => {
    const estadosCount = {};
    data.forEach((d) => {
      const estado = d.lugar_de_desaparicion || d.lugar_de_confinamiento || "Sin especificar";
      const parts = estado.split(",");
      const estadoNombre = parts.length > 1 ? parts[parts.length - 1].trim() : estado.trim();
      estadosCount[estadoNombre] = (estadosCount[estadoNombre] || 0) + 1;
    });
    return Object.entries(estadosCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([estado, count]) => ({ name: estado, value: count }));
  }, [data]);
  const casosPorMes = useMemo(() => {
    const mesesCount = {};
    data.forEach((d) => {
      if (d.fecha) {
        const parts = d.fecha.split("-");
        if (parts.length >= 2) {
          const mesKey = `${parts[0]}-${parts[1]}`;
          mesesCount[mesKey] = (mesesCount[mesKey] || 0) + 1;
        }
      }
    });
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return Object.entries(mesesCount).sort((a, b) => a[0].localeCompare(b[0])).slice(-12).map(([mes, count]) => {
      const [year, month] = mes.split("-");
      return { date: `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`, cases: count };
    });
  }, [data]);
  const profesionesTop = useMemo(() => {
    const categoriasCount = {};
    data.forEach((d) => {
      if (d.profesion && d.profesion.trim()) {
        const categoria = categorizarProfesion(d.profesion);
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
          title: "Total de Casos",
          value: casosRegistrados.toLocaleString(),
          icon: Users
        }
      ),
      /* @__PURE__ */ jsx(
        MetricCard,
        {
          title: "Con Fotografía",
          value: conImagen.toLocaleString(),
          icon: Camera
        }
      ),
      /* @__PURE__ */ jsx(
        MetricCard,
        {
          title: "Menores de Edad",
          value: menores.toLocaleString(),
          icon: Baby
        }
      ),
      /* @__PURE__ */ jsx(
        MetricCard,
        {
          title: "Datos Completos",
          value: casosConDatosCompletos.toLocaleString(),
          icon: AlertTriangle
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6", children: [
      casosPorMes.length > 0 && /* @__PURE__ */ jsx(ChartCard, { title: "📅 Casos Registrados por Mes", fullWidth: true, children: /* @__PURE__ */ jsx(StatsTimelineChart, { data: casosPorMes, height: 280 }) }),
      /* @__PURE__ */ jsx(ChartCard, { title: "👤 Distribución por Género", children: /* @__PURE__ */ jsx(
        StatsDonutChart,
        {
          data: [
            { name: "Hombres", value: hombres },
            { name: "Mujeres", value: mujeres },
            { name: "Sin especificar", value: sinGenero }
          ].filter((d) => d.value > 0)
        }
      ) }),
      /* @__PURE__ */ jsx(ChartCard, { title: "🌎 Por Nacionalidad", children: /* @__PURE__ */ jsx(
        StatsDonutChart,
        {
          data: [
            { name: "Venezolanos", value: venezolanos },
            { name: "Extranjeros", value: extranjeros }
          ].filter((d) => d.value > 0),
          colors: [STATS_COLORS.secondary, STATS_COLORS.neutral]
        }
      ) }),
      /* @__PURE__ */ jsx(ChartCard, { title: "📊 Distribución por Edad", children: /* @__PURE__ */ jsx(
        StatsDonutChart,
        {
          data: [
            { name: "Menores de 18", value: menores },
            { name: "Adultos (18-64)", value: adultos },
            { name: "Mayores de 65", value: mayores },
            { name: "Sin especificar", value: sinEdad }
          ].filter((d) => d.value > 0),
          colors: [STATS_COLORS.critical, STATS_COLORS.primary, STATS_COLORS.neutral, STATS_COLORS.gray1]
        }
      ) }),
      /* @__PURE__ */ jsx(ChartCard, { title: "📷 Calidad de Datos", children: /* @__PURE__ */ jsx(
        StatsDonutChart,
        {
          data: [
            { name: "Con fotografía", value: conImagen },
            { name: "Sin fotografía", value: casosRegistrados - conImagen }
          ],
          colors: [STATS_COLORS.primary, STATS_COLORS.gray1]
        }
      ) }),
      top10Edades.length > 0 && /* @__PURE__ */ jsx(ChartCard, { title: "🔢 Top 10 Edades Más Frecuentes", fullWidth: true, children: /* @__PURE__ */ jsx(StatsBarChart, { data: top10Edades, color: STATS_COLORS.secondary, height: 300 }) }),
      casosPorEstado.length > 0 && casosPorEstado[0].name !== "Sin especificar" && /* @__PURE__ */ jsx(ChartCard, { title: "📍 Casos por Ubicación (Top 10)", fullWidth: true, children: /* @__PURE__ */ jsx(StatsBarChart, { data: casosPorEstado, color: STATS_COLORS.primary, height: 350 }) }),
      profesionesTop.length > 0 && /* @__PURE__ */ jsx(ChartCard, { title: "💼 Profesiones Más Afectadas", fullWidth: true, children: /* @__PURE__ */ jsx(StatsBarChart, { data: profesionesTop, color: STATS_COLORS.neutral, height: 350 }) })
    ] }),
    /* @__PURE__ */ jsx(ReportSection, { data })
  ] });
}
function ReportSection({ data }) {
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
      generateProfessionalPDF(generatedReport);
      setIsGenerating(false);
    }, 500);
  }, [data]);
  useCallback(() => {
    if (!report) return;
    const content = generateTextReport(report);
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    downloadReport(content, `informe_estadistico_${date}.txt`, "text");
  }, [report]);
  useCallback(() => {
    if (!report) return;
    const content = generateCSVReport(report);
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    downloadReport(content, `datos_estadisticos_${date}.csv`, "csv");
  }, [report]);
  return /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-xl p-6 text-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-4", style: { fontFamily: "'Playfair Display', serif" }, children: "📊 Generar Informe Profesional" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Genera un informe estadístico profesional en formato PDF con análisis detallado, tablas formales y conclusiones basadas en los datos. Formato institucional tipo APA." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleGeneratePDF,
          disabled: isGenerating || data.length === 0,
          className: "inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold",
          children: isGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-current" }),
            "Generando PDF profesional..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
            "Generar Informe PDF"
          ] })
        }
      ),
      data.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-destructive text-xs mt-3", children: "No hay datos disponibles para generar el informe" })
    ] }),
    report && /* @__PURE__ */ jsxs("div", { className: "space-y-6 stats-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-green-200 font-semibold", children: "✅ Informe PDF generado exitosamente" }),
        /* @__PURE__ */ jsx("p", { className: "text-green-200/70 text-sm mt-1", children: "El archivo se ha descargado automáticamente" })
      ] }),
      report.ageStats && /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-4", style: { fontFamily: "'Playfair Display', serif" }, children: "📈 Resumen Estadístico de Edad" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground", children: report.ageStats.mean.toFixed(1) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Media (años)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground", children: report.ageStats.median.toFixed(1) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Mediana (años)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
              "±",
              report.ageStats.stdDev.toFixed(1)
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Desv. Estándar" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-background/50 rounded-lg p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-foreground", children: [
              report.ageStats.cv.toFixed(1),
              "%"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Coef. Variación" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-4", style: { fontFamily: "'Playfair Display', serif" }, children: "📝 Conclusiones y Observaciones" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: report.conclusions.map((conclusion, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `p-4 rounded-lg text-sm leading-relaxed ${conclusion.includes("ALERTA") || conclusion.includes("PREOCUPANTE") ? "bg-red-500/10 border border-red-500/30 text-red-200" : "bg-background/50 text-foreground/80"}`,
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "No M\xE1s Secuestros" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "StatsEngine", StatsEngine, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/StatsEngine", "client:component-export": "default" })} ${maybeRenderHead()}<div style="height: 60px;"></div> ` })}`;
}, "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/pages/estadisticas.astro", void 0);

const $$file = "C:/Users/arang/Desktop/Importante/NoMasSecuestros/src/pages/estadisticas.astro";
const $$url = "/estadisticas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Estadisticas,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
