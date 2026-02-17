/**
 * Report Generator Module
 * Generates formatted reports from statistical data
 */

import type { StatisticalReport, FrequencyItem } from './statisticsCalculator';

// ============================================
// TEXT REPORT GENERATOR
// ============================================

/**
 * Generate a formatted text report
 */
export function generateTextReport(report: StatisticalReport): string {
    const lines: string[] = [];
    const divider = '═'.repeat(70);
    const subDivider = '─'.repeat(50);

    // Header
    lines.push(divider);
    lines.push('           INFORME ESTADÍSTICO - NO MÁS SECUESTROS');
    lines.push(`                    Generado: ${formatDate(report.generatedAt)}`);
    lines.push(divider);
    lines.push('');

    // 1. General Summary
    lines.push('1. RESUMEN GENERAL');
    lines.push('   ' + subDivider);
    lines.push(`   • Total de casos registrados: ${report.totalCases.toLocaleString()}`);
    lines.push(`   • Casos con datos completos: ${report.casesWithCompleteData.toLocaleString()} (${((report.casesWithCompleteData / report.totalCases) * 100).toFixed(1)}%)`);
    lines.push(`   • Casos con fotografía: ${report.casesWithPhoto.toLocaleString()} (${((report.casesWithPhoto / report.totalCases) * 100).toFixed(1)}%)`);
    if (report.periodStart && report.periodEnd) {
        lines.push(`   • Período analizado: ${report.periodStart} al ${report.periodEnd}`);
    }
    lines.push('');

    // 2. Age Analysis
    lines.push('2. ANÁLISIS DEMOGRÁFICO - EDAD');
    lines.push('   ' + subDivider);

    if (report.ageStats) {
        lines.push(`   • Media aritmética: ${report.ageStats.mean.toFixed(1)} años`);
        lines.push(`   • Mediana: ${report.ageStats.median.toFixed(1)} años`);
        lines.push(`   • Moda: ${report.ageStats.mode ?? 'N/A'} años`);
        lines.push(`   • Desviación estándar: ±${report.ageStats.stdDev.toFixed(2)} años`);
        lines.push(`   • Rango: ${report.ageStats.min} - ${report.ageStats.max} años`);
        lines.push(`   • Coeficiente de variación: ${report.ageStats.cv.toFixed(2)}%`);
    } else {
        lines.push('   • Datos de edad insuficientes para análisis');
    }

    lines.push('');
    lines.push('   Distribución por grupos de edad:');
    lines.push('   ┌──────────────────────────┬──────────┬──────────┐');
    lines.push('   │ Grupo                    │ Casos    │ %        │');
    lines.push('   ├──────────────────────────┼──────────┼──────────┤');

    for (const group of report.ageGroups) {
        const label = group.label.padEnd(24);
        const count = group.count.toString().padStart(8);
        const pct = group.percentage.toFixed(1).padStart(7) + '%';
        lines.push(`   │ ${label} │ ${count} │ ${pct} │`);
    }

    lines.push('   └──────────────────────────┴──────────┴──────────┘');
    lines.push('');

    // 3. Gender Analysis
    lines.push('3. ANÁLISIS POR GÉNERO');
    lines.push('   ' + subDivider);
    lines.push('   ┌──────────────────────────┬──────────┬──────────┐');
    lines.push('   │ Género                   │ Casos    │ %        │');
    lines.push('   ├──────────────────────────┼──────────┼──────────┤');

    const genders = [
        { label: 'Masculino', count: report.genderDistribution.masculino },
        { label: 'Femenino', count: report.genderDistribution.femenino },
        { label: 'No especificado', count: report.genderDistribution.noEspecificado },
    ];

    for (const g of genders) {
        const label = g.label.padEnd(24);
        const count = g.count.toString().padStart(8);
        const pct = ((g.count / report.genderDistribution.total) * 100).toFixed(1).padStart(7) + '%';
        lines.push(`   │ ${label} │ ${count} │ ${pct} │`);
    }

    lines.push('   └──────────────────────────┴──────────┴──────────┘');
    lines.push('');

    // 4. Top Professions
    lines.push('4. TOP 10 PROFESIONES / OCUPACIONES MÁS AFECTADAS');
    lines.push('   ' + subDivider);
    lines.push('   ┌────┬──────────────────────────────┬──────────┬──────────┐');
    lines.push('   │ #  │ Profesión / Ocupación        │ Casos    │ %        │');
    lines.push('   ├────┼──────────────────────────────┼──────────┼──────────┤');

    report.topProfessions.forEach((prof, index) => {
        const num = (index + 1).toString().padStart(2);
        const label = prof.value.substring(0, 28).padEnd(28);
        const count = prof.fi.toString().padStart(8);
        const pct = prof.pi.toFixed(1).padStart(7) + '%';
        lines.push(`   │ ${num} │ ${label} │ ${count} │ ${pct} │`);
    });

    lines.push('   └────┴──────────────────────────────┴──────────┴──────────┘');
    lines.push('');

    // 5. Top Locations
    lines.push('5. DISTRIBUCIÓN GEOGRÁFICA (Top 10)');
    lines.push('   ' + subDivider);
    lines.push('   ┌────┬──────────────────────────────┬──────────┬──────────┐');
    lines.push('   │ #  │ Ubicación                    │ Casos    │ %        │');
    lines.push('   ├────┼──────────────────────────────┼──────────┼──────────┤');

    report.topDisappearanceLocations.forEach((loc: FrequencyItem, index: number) => {
        const num = (index + 1).toString().padStart(2);
        const label = loc.value.substring(0, 28).padEnd(28);
        const count = loc.fi.toString().padStart(8);
        const pct = loc.pi.toFixed(1).padStart(7) + '%';
        lines.push(`   │ ${num} │ ${label} │ ${count} │ ${pct} │`);
    });

    lines.push('   └────┴──────────────────────────────┴──────────┴──────────┘');
    lines.push('');

    // 6. Monthly Trend
    if (report.monthlyTrend.length > 0) {
        lines.push('6. TENDENCIA TEMPORAL (Últimos 12 meses)');
        lines.push('   ' + subDivider);
        lines.push('   ┌──────────────┬──────────┐');
        lines.push('   │ Mes          │ Casos    │');
        lines.push('   ├──────────────┼──────────┤');

        for (const m of report.monthlyTrend) {
            const month = m.month.padEnd(12);
            const count = m.count.toString().padStart(8);
            lines.push(`   │ ${month} │ ${count} │`);
        }

        lines.push('   └──────────────┴──────────┘');
        lines.push('');
    }

    // 7. Conclusions
    lines.push('7. CONCLUSIONES Y OBSERVACIONES');
    lines.push('   ' + subDivider);

    report.conclusions.forEach((conclusion, index) => {
        lines.push(`   ${index + 1}. ${conclusion}`);
        lines.push('');
    });

    // Footer
    lines.push(divider);
    lines.push('   Este informe fue generado automáticamente por el sistema');
    lines.push('   NoMásSecuestros. Los datos presentados son de carácter');
    lines.push('   informativo y deben ser verificados con fuentes oficiales.');
    lines.push(divider);

    return lines.join('\n');
}

// ============================================
// CSV REPORT GENERATOR
// ============================================

/**
 * Generate CSV data for export
 */
export function generateCSVReport(report: StatisticalReport): string {
    const lines: string[] = [];

    // Summary section
    lines.push('RESUMEN GENERAL');
    lines.push('Métrica,Valor,Porcentaje');
    lines.push(`Total de casos,${report.totalCases},100%`);
    lines.push(`Casos con fotografía,${report.casesWithPhoto},${((report.casesWithPhoto / report.totalCases) * 100).toFixed(1)}%`);
    lines.push(`Casos con datos completos,${report.casesWithCompleteData},${((report.casesWithCompleteData / report.totalCases) * 100).toFixed(1)}%`);
    lines.push('');

    // Age statistics
    if (report.ageStats) {
        lines.push('ESTADÍSTICAS DE EDAD');
        lines.push('Medida,Valor');
        lines.push(`Media,${report.ageStats.mean.toFixed(2)}`);
        lines.push(`Mediana,${report.ageStats.median.toFixed(2)}`);
        lines.push(`Moda,${report.ageStats.mode ?? 'N/A'}`);
        lines.push(`Desviación Estándar,${report.ageStats.stdDev.toFixed(2)}`);
        lines.push(`Varianza,${report.ageStats.variance.toFixed(2)}`);
        lines.push(`Rango,${report.ageStats.range}`);
        lines.push(`CV,${report.ageStats.cv.toFixed(2)}%`);
        lines.push('');
    }

    // Age groups
    lines.push('DISTRIBUCIÓN POR EDAD');
    lines.push('Grupo,Casos,Porcentaje');
    for (const group of report.ageGroups) {
        lines.push(`${group.label},${group.count},${group.percentage.toFixed(1)}%`);
    }
    lines.push('');

    // Gender
    lines.push('DISTRIBUCIÓN POR GÉNERO');
    lines.push('Género,Casos,Porcentaje');
    lines.push(`Masculino,${report.genderDistribution.masculino},${((report.genderDistribution.masculino / report.totalCases) * 100).toFixed(1)}%`);
    lines.push(`Femenino,${report.genderDistribution.femenino},${((report.genderDistribution.femenino / report.totalCases) * 100).toFixed(1)}%`);
    lines.push(`No especificado,${report.genderDistribution.noEspecificado},${((report.genderDistribution.noEspecificado / report.totalCases) * 100).toFixed(1)}%`);
    lines.push('');

    // Professions
    lines.push('TOP PROFESIONES / OCUPACIONES');
    lines.push('Profesión / Ocupación,Frecuencia Absoluta,Frecuencia Relativa,Porcentaje,Frecuencia Acumulada');
    for (const prof of report.topProfessions) {
        lines.push(`"${prof.value}",${prof.fi},${prof.hi.toFixed(4)},${prof.pi.toFixed(2)}%,${prof.Fi}`);
    }
    lines.push('');

    // Locations
    lines.push('TOP UBICACIONES DE DESAPARICIÓN');
    lines.push('Ubicación,Frecuencia Absoluta,Frecuencia Relativa,Porcentaje,Frecuencia Acumulada');
    for (const loc of report.topDisappearanceLocations) {
        lines.push(`"${loc.value}",${loc.fi},${loc.hi.toFixed(4)},${loc.pi.toFixed(2)}%,${loc.Fi}`);
    }
    lines.push('');

    lines.push('TOP CENTROS DE CONFINAMIENTO');
    lines.push('Centro de Confinamiento,Frecuencia Absoluta,Frecuencia Relativa,Porcentaje,Frecuencia Acumulada');
    for (const loc of report.topConfinementLocations) {
        lines.push(`"${loc.value}",${loc.fi},${loc.hi.toFixed(4)},${loc.pi.toFixed(2)}%,${loc.Fi}`);
    }
    lines.push('');

    // Monthly trend
    lines.push('TENDENCIA MENSUAL');
    lines.push('Mes,Casos');
    for (const m of report.monthlyTrend) {
        lines.push(`${m.month},${m.count}`);
    }

    return lines.join('\n');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Download report as file
 */
export function downloadReport(content: string, filename: string, type: 'text' | 'csv'): void {
    const mimeType = type === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const blob = new Blob(['\ufeff' + content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
