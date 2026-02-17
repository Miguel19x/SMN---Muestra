/**
 * Professional PDF Report Generator
 * Generates formal statistical reports in PDF format with APA-style formatting
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { StatisticalReport } from './statisticsCalculator';
import { drawHorizontalBarChart, drawLineChart, drawPartToWholeChart } from './pdfChartUtilities';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: typeof autoTable;
        lastAutoTable: {
            finalY: number;
        };
    }
}

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
    primary: [21, 101, 192] as [number, number, number], // Venezuelan blue
    secondary: [66, 66, 66] as [number, number, number], // Dark gray
    text: [0, 0, 0] as [number, number, number], // Black
    border: [189, 189, 189] as [number, number, number], // Gray
    tableHeader: [227, 242, 253] as [number, number, number], // Light blue
    tableAlt: [245, 245, 245] as [number, number, number], // Light gray
    alert: [198, 40, 40] as [number, number, number], // Red
};

const MARGINS = {
    top: 25.4,
    right: 25.4,
    bottom: 25.4,
    left: 25.4,
};

const FONTS = {
    title: 12, // APA Title is 12pt bold
    heading1: 12, // APA L1 is 12pt bold centered
    heading2: 12, // APA L2 is 12pt bold left
    body: 12, // APA Body is 12pt
    small: 11, // Tables can be slightly smaller but strictly 12pt is preferred.
    tiny: 10,
    apaTitle: 12,
};

const APA_TABLE_STYLE: any = {
    theme: 'plain',
    styles: {
        fontSize: 10,
        cellPadding: 3,
        font: 'times', // Strict APA
        textColor: COLORS.text,
        valign: 'middle',
    },
    headStyles: {
        fontStyle: 'bold',
        fillColor: [255, 255, 255],
        textColor: COLORS.text,
        lineWidth: { bottom: 0.5, top: 0.5 }, // Top and bottom of header
        lineColor: [0, 0, 0],
    },
    bodyStyles: {
        lineWidth: { bottom: 0 },
    },
    footStyles: {
        lineWidth: { top: 0.5 }, // Bottom of table
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0,
    columnStyles: {
        0: { cellWidth: 'auto' }
    },
};

// ============================================
// MAIN PDF GENERATOR
// ============================================

export function generateProfessionalPDF(report: StatisticalReport): void {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
    });

    let currentY = MARGINS.top;

    // 1. Cover Page
    currentY = addCoverPage(doc, report);

    // 2. New page for content
    doc.addPage();
    currentY = MARGINS.top;

    // 3. Executive Summary
    currentY = addExecutiveSummary(doc, report, currentY);

    // 4. Introduction
    currentY = addIntroduction(doc, report, currentY);

    // 4.1 Jurisdictional Note (Urgent Context 2026)
    currentY = addJurisdictionalNote(doc, currentY);

    // 5. Demographic Analysis
    currentY = addDemographicAnalysis(doc, report, currentY);

    // 6. Gender Analysis
    currentY = addGenderAnalysis(doc, report, currentY);

    // 6.5 Nationality Analysis (NEW)
    currentY = addNationalityAnalysis(doc, report, currentY);

    // 7. Occupational Analysis
    currentY = addOccupationalAnalysis(doc, report, currentY);

    // 8. Geographic Distribution (UPDATED: Segregated)
    currentY = addGeographicAnalysis(doc, report, currentY);

    // 9. Temporal Trend
    if (report.monthlyTrend.length > 0) {
        currentY = addTemporalAnalysis(doc, report, currentY);
    }

    // 10. Conclusions and Recommendations
    currentY = addConclusions(doc, report, currentY);

    // 11. Footer on all pages
    addPageNumbers(doc);

    // Download
    const filename = `Informe_Estadistico_${formatDateForFilename(report.generatedAt)}.pdf`;
    doc.save(filename);
}

// ============================================
// COVER PAGE
// ============================================

function addCoverPage(doc: jsPDF, report: StatisticalReport): number {
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = MARGINS.top + 20;

    // Running head is added via page numbers function usually, but title page has different header "Professional" vs "Student".
    // Assuming Professional APA:
    // Header: RUNNING HEAD: TITLE (Top Left), Page 1 (Top Right).

    // Title (Centered, Bold, Title Case, upper half)
    doc.setFont('times', 'bold');
    doc.setFontSize(FONTS.title);
    doc.setTextColor(0, 0, 0);

    const title = 'Informe Estadístico: Presos Políticos en Venezuela';
    const lines = doc.splitTextToSize(title, pageWidth - MARGINS.left - MARGINS.right);
    lines.forEach((line: string) => {
        const titleWidth = doc.getTextWidth(line);
        doc.text(line, (pageWidth - titleWidth) / 2, y);
        y += 10; // Double space
    });

    y += 10;

    // Authors
    doc.setFont('times', 'normal');
    doc.setFontSize(FONTS.body);
    const author = 'Análisis de Datos'; // Placeholder or specific author
    const authorWidth = doc.getTextWidth(author);
    doc.text(author, (pageWidth - authorWidth) / 2, y);
    y += 10;

    // Affiliation
    const affiliation = 'No Más Secuestros / Página de Derechos Humanos';
    const affWidth = doc.getTextWidth(affiliation);
    doc.text(affiliation, (pageWidth - affWidth) / 2, y);
    y += 10;

    // Date
    if (report.generatedAt) {
        const dateStr = formatDate(report.generatedAt);
        const dateWidth = doc.getTextWidth(dateStr);
        doc.text(dateStr, (pageWidth - dateWidth) / 2, y);
    }

    // Author Note Section (Bottom half)
    y = doc.internal.pageSize.getHeight() / 2 + 40;
    doc.setFont('times', 'bold');
    const noteLabel = 'Nota del Autor';
    const noteLabelWidth = doc.getTextWidth(noteLabel);
    doc.text(noteLabel, (pageWidth - noteLabelWidth) / 2, y);
    y += 10;

    doc.setFont('times', 'normal');
    const noteText = 'La información presentada en este informe proviene de fuentes abiertas y denuncias ciudadanas sistematizadas. No constituye un documento oficial gubernamental.';
    const noteLines = doc.splitTextToSize(noteText, pageWidth - MARGINS.left - MARGINS.right);

    // Justified paragraph for author note? First line indent.
    // APA paragraphs are indented 0.5in.
    const indent = 12.7; // mm

    const firstLine = noteLines[0];
    const restLines = noteLines.slice(1);

    doc.text(firstLine, MARGINS.left + indent, y, { align: 'left' });
    y += 10; // Double space
    restLines.forEach((line: string) => {
        doc.text(line, MARGINS.left, y);
        y += 10;
    });

    return y;
}

// ============================================
// EXECUTIVE SUMMARY
// ============================================

function addExecutiveSummary(doc: jsPDF, report: StatisticalReport, startY: number): number {
    let y = startY;

    // APA Abstract Label is centered, bold, "Resumen". No indentation for text.
    y = addSectionTitle(doc, 'Resumen', y);

    // Generate executive summary text
    const summary = generateExecutiveSummaryText(report).trim(); // Trim to ensure no leading spaces causing indent

    doc.setFontSize(FONTS.body);
    doc.setFont('times', 'normal');
    doc.setTextColor(...COLORS.text);

    // Abstract is a single paragraph, block format (no indent)
    const lines = doc.splitTextToSize(summary, doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right);

    for (const line of lines) {
        y = checkPageBreak(doc, y, 10);
        doc.text(line, MARGINS.left, y, { align: 'left' }); // Explicit left align
        y += 10; // Double Spacing
    }

    // Add Keywords (Indented 0.5in)
    const kwLabel = 'Palabras clave: ';
    const kwContent = 'presos políticos, derechos humanos, detención arbitraria, Venezuela, represión sistemática';
    const kwFull = kwLabel + kwContent;

    y = checkPageBreak(doc, y, 20);
    const kwWords = kwFull.split(' ');
    let kwLine = '';
    const kwIndent = 12.7;
    const kwMaxW = doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right - kwIndent;

    kwWords.forEach((word, idx) => {
        const test = kwLine ? kwLine + ' ' + word : word;
        doc.setFont('times', 'normal');
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

function renderKwLine(doc: jsPDF, text: string, x: number, y: number, label: string) {
    if (text.startsWith(label)) {
        doc.setFont('times', 'italic');
        doc.text(label, x, y);
        const lw = doc.getTextWidth(label);
        doc.setFont('times', 'normal');
        doc.text(text.substring(label.length), x + lw, y);
    } else {
        doc.setFont('times', 'normal');
        doc.text(text, x, y);
    }
}

function generateExecutiveSummaryText(report: StatisticalReport): string {
    const totalCases = report.totalCases.toLocaleString();
    const avgAge = report.ageStats?.mean.toFixed(1) || 'N/A';
    const malePercent = ((report.genderDistribution.masculino / report.totalCases) * 100).toFixed(1);
    const topProfession = report.topProfessions[0]?.value || 'N/A';
    const topLocation = report.topDisappearanceLocations[0]?.value || 'N/A';

    return sanitizeText(`El presente informe analiza ${totalCases} casos registrados de presos políticos en Venezuela. ` +
        `Los datos revelan que la edad promedio de las personas afectadas es de ${avgAge} años, ` +
        `con una distribución de género donde el ${malePercent}% son hombres. ` +
        `El análisis ocupacional muestra que ${topProfession} es la profesión / ocupación más afectada, ` +
        `mientras que ${topLocation} representa la ubicación geográfica con mayor concentración de casos. ` +
        `Este informe presenta un análisis estadístico detallado que evidencia patrones sistemáticos ` +
        `de persecución política y violaciones a los derechos humanos en el país.`);
}

// ============================================
// INTRODUCTION
// ============================================

function addIntroduction(doc: jsPDF, report: StatisticalReport, startY: number): number {
    let y = startY;

    // APA: No "Introducción" label. Instead, repeat the paper title, bold, centered.
    const title = 'Informe Estadístico: Presos Políticos en Venezuela';
    y = checkPageBreak(doc, y, 20);

    doc.setFontSize(FONTS.title);
    doc.setFont('times', 'bold');
    doc.setTextColor(...COLORS.text);

    const textWidth = doc.getTextWidth(title);
    doc.text(title, (doc.internal.pageSize.getWidth() - textWidth) / 2, y);
    y += 12;

    const intro = `El presente análisis estadístico se inscribe en el marco de la documentación sistemática de situaciones de detención arbitraria con fines políticos en la República Bolivariana de Venezuela. El objetivo primordial de este documento es proporcionar un sustrato cuantitativo que coadyuve a la identificación de patrones de persecución sistemática, en concordancia con los estándares internacionales de derechos humanos.\n\n` +
        `Metodología y Transparencia Técnica: La presente base de datos se construye mediante la técnica de monitoreo ciudadano y agregación de fuentes abiertas (Open Source Intelligence - OSINT). La información ha sido sistematizada a partir del cruce de reportes de organizaciones no gubernamentales reconocidas (como Foro Penal), denuncias públicas en plataformas digitales y reportes directos verificados de la comunidad. Este mecanismo busca vencer la opacidad institucional, sirviendo como un registro sombra o shadow report que alerta sobre tendencias y patrones de vulneración, aunque su naturaleza es de alerta temprana y no sustituye el expediente judicial individual.\n\n` +
        `Alcance y Sustento Jurídico: Este informe abarca un universo de ${report.totalCases.toLocaleString()} casos registrados` +
        (report.periodStart && report.periodEnd ? ` durante el período comprendido entre el ${formatDate(report.periodStart)} y el ${formatDate(report.periodEnd)}` : '') + `. Las conductas aquí descritas podrían subsumirse en los supuestos previstos en el Artículo 7 del Estatuto de Roma de la Corte Penal Internacional (Corte Penal Internacional [CPI], 1998), particularmente en lo relativo al encarcelamiento u otra privación grave de la libertad física en violación de normas fundamentales de derecho internacional.`;

    doc.setFontSize(FONTS.body);
    doc.setFont('times', 'normal');

    // Split spacing for paragraphs manually
    const paragraphs = intro.split('\n\n');
    paragraphs.forEach(p => {
        y = printAPAParagraph(doc, p, y);
    });

    return y;
}

function addJurisdictionalNote(doc: jsPDF, startY: number): number {
    let y = startY;

    // We use a highlighted box for this urgent note
    const pageWidth = doc.internal.pageSize.getWidth();
    const boxWidth = pageWidth - MARGINS.left - MARGINS.right;

    y = checkPageBreak(doc, y, 50);

    y = checkPageBreak(doc, y, 50);

    // Title for standard section consistency, although it's a note.
    doc.setFont('times', 'bold');
    doc.setFontSize(FONTS.small);
    doc.setTextColor(0, 0, 0); // Black

    doc.text('NOTA SOBRE ESTATUS JURISDICCIONAL (Actualización Enero 2026):', MARGINS.left, y);
    y += 10;

    doc.setFont('times', 'normal');

    // Use printAPAParagraph for strict indentation
    const noteText = `Se hace constar que la reciente sanción legislativa (Diciembre 2025) orientada a derogar el Estatuto de Roma por parte de la Asamblea Nacional no afecta la competencia material de la Corte Penal Internacional sobre los hechos aquí documentados (2018-2024). De conformidad con el Artículo 127.2 del Estatuto, la retirada no exime al Estado de las obligaciones surgidas durante su permanencia. Por el contrario, esta maniobra legislativa se interpreta en este informe como un elemento agravante que evidencia la falta de disposición (unwillingness) genuina del Estado para administrar justicia doméstica, reforzando la admisibilidad del caso ante la jurisdicción internacional.`;

    y = printAPAParagraph(doc, noteText, y);

    return y;
}

// ============================================
// DEMOGRAPHIC ANALYSIS
// ============================================

function addDemographicAnalysis(doc: jsPDF, report: StatisticalReport, startY: number): number {
    let y = startY;

    y = addSectionTitle(doc, 'Análisis Demográfico', y);
    y = addSubsectionTitle(doc, 'Estadísticas Descriptivas de la Variable Edad', y);

    if (report.ageStats) {
        y = checkPageBreak(doc, y, 60);

        // APA Table: Line 1 Bold "Table X", Line 2 Italic "Title", Double Spaced.
        doc.setFontSize(FONTS.small);
        doc.setFont('times', 'bold');
        doc.text('Tabla 1', MARGINS.left, y - 6);
        doc.setFont('times', 'italic');
        doc.text('Medidas de tendencia central y dispersión de la edad', MARGINS.left, y - 2);

        // Descriptive statistics table (APA Style)
        autoTable(doc, {
            ...APA_TABLE_STYLE,
            startY: y,
            head: [['Medida Estadística', 'Valor']],
            body: [
                ['Media aritmética', `${report.ageStats.mean.toFixed(2)} años`],
                ['Mediana', `${report.ageStats.median.toFixed(2)} años`],
                ['Moda', `${report.ageStats.mode ?? 'N/A'} años`],
                ['Desviación estándar', `±${report.ageStats.stdDev.toFixed(2)} años`],
                ['Varianza', `${report.ageStats.variance.toFixed(2)}`],
                ['Rango', `${report.ageStats.min} - ${report.ageStats.max} años`],
                ['Coeficiente de variación', `${report.ageStats.cv.toFixed(2)}%`],
            ],
            margin: { left: MARGINS.left, right: MARGINS.right },
        });

        y = doc.lastAutoTable.finalY + 10;
    }

    // Age groups distribution
    y = addSubsectionTitle(doc, 'Distribución por Intervalos de Edad', y);
    y = checkPageBreak(doc, y, 60);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 2', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text('Frecuencias por grupos de edad', MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['Grupo de Edad', 'Frecuencia Absoluta', 'Porcentaje']],
        body: report.ageGroups.map(group => [
            group.label,
            group.count.toString(),
            `${group.percentage.toFixed(1)}%`,
        ]),
        columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'right' },
        },
        margin: { left: MARGINS.left, right: MARGINS.right },
    });

    y = doc.lastAutoTable.finalY + 15;
    return y;
}

// ============================================
// GENDER ANALYSIS
// ============================================

function addGenderAnalysis(doc: jsPDF, report: StatisticalReport, startY: number): number {
    let y = startY;

    y = addSectionTitle(doc, 'Análisis por Género', y);
    y = checkPageBreak(doc, y, 50);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 3', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text('Distribución de casos según género', MARGINS.left, y - 2);

    const genderData = [
        ['Masculino', report.genderDistribution.masculino, ((report.genderDistribution.masculino / report.totalCases) * 100).toFixed(1)],
        ['Femenino', report.genderDistribution.femenino, ((report.genderDistribution.femenino / report.totalCases) * 100).toFixed(1)],
        ['No especificado', report.genderDistribution.noEspecificado, ((report.genderDistribution.noEspecificado / report.totalCases) * 100).toFixed(1)],
    ];

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['Género', 'Frecuencia Absoluta', 'Porcentaje']],
        body: genderData.map(row => [row[0], row[1].toString(), `${row[2]}%`]),
        columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'right' },
        },
        margin: { left: MARGINS.left, right: MARGINS.right },
    });

    y = doc.lastAutoTable.finalY + 15;

    // --- CHART: GENDER DISTRIBUTION (Donut/Part-to-Whole) ---
    // Figure X. Title
    y = checkPageBreak(doc, y, 70);
    doc.setFont('times', 'bold');
    doc.setFontSize(FONTS.small);
    doc.text('Figura 1', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text('Proporción de género en detenciones', MARGINS.left, y - 2);

    // Prepare Data
    const chartWidth = 160;
    const genderChartData = [
        { label: 'Hombres', value: report.genderDistribution.masculino, color: [30, 58, 95] as [number, number, number] }, // Blue
        { label: 'Mujeres', value: report.genderDistribution.femenino, color: [190, 18, 60] as [number, number, number] }, // Red
        { label: 'N/E', value: report.genderDistribution.noEspecificado, color: [150, 150, 150] as [number, number, number] } // Gray
    ].filter(d => d.value > 0);

    drawPartToWholeChart(doc, genderChartData, {
        x: MARGINS.left,
        y: y,
        width: chartWidth,
        height: 40 // Height includes legend space internally handled somewhat
    });

    // Add APA Note
    y += 35; // Space for chart + legend
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const genderNote = "Nota. El gráfico ilustra la desproporción de género, evidenciando una mayoría masculina en las detenciones.";
    y = printAPAParagraph(doc, genderNote, y);

    y += 15;
    return y;
}

// ============================================
// NATIONALITY ANALYSIS
// ============================================

function addNationalityAnalysis(doc: jsPDF, report: StatisticalReport, startY: number): number {
    let y = startY;

    y = addSectionTitle(doc, 'Distribución por Nacionalidad', y);
    y = checkPageBreak(doc, y, 80);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 4', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text('Distribución de frecuencias por nacionalidad', MARGINS.left, y - 2);

    const nat = report.nationalityDistribution;
    const tableData = [
        ['Venezolana', nat.venezolana.toString(), (nat.venezolana / nat.total).toFixed(4), `${((nat.venezolana / nat.total) * 100).toFixed(1)}%`],
        ['Extranjera', nat.extranjera.toString(), (nat.extranjera / nat.total).toFixed(4), `${((nat.extranjera / nat.total) * 100).toFixed(1)}%`],
        ['No especificada', nat.noEspecificada.toString(), (nat.noEspecificada / nat.total).toFixed(4), `${((nat.noEspecificada / nat.total) * 100).toFixed(1)}%`],
    ];

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['Nacionalidad', 'Frec. Absoluta', 'Frec. Relativa', 'Porcentaje']],
        body: tableData,
        headStyles: { ...APA_TABLE_STYLE.headStyles, fontSize: FONTS.tiny },
        styles: { ...APA_TABLE_STYLE.styles, fontSize: FONTS.tiny },
        columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right' },
        },
        margin: { left: MARGINS.left, right: MARGINS.right },
    });

    y = doc.lastAutoTable.finalY + 10;

    // Add foreign nationality breakdown if there are foreign nationals
    if (nat.extranjera > 0 && nat.topForeignNationalities.length > 0) {
        y = checkPageBreak(doc, y, 50);

        doc.setFontSize(FONTS.small);
        doc.setFont('times', 'bold');
        doc.text('Tabla 4.1', MARGINS.left, y - 6);
        doc.setFont('times', 'italic');
        doc.text('Desglose de nacionalidades extranjeras', MARGINS.left, y - 2);

        autoTable(doc, {
            ...APA_TABLE_STYLE,
            startY: y,
            head: [['#', 'Nacionalidad', 'Frecuencia', 'Porcentaje']],
            body: nat.topForeignNationalities.map((n, index) => [
                (index + 1).toString(),
                sanitizeText(n.value),
                n.fi.toString(),
                `${n.pi.toFixed(1)}%`,
            ]),
            headStyles: { ...APA_TABLE_STYLE.headStyles, fontSize: FONTS.tiny },
            styles: { ...APA_TABLE_STYLE.styles, fontSize: FONTS.tiny },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                2: { halign: 'right' },
                3: { halign: 'right' },
            },
            margin: { left: MARGINS.left, right: MARGINS.right },
        });

        y = doc.lastAutoTable.finalY + 8;

        // Legal context for foreign nationals
        if (nat.extranjera > 0) {
            y = checkPageBreak(doc, y, 25);
            doc.setFontSize(FONTS.body);
            doc.setFont('times', 'normal');
            doc.setTextColor(0, 0, 0);
            const contextText = `Nota. La presencia de ${nat.extranjera} extranjeros detenidos sin garantías consulares constituye una potencial violación al Art. 36 de la Convención de Viena sobre Relaciones Consulares (1963), ratificada por Venezuela.`;
            y = printAPAParagraph(doc, contextText, y);
        }
    }

    y += 10;
    return y;
}

// ============================================
// OCCUPATIONAL ANALYSIS
// ============================================

function addOccupationalAnalysis(doc: jsPDF, report: StatisticalReport, startY: number): number {
    let y = startY;

    y = addSectionTitle(doc, 'Análisis de Ocupación', y);
    y = addSubsectionTitle(doc, 'Principales Profesiones / Ocupaciones Afectadas', y);
    y = checkPageBreak(doc, y, 80);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 5', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text('Distribución de frecuencias por profesión / ocupación', MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['#', 'Profesión / Ocupación', 'Frec. Absoluta', 'Frec. Relativa', 'Porcentaje']],
        body: report.topProfessions.map((prof, index) => [
            (index + 1).toString(),
            sanitizeText(prof.value),
            prof.fi.toString(),
            prof.hi.toFixed(4),
            `${prof.pi.toFixed(1)}%`,
        ]),
        headStyles: { ...APA_TABLE_STYLE.headStyles, fontSize: FONTS.tiny },
        styles: { ...APA_TABLE_STYLE.styles, fontSize: FONTS.tiny },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
        },
        margin: { left: MARGINS.left, right: MARGINS.right },
    });

    y = doc.lastAutoTable.finalY + 15;

    // --- CHART: OCCUPATIONS (Horizontal Bar) ---
    if (report.topProfessions.length > 0) {
        y = checkPageBreak(doc, y, 100);
        doc.setFont('times', 'bold');
        doc.setFontSize(FONTS.small);
        doc.text('Figura 2', MARGINS.left, y - 6);
        doc.setFont('times', 'italic');
        doc.text('Focalización de la represión por sector ocupacional', MARGINS.left, y - 2);

        const barData = report.topProfessions.slice(0, 8).map(p => ({
            label: p.value,
            value: p.fi,
            percentage: p.pi,
            isHighlight: p.value.includes('Estudiante') // Highlight students
        }));

        const bottomY = drawHorizontalBarChart(doc, barData, {
            x: MARGINS.left,
            y: y,
            width: doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right,
            height: 80
        });

        y = bottomY + 5;
        // APA Note
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        const occNote = "Nota. Las barras rojas destacan los sectores considerados objetivos estratégicos de la represión (ej. Estudiantes).";
        y = printAPAParagraph(doc, occNote, y);

        y += 10;
    }

    return y;
}

// ============================================
// GEOGRAPHIC ANALYSIS
// ============================================

function addGeographicAnalysis(doc: jsPDF, report: StatisticalReport, startY: number): number {
    let y = startY;

    y = addSectionTitle(doc, 'Distribución Geográfica', y);

    // 1. Lugares de Desaparición (Initial Detention/Disappearance)
    y = addSubsectionTitle(doc, 'Lugares de Desaparición Inicial', y);
    y = checkPageBreak(doc, y, 80);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 6A', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text('Distribución por ubicación de desaparición/detención inicial', MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['#', 'Ubicación', 'Frec. Absoluta', 'Frec. Relativa', 'Porcentaje']],
        body: report.topDisappearanceLocations.map((loc, index) => [
            (index + 1).toString(),
            sanitizeText(loc.value),
            loc.fi.toString(),
            loc.hi.toFixed(4),
            `${loc.pi.toFixed(1)}%`,
        ]),
        headStyles: { ...APA_TABLE_STYLE.headStyles, fontSize: FONTS.tiny },
        styles: { ...APA_TABLE_STYLE.styles, fontSize: FONTS.tiny },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
        },
        margin: { left: MARGINS.left, right: MARGINS.right },
    });

    y = doc.lastAutoTable.finalY + 15;

    // 2. Centros de Confinamiento Actual
    y = checkPageBreak(doc, y, 80);
    y = addSubsectionTitle(doc, 'Centros de Confinamiento Actual', y);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 6B', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text('Distribución por centro de reclusión/confinamiento actual', MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['#', 'Centro de Confinamiento', 'Frec. Absoluta', 'Frec. Relativa', 'Porcentaje']],
        body: report.topConfinementLocations.map((loc, index) => [
            (index + 1).toString(),
            sanitizeText(loc.value),
            loc.fi.toString(),
            loc.hi.toFixed(4),
            `${loc.pi.toFixed(1)}%`,
        ]),
        headStyles: { ...APA_TABLE_STYLE.headStyles, fontSize: FONTS.tiny },
        styles: { ...APA_TABLE_STYLE.styles, fontSize: FONTS.tiny },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
        },
        margin: { left: MARGINS.left, right: MARGINS.right },
    });

    y = doc.lastAutoTable.finalY + 8;

    // Add forensic note about concentration if applicable
    if (report.topConfinementLocations.length > 0 && report.topConfinementLocations[0].pi > 20) {
        y = checkPageBreak(doc, y, 25);
        doc.setFontSize(FONTS.body);
        doc.setFont('times', 'normal');
        doc.setTextColor(0, 0, 0);

        const topCenter = report.topConfinementLocations[0];
        const contextText = `Nota. Se observa una concentración significativa del ${topCenter.pi.toFixed(1)}% de los casos en ${topCenter.value}, lo que evidencia un patrón de centralización de la represión política en instalaciones específicas de detención.`;
        y = printAPAParagraph(doc, contextText, y);
    }

    y += 10;
    return y;
}

// ============================================
// TEMPORAL ANALYSIS
// ============================================

function addTemporalAnalysis(doc: jsPDF, report: StatisticalReport, startY: number): number {
    let y = startY;

    y = addSectionTitle(doc, 'ANÁLISIS TEMPORAL', y);
    y = addSubsectionTitle(doc, 'Tendencia Mensual (Últimos 12 meses)', y);
    y = checkPageBreak(doc, y, 80);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 7', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text('Evolución cronológica de registros', MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['Mes', 'Casos Registrados']],
        body: report.monthlyTrend.map(m => [sanitizeText(m.month), m.count.toString()]),
        theme: 'grid',
        headStyles: { fillColor: COLORS.tableHeader, textColor: COLORS.text, fontStyle: 'bold' },
        styles: { fontSize: FONTS.small, cellPadding: 3 },
        columnStyles: {
            1: { halign: 'right' },
        },
        margin: { left: MARGINS.left, right: MARGINS.right },
    });

    y = doc.lastAutoTable.finalY + 15;

    // --- CHART: TEMPORAL TREND (Line Chart) ---
    if (report.monthlyTrend.length > 1) {
        y = checkPageBreak(doc, y, 90);
        doc.setFont('times', 'bold');
        doc.setFontSize(FONTS.small);
        doc.text('Figura 3', MARGINS.left, y - 6);
        doc.setFont('times', 'italic');
        doc.text('Cronología de la escalada represiva', MARGINS.left, y - 2);

        // Map trend data
        const lineData = report.monthlyTrend.map(m => ({
            label: m.month.split(' ')[0], // Just month name for axis
            value: m.count
        }));

        drawLineChart(doc, lineData, {
            x: MARGINS.left,
            y: y,
            width: doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right,
            height: 60
        });

        y += 75; // Height + labels space
        // APA Note
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        const trendNote = "Nota. La línea de tiempo evidencia los picos de detenciones coincidentes con eventos electorales y protestas.";
        y = printAPAParagraph(doc, trendNote, y);

        y += 10;
    }

    return y;
}

// ============================================
// CONCLUSIONS
// ============================================

function addConclusions(doc: jsPDF, report: StatisticalReport, startY: number): number {
    let y = startY;

    y = addSectionTitle(doc, 'Conclusiones y Dictamen Técnico', y);

    doc.setFontSize(FONTS.body);
    doc.setFont('times', 'normal');
    doc.setTextColor(...COLORS.text);

    // Use dynamic conclusions from the rigorous analysis engine
    report.conclusions.forEach((conclusion, index) => {
        y = checkPageBreak(doc, y, 15);
        y += 4;

        // Reset any potential state from autotable or previous modifications
        doc.setCharSpace(0);

        // Check for alerts to highlight
        const isAlert = conclusion.startsWith('ALERTA') || conclusion.startsWith('GRAVE') || conclusion.startsWith('CRÍMENES');

        if (isAlert) {
            doc.setTextColor(0, 0, 0); // Strict APA black
            doc.setFont('times', 'bold');
        } else {
            doc.setTextColor(0, 0, 0);
            doc.setFont('times', 'normal');
        }

        // Clean text to avoid PDF rendering artifacts
        const cleanText = sanitizeText(conclusion);
        y = printAPAParagraph(doc, cleanText, y);
    });

    // Reset styles
    doc.setTextColor(...COLORS.text);
    doc.setFont('times', 'normal');
    doc.setCharSpace(0);

    // Disclaimer
    y = checkPageBreak(doc, y, 30);
    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'italic');

    const disclaimer = 'Descargo de Responsabilidad: Los casos y datos aquí reflejados corresponden a denuncias ciudadanas recibidas y monitoreadas por el sistema NO MÁS SECUESTROS. Su inclusión obedece a criterios de verosimilitud y sistematización de fuentes abiertas, sin que ello constituya per se una sentencia judicial condenatoria o un expediente forense oficial e independiente de cotejo estatal.';

    y = printAPAParagraph(doc, disclaimer, y);

    y += 10;

    // Add References Section
    y = addReferencesSection(doc, y);

    return y;
}

/**
 * APA Style References Section
 */
function addReferencesSection(doc: jsPDF, startY: number): number {
    let y = startY;
    y = addSectionTitle(doc, 'Referencias', y);

    const references = [
        'Corte Penal Internacional. (1998). Estatuto de Roma de la Corte Penal Internacional. https://www.un.org/spanish/law/icc/statute/spanish/rome_statute(s).pdf',
        'Foro Penal. (2026). Reporte de Represión en Venezuela: Listado de Presos Políticos. https://foropenal.com/',
        'Naciones Unidas. (1948). Declaración Universal de Derechos Humanos. https://www.un.org/es/about-us/universal-declaration-of-human-rights',
        'Organización de los Estados Americanos. (1969). Convención Americana sobre Derechos Humanos (Pacto de San José). https://www.oas.org/dil/esp/1969_Convenci%C3%B3n_Americana_sobre_Derechos_Humanos.pdf'
    ];

    doc.setFontSize(FONTS.body);
    doc.setFont('times', 'normal');

    references.forEach(ref => {
        y = checkPageBreak(doc, y, 15);

        // Parse reference to italicize title (Assuming format: Author. (Year). Title. Url)
        // Hybrid approach: Simple split by period, rough heuristic
        const parts = ref.split('. ');

        doc.setFont('times', 'normal');

        // Author and Year
        if (parts.length > 2) {
            const authorYear = parts[0] + '. ' + parts[1] + '. ';
            const title = parts[2] + '. ';
            const rest = parts.slice(3).join('. ');

            const maxWidth = doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right;
            let currentX = MARGINS.left;

            // Helper to render mixed style text with wrapping
            const tokens = [
                { text: authorYear, font: 'normal' },
                { text: title, font: 'italic' },
                { text: rest, font: 'normal' }
            ];

            tokens.forEach(token => {
                doc.setFont('times', token.font);
                const words = token.text.split(' ');

                words.forEach((word, i) => {
                    const wordWithSpace = i < words.length - 1 ? word + ' ' : word;
                    const wordWidth = doc.getTextWidth(wordWithSpace);

                    if (currentX + wordWidth > MARGINS.left + maxWidth) {
                        // Move to next line with Hanging Indent
                        y += 10; // Double Spacing
                        currentX = MARGINS.left + 12.7; // Hanging Indent (1.27cm)

                        // Check for page break on new line
                        const pageHeight = doc.internal.pageSize.getHeight();
                        if (y > pageHeight - MARGINS.bottom) {
                            doc.addPage();
                            y = MARGINS.top;
                        }

                        // Explicitly set font again for new line to ensure style persists
                        doc.setFont('times', token.font);
                    }

                    doc.text(wordWithSpace, currentX, y, { align: 'left' });
                    currentX += wordWidth;
                });
            });

            y += 10; // Double Spacing
        } else {
            // Fallback for simple strings (Hanging Indent logic)
            const maxWidth = doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right;
            const words = ref.split(' ');
            let line = '';
            let isFirstLine = true;

            words.forEach(word => {
                const testLine = line + (line ? ' ' : '') + word;
                const testWidth = doc.getTextWidth(testLine);
                const availableWidth = isFirstLine ? maxWidth : maxWidth - 12.7;

                if (testWidth > availableWidth) {
                    y = checkPageBreak(doc, y, 10);
                    const refX = isFirstLine ? MARGINS.left : MARGINS.left + 12.7;
                    doc.text(line, refX, y, { align: 'left' });
                    y += 10;

                    line = word;
                    isFirstLine = false;
                } else {
                    line = testLine;
                }
            });

            if (line) {
                y = checkPageBreak(doc, y, 10);
                const refX = isFirstLine ? MARGINS.left : MARGINS.left + 12.7;
                doc.text(line, refX, y, { align: 'left' });
                y += 10;
            }
        }

        y += 10; // Double Spacing between references (Strict APA: No extra space, just continuing double space)
    });

    return y;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * APA Level 1 Heading: Centered, Bold, Title Case
 */
function addSectionTitle(doc: jsPDF, title: string, y: number): number {
    y = checkPageBreak(doc, y, 25);

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(FONTS.heading1);
    doc.setFont('times', 'bold');
    doc.setTextColor(...COLORS.text);

    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, y);

    y += 12; // APA double space after heading usually, or normal.
    return y;
}

/**
 * APA Level 2 Heading: Flush Left, Bold, Title Case
 */
function addSubsectionTitle(doc: jsPDF, title: string, y: number): number {
    const nextY = checkPageBreak(doc, y, 15);

    doc.setFontSize(FONTS.heading2);
    doc.setFont('times', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(title, MARGINS.left, nextY);

    return nextY + 10;
}

function checkPageBreak(doc: jsPDF, currentY: number, requiredSpace: number): number {
    const pageHeight = doc.internal.pageSize.getHeight();

    if (currentY + requiredSpace > pageHeight - MARGINS.bottom) {
        doc.addPage();
        return MARGINS.top;
    }

    return currentY;
}

function addPageNumbers(doc: jsPDF): void {
    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const runningHead = 'INFORME ESTADÍSTICO';

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(FONTS.small);
        doc.setFont('times', 'normal');
        doc.setTextColor(...COLORS.text);

        // Page Number (Top Right)
        const pageNum = `${i}`;
        const pageNumWidth = doc.getTextWidth(pageNum);
        doc.text(pageNum, pageWidth - MARGINS.right - pageNumWidth, MARGINS.top - 12);

        // Running Head (Top Left, All Caps)
        // APA 7 Professional: "INFORME ESTADÍSTICO"
        doc.text(runningHead, MARGINS.left, MARGINS.top - 12);
    }
}

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatDateForFilename(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

/**
 * Removes emojis and characters that typical PDF fonts can't render correctly
 * without embedding custom fonts.
 */
function sanitizeText(text: string): string {
    if (!text) return '';

    // Whitelist approach: Keep only alphanumeric, Spanish characters, and basic punctuation
    // This effectively removes emojis, icons, and non-standard symbols like 'þ'
    return text
        .replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s\.,:;()!?"'\/\-\+\=%]/g, '') // Added % to whitelist
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();
}

/**
 * Prints a paragraph with first-line indentation (1.27cm) and strict left alignment.
 */
function printAPAParagraph(doc: jsPDF, text: string, y: number): number {
    const indent = 12.7; // 1.27 cm ~ 0.5 inch
    const maxWidth = doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right;

    // Split into words
    const words = text.split(' ');
    let currentLine = '';
    let isFirstLine = true;
    let currentX = MARGINS.left + indent; // Start indented

    words.forEach((word) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = doc.getTextWidth(testLine);
        const availableWidth = isFirstLine ? maxWidth - indent : maxWidth;

        if (testWidth > availableWidth) {
            // Print current line
            y = checkPageBreak(doc, y, 10);
            const xPos = isFirstLine ? MARGINS.left + indent : MARGINS.left;
            doc.text(currentLine, xPos, y);
            y += 10; // Double space

            // Start new line with current word
            currentLine = word;
            isFirstLine = false;
        } else {
            currentLine = testLine;
        }
    });

    // Print last line
    if (currentLine) {
        y = checkPageBreak(doc, y, 10);
        const xPos = isFirstLine ? MARGINS.left + indent : MARGINS.left;
        doc.text(currentLine, xPos, y);
        y += 10;
    }

    return y;
}
