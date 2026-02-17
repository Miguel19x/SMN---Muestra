import { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Camera, AlertTriangle, Baby, FileText, Download, FileSpreadsheet } from 'lucide-react';
import { LanguageProvider, useLanguage } from './additionals/scripts/i18n';
import MetricCard from './stats/MetricCard';
import {
  ChartCard,
  StatsBarChart,
  StatsDonutChart,
  StatsTimelineChart,
  STATS_COLORS,
} from './stats/StatsChartNew';
import type { DesaparecidoData } from './type/types';
import { categorizarProfesion } from '../utils/professionCategorizer';
import { generateStatisticalReport, normalizeLocation, normalizeNationality } from '../utils/statisticsCalculator';
import { generateTextReport, generateCSVReport, downloadReport } from '../utils/reportGenerator';
import { generateProfessionalPDF } from '../utils/pdfReportGenerator';

function StatsEngineContent() {
  const { translate, currentLang } = useLanguage();
  const [data, setData] = useState<DesaparecidoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/desaparecidos?estado_registro=aprobado')
      .then(response => response.json())
      .then(data => {
        setData(data.desaparecidos || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Estadísticas básicas
  const casosRegistrados = data.length;
  const casosConDatosCompletos = data.filter(d => d.nombre && d.edad && d.sexo).length;

  // Por género
  const hombres = data.filter(d => d.sexo === 'Masculino').length;
  const mujeres = data.filter(d => d.sexo === 'Femenino').length;
  const sinGenero = casosRegistrados - hombres - mujeres;

  // Por grupos de edad
  const menores = data.filter(d => d.edad !== undefined && d.edad < 18).length;
  const adultos = data.filter(d => d.edad !== undefined && d.edad >= 18 && d.edad < 65).length;
  const mayores = data.filter(d => d.edad !== undefined && d.edad >= 65).length;
  const sinEdad = data.filter(d => d.edad === undefined).length;

  // Con imagen vs sin imagen
  const conImagen = data.filter(d => d.imagen && d.imagen.length > 0).length;

  // Por nacionalidad (con detalle mejorado)
  const nacionalidades = data.map(d => normalizeNationality(d.nacionalidad));
  const venezolanos = nacionalidades.filter(n => n === 'Nacional').length;
  const sinNacionalidad = nacionalidades.filter(n => n === 'No especificada').length;
  const extranjeros = casosRegistrados - venezolanos - sinNacionalidad;

  // Top 10 edades más comunes
  const top10Edades = useMemo(() => {
    const edadesCount: { [key: number]: number } = {};
    data.forEach(d => {
      if (d.edad && d.edad > 0 && d.edad <= 100) {
        edadesCount[d.edad] = (edadesCount[d.edad] || 0) + 1;
      }
    });
    return Object.entries(edadesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([edad, count]) => ({ name: translate('Stats-Age-Years', { age: edad }), value: count }));
  }, [data, translate]);

  // Lugares de Desaparición (top 10)
  const desaparicionLocations = useMemo(() => {
    const locationsCount: { [key: string]: number } = {};
    data.forEach(d => {
      if (d.lugar_de_desaparicion && d.lugar_de_desaparicion.trim()) {
        const lugar = d.lugar_de_desaparicion;
        const parts = lugar.split(',');
        const baseName = parts.length > 1 ? parts[parts.length - 1].trim() : lugar.trim();
        const normalized = normalizeLocation(baseName);
        if (normalized) {
          locationsCount[normalized] = (locationsCount[normalized] || 0) + 1;
        }
      }
    });
    return Object.entries(locationsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([location, count]) => ({ name: location, value: count }));
  }, [data]);

  // Centros de Confinamiento (top 10)
  const confinementCenters = useMemo(() => {
    const centersCount: { [key: string]: number } = {};
    data.forEach(d => {
      if (d.lugar_de_confinamiento && d.lugar_de_confinamiento.trim()) {
        const lugar = d.lugar_de_confinamiento;
        const parts = lugar.split(',');
        const baseName = parts.length > 1 ? parts[parts.length - 1].trim() : lugar.trim();
        const normalized = normalizeLocation(baseName);
        if (normalized) {
          centersCount[normalized] = (centersCount[normalized] || 0) + 1;
        }
      }
    });
    return Object.entries(centersCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([center, count]) => ({ name: center, value: count }));
  }, [data]);

  // Casos por mes (línea de tiempo)
  const casosPorMes = useMemo(() => {
    const mesesCount: { [key: string]: number } = {};
    data.forEach(d => {
      if (d.fecha) {
        const parts = d.fecha.split('-');
        if (parts.length >= 2) {
          const mesKey = `${parts[0]}-${parts[1]}`;
          mesesCount[mesKey] = (mesesCount[mesKey] || 0) + 1;
        }
      }
    });

    const locale = currentLang === 'es' ? 'es-ES' : 'en-US';
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });

    return Object.entries(mesesCount)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([mes, count]) => {
        const [year, month] = mes.split('-');

        const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        let monthLabel = monthFormatter.format(monthDate);
        monthLabel = monthLabel.replace('.', '');
        monthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

        return { date: `${monthLabel} ${year.slice(2)}`, cases: count };
      });
  }, [data, currentLang]);

  // Usa la función categorizarProfesion importada desde ../utils/professionCategorizer

  // Por profesión (top 10 agrupados por categoría)
  const profesionesTop = useMemo(() => {
    const categoriasCount: { [key: string]: number } = {};
    data.forEach(d => {
      if (d.profesion && d.profesion.trim()) {
        const categoria = categorizarProfesion(d.profesion);
        categoriasCount[categoria] = (categoriasCount[categoria] || 0) + 1;
      }
    });
    return Object.entries(categoriasCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([profesion, count]) => ({ name: profesion, value: count }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <header className="mb-8 text-center">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {translate('Navbar-4')}
        </h1>
        {/* Tricolor accent bar */}
        <div className="flex h-1.5 w-32 sm:w-48 mx-auto rounded-full overflow-hidden">
          <div className="flex-1 tricolor-yellow"></div>
          <div className="flex-1 tricolor-blue"></div>
          <div className="flex-1 tricolor-red"></div>
        </div>
      </header>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <MetricCard
          title={translate('Stats-Metric-Total')}
          value={casosRegistrados.toLocaleString()}
          icon={Users}
        />
        <MetricCard
          title={translate('Stats-Metric-WithPhoto')}
          value={conImagen.toLocaleString()}
          icon={Camera}
        />
        <MetricCard
          title={translate('Stats-Metric-Minors')}
          value={menores.toLocaleString()}
          icon={Baby}
        />
        <MetricCard
          title={translate('Stats-Metric-CompleteData')}
          value={casosConDatosCompletos.toLocaleString()}
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Grid - Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Timeline - Full Width */}
        {casosPorMes.length > 0 && (
          <ChartCard title={translate('Stats-Chart-CasesPerMonth')} fullWidth>
            <StatsTimelineChart data={casosPorMes} height={280} />
          </ChartCard>
        )}

        {/* Gender Donut */}
        <ChartCard title={translate('Stats-Chart-GenderDistribution')}>
          <StatsDonutChart
            data={[
              { name: translate('Stats-Label-Men'), value: hombres },
              { name: translate('Stats-Label-Women'), value: mujeres },
              { name: translate('Stats-Label-NotSpecified'), value: sinGenero },
            ].filter(d => d.value > 0)}
          />
        </ChartCard>

        {/* Nationality Donut */}
        <ChartCard title={translate('Stats-Chart-ByNationality')}>
          <StatsDonutChart
            data={[
              { name: translate('Stats-Label-Venezuelans'), value: venezolanos },
              { name: translate('Stats-Label-Foreigners'), value: extranjeros },
              { name: translate('Stats-Label-NotSpecified'), value: sinNacionalidad },
            ].filter(d => d.value > 0)}
            colors={[STATS_COLORS.secondary, STATS_COLORS.neutral, STATS_COLORS.gray1]}
          />
        </ChartCard>

        {/* Age Distribution */}
        <ChartCard title={translate('Stats-Chart-AgeDistribution')}>
          <StatsDonutChart
            data={[
              { name: translate('Stats-Label-Under18'), value: menores },
              { name: translate('Stats-Label-Adults18to64'), value: adultos },
              { name: translate('Stats-Label-Over65'), value: mayores },
              { name: translate('Stats-Label-NotSpecified'), value: sinEdad },
            ].filter(d => d.value > 0)}
            colors={[STATS_COLORS.critical, STATS_COLORS.primary, STATS_COLORS.neutral, STATS_COLORS.gray1]}
          />
        </ChartCard>

        {/* Data Quality */}
        <ChartCard title={translate('Stats-Chart-DataQuality')}>
          <StatsDonutChart
            data={[
              { name: translate('Stats-Label-WithPhoto'), value: conImagen },
              { name: translate('Stats-Label-WithoutPhoto'), value: casosRegistrados - conImagen },
            ]}
            colors={[STATS_COLORS.primary, STATS_COLORS.gray1]}
          />
        </ChartCard>

        {/* Top 10 Ages - Full Width */}
        {top10Edades.length > 0 && (
          <ChartCard title={translate('Stats-Chart-Top10Ages')} fullWidth>
            <StatsBarChart data={top10Edades} color={STATS_COLORS.secondary} height={300} />
          </ChartCard>
        )}

        {/* Disappearance Locations - Full Width */}
        {desaparicionLocations.length > 0 && (
          <ChartCard title={translate('Stats-Chart-DisappearanceLocationsTop10')} fullWidth>
            <StatsBarChart data={desaparicionLocations} color={STATS_COLORS.critical} height={350} />
          </ChartCard>
        )}

        {/* Confinement Centers - Full Width */}
        {confinementCenters.length > 0 && (
          <ChartCard title={translate('Stats-Chart-ConfinementCentersTop10')} fullWidth>
            <StatsBarChart data={confinementCenters} color={STATS_COLORS.primary} height={350} />
          </ChartCard>
        )}

        {/* Professions - Full Width */}
        {profesionesTop.length > 0 && (
          <ChartCard title={translate('Stats-Chart-ProfessionsMostAffected')} fullWidth>
            <StatsBarChart data={profesionesTop} color={STATS_COLORS.neutral} height={350} />
          </ChartCard>
        )}
      </div>

      {/* Report Generation Section */}
      <ReportSection data={data} />
    </div>
  );
}

// Report Generation Section Component
function ReportSection({ data }: { data: DesaparecidoData[] }) {
  const { translate } = useLanguage();
  const [report, setReport] = useState<ReturnType<typeof generateStatisticalReport> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = useCallback(() => {
    setIsGenerating(true);
    // Small delay to show loading state
    setTimeout(() => {
      const generatedReport = generateStatisticalReport(data);
      setReport(generatedReport);
      setIsGenerating(false);
    }, 500);
  }, [data]);

  const handleGeneratePDF = useCallback(() => {
    setIsGenerating(true);
    // Small delay to show loading state
    setTimeout(() => {
      const generatedReport = generateStatisticalReport(data);
      setReport(generatedReport);
      // Generate PDF immediately
      generateProfessionalPDF(generatedReport, translate as any); // Pass translation function
      setIsGenerating(false);
    }, 500);
  }, [data]);

  return (
    <div className="mt-8 space-y-6">
      {/* Generate Professional PDF Report Button */}
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          {translate('Stats-Report-Title')}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {translate('Stats-Report-Description')}
        </p>
        <button
          onClick={handleGeneratePDF}
          disabled={isGenerating || data.length === 0}
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              {translate('Stats-Report-Generating')}
            </>
          ) : (
            <>
              <FileText className="h-5 w-5" />
              {translate('Stats-Report-GenerateButton')}
            </>
          )}
        </button>
        {data.length === 0 && (
          <p className="text-destructive text-xs mt-3">{translate('Stats-Report-NoData')}</p>
        )}
      </div>

      {/* Report Preview (only shows after generation) */}
      {report && (
        <div className="space-y-6 stats-fade-in">
          {/* Success Message */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <p className="text-green-200 font-semibold">{translate('Stats-Report-SuccessTitle')}</p>
            <p className="text-green-200/70 text-sm mt-1">{translate('Stats-Report-SuccessSubtitle')}</p>
          </div>

          {/* Quick Stats Summary */}
          {report.ageStats && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {translate('Stats-Report-AgeSummaryTitle')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-foreground">{report.ageStats.mean.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">{translate('Stats-Report-AgeMean')}</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-foreground">{report.ageStats.median.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">{translate('Stats-Report-AgeMedian')}</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-foreground">±{report.ageStats.stdDev.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">{translate('Stats-Report-AgeStdDev')}</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-foreground">{report.ageStats.cv.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">{translate('Stats-Report-AgeCV')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Conclusions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {translate('Stats-Report-ConclusionsTitle')}
            </h3>
            <div className="space-y-3">
              {report.conclusions.map((conclusion, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-sm leading-relaxed ${conclusion.includes('ALERTA') || conclusion.includes('PREOCUPANTE') || conclusion.includes('GRAVE') || conclusion.includes('CRÍMENES')
                    ? 'bg-red-500/10 border border-red-500/30 text-red-200'
                    : 'bg-background/50 text-foreground/80'
                    }`}
                >
                  <span className="font-semibold text-foreground">{index + 1}.</span> {conclusion}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatsEngine() {
  return (
    <LanguageProvider>
      <StatsEngineContent />
    </LanguageProvider>
  );
}