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
        halign: 'left', // Default left alignment
    },
    headStyles: {
        fontStyle: 'bold',
        fillColor: [255, 255, 255],
        textColor: COLORS.text,
        lineWidth: { bottom: 0.5, top: 0.5 },
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

// Type for the translation function
type Translator = (key: string, params?: any) => string;

export function generateProfessionalPDF(report: StatisticalReport, t: Translator): void {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
    });

    let currentY = MARGINS.top;

    // 1. Cover Page
    addCoverPage(doc, report, t);
    doc.addPage();
    currentY = MARGINS.top;

    // 2. Executive Summary
    currentY = addExecutiveSummary(doc, report, currentY, t);

    // 3. Introduction
    currentY = checkPageBreak(doc, currentY, 50);
    currentY = addIntroduction(doc, report, currentY, t);

    // 4. Jurisdictional Note
    currentY = addJurisdictionalNote(doc, currentY, t);

    // 5. Demographics Analysis
    if (report.ageStats || report.genderDistribution) {
        currentY = checkPageBreak(doc, currentY, 50);
        currentY = addDemographicsAnalysis(doc, report, currentY, t);

        currentY = checkPageBreak(doc, currentY, 50);
        currentY = addGenderAnalysis(doc, report, currentY, t);
    }

    // 6. Nationality Analysis
    currentY = checkPageBreak(doc, currentY, 50);
    currentY = addNationalityAnalysis(doc, report, currentY, t);

    // 7. Occupational Analysis
    currentY = checkPageBreak(doc, currentY, 50);
    currentY = addOccupationalAnalysis(doc, report, currentY, t);

    // 8. Geographic Analysis
    if (report.topDisappearanceLocations.length > 0) {
        currentY = checkPageBreak(doc, currentY, 50);
        currentY = addGeographicDistribution(doc, report, currentY, t);
    }

    // 9. Temporal Analysis
    if (report.monthlyTrend.length > 0) {
        currentY = checkPageBreak(doc, currentY, 50);
        currentY = addTemporalAnalysis(doc, report, currentY, t);
    }

    // 10. Conclusions
    currentY = checkPageBreak(doc, currentY, 50);
    currentY = addConclusions(doc, report, currentY, t);

    // 11. Disclaimer & References
    addDisclaimer(doc, t);

    // 12. Footer on all pages (except cover which has its own)
    const pageCount = doc.getNumberOfPages();
    for (let i = 2; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(FONTS.small);
        doc.setFont('times', 'normal');
        doc.setTextColor(...COLORS.text);

        // Running Head
        doc.text('INFORME ESTADÍSTICO', MARGINS.left, MARGINS.top - 10);

        // Footer: Page X of Y
        doc.text(`${i} / ${pageCount}`, 195, 270, { align: 'right' });
    }

    doc.save(`Reporte_DataTracker_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ============================================
// COVER PAGE
// ============================================

function addCoverPage(doc: jsPDF, _report: StatisticalReport, t: Translator): number {
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background Band
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, 15, pageHeight, 'F');

    // Title
    let y = 80;
    doc.setFontSize(24);
    doc.setFont('times', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(t('Report-Header-Main'), 30, y);

    y += 15;
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.secondary);
    doc.text(t('Report-Header-Sub'), 30, y);

    // Date
    y += 100;
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.text);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`${t('Report-Header-GenDate')} ${dateStr}`, 30, y);

    // Disclaimer Box
    y += 20;
    doc.setDrawColor(...COLORS.border);
    doc.line(30, y, 180, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont('times', 'italic');
    const disclaimerParts = doc.splitTextToSize(t('Report-Disclaimer-Text'), 150);
    doc.text(disclaimerParts, 30, y);

    return pageHeight; // Force new page
}

// ============================================
// EXECUTIVE SUMMARY
// ============================================

function addExecutiveSummary(doc: jsPDF, report: StatisticalReport, startY: number, t: Translator): number {
    let y = startY;

    // APA Abstract Label
    y = addSectionTitle(doc, t('Report-Section-Summary'), y);

    // Generate executive summary text
    const summary = generateExecutiveSummaryText(report, t).trim();

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
    const kwLabel = t('Report-Keywords-Label') + ' ';
    const kwContent = t('Report-Keywords-Content');
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

function generateExecutiveSummaryText(report: StatisticalReport, t: Translator): string {
    const totalCases = report.totalCases.toLocaleString();
    const avgAge = report.ageStats?.mean.toFixed(1) || 'N/A';
    const malePercent = ((report.genderDistribution.masculino / report.totalCases) * 100).toFixed(1);
    const topProfession = report.topProfessions[0]?.value || 'N/A';
    const topLocation = report.topDisappearanceLocations[0]?.value || 'N/A';

    // Using the parameterized key 'Report-Summary-Text'
    return sanitizeText(t('Report-Summary-Text', {
        total: totalCases,
        period: (report.periodStart && report.periodEnd) ? ` (${formatDate(report.periodStart)} - ${formatDate(report.periodEnd)})` : '',
        avgAge: avgAge,
        topGender: report.genderDistribution.masculino > report.genderDistribution.femenino ? t('Stats-Label-Men') : t('Stats-Label-Women'), // Simple heuristic
        genderPct: malePercent,
        topProf: topProfession,
        profPct: report.topProfessions[0]?.pi.toFixed(1) || '0',
        topLoc: topLocation
    }));
}

// ============================================
// INTRODUCTION
// ============================================

function addIntroduction(doc: jsPDF, report: StatisticalReport, startY: number, t: Translator): number {
    let y = startY;

    // APA: No "Introducción" label. Instead, repeat the paper title, bold, centered.
    const title = t('Report-Intro-Title');
    y = checkPageBreak(doc, y, 20);

    doc.setFontSize(FONTS.title);
    doc.setFont('times', 'bold');
    doc.setTextColor(...COLORS.text);

    const textWidth = doc.getTextWidth(title);
    doc.text(title, (doc.internal.pageSize.getWidth() - textWidth) / 2, y);
    y += 12;

    const intro = t('Report-Intro-Text', {
        cases: report.totalCases.toLocaleString(),
        period: report.periodStart && report.periodEnd ? ` (${formatDate(report.periodStart!)} - ${formatDate(report.periodEnd!)})` : ''
    });

    doc.setFontSize(FONTS.body);
    doc.setFont('times', 'normal');

    // Split spacing for paragraphs manually
    const paragraphs = intro.split('\n\n');
    paragraphs.forEach(p => {
        y = printAPAParagraph(doc, p, y);
    });

    return y;
}

function addJurisdictionalNote(doc: jsPDF, startY: number, t: Translator): number {
    let y = startY;

    // We use a highlighted box for this urgent note
    y = checkPageBreak(doc, y, 50);

    y = checkPageBreak(doc, y, 50);

    // Title for standard section consistency, although it's a note.
    doc.setFont('times', 'bold');
    doc.setFontSize(FONTS.small);
    doc.setTextColor(0, 0, 0); // Black

    doc.text(t('Report-Jurisdiction-Title'), MARGINS.left, y);
    y += 10;

    doc.setFont('times', 'normal');

    // Use printAPAParagraph for strict indentation
    const noteText = t('Report-Jurisdiction-Text');

    y = printAPAParagraph(doc, noteText, y);

    return y;
}

// ============================================
// DEMOGRAPHIC ANALYSIS
// ============================================

function addDemographicsAnalysis(doc: jsPDF, report: StatisticalReport, startY: number, t: Translator): number {
    let y = startY;

    y = addSectionTitle(doc, t('Report-Section-Demographics'), y);

    // Prevent orphan by checking space for Subsection + Table 1
    y = checkPageBreak(doc, y, 75); // 15 title + 60 table
    y = addSubsectionTitle(doc, t('Report-Sub-Age'), y);

    if (report.ageStats) {
        // Table 1

        // APA Table: Line 1 Bold "Table X", Line 2 Italic "Title", Double Spaced.
        doc.setFontSize(FONTS.small);
        doc.setFont('times', 'bold');
        doc.text('Tabla 1', MARGINS.left, y - 6);
        doc.setFont('times', 'italic');
        doc.text(t('Report-Table-Age-Title'), MARGINS.left, y - 2);

        // Descriptive statistics table (APA Style)
        autoTable(doc, {
            ...APA_TABLE_STYLE,
            startY: y,
            head: [[t('Report-Table-Metric'), t('Report-Table-Value')]],
            body: [
                [t('Report-Metric-Mean'), `${report.ageStats.mean.toFixed(2)} ${t('Stats-Info-Yo') || 'años'}`],
                [t('Report-Metric-Median'), `${report.ageStats.median.toFixed(2)} ${t('Stats-Info-Yo') || 'años'}`],
                ['Moda', `${report.ageStats.mode ?? 'N/A'} ${t('Stats-Info-Yo') || 'años'}`],
                [t('Report-Metric-StdDev'), `±${report.ageStats.stdDev.toFixed(2)}`],
                ['Varianza', `${report.ageStats.variance.toFixed(2)}`],
                [t('Report-Metric-Range'), `${report.ageStats.min} - ${report.ageStats.max}`],
                [t('Stats-Report-AgeCV'), `${report.ageStats.cv.toFixed(2)}%`],
            ],
            margin: { left: MARGINS.left, right: MARGINS.right },
        });

        y = doc.lastAutoTable.finalY + 10;
    }

    // Age groups distribution
    y = addSubsectionTitle(doc, t('Report-Sub-Age') + ' (Detalle)', y);
    y = checkPageBreak(doc, y, 60);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 2', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text(t('Report-Table-Age-Title') + ' - Grupos', MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [[t('Report-Table-Metric'), t('Report-Col-FreqAbs'), t('Report-Col-Percent')]],
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

function addGenderAnalysis(doc: jsPDF, report: StatisticalReport, startY: number, t: Translator): number {
    let y = startY;

    // Prevent orphan title
    y = checkPageBreak(doc, y, 70);
    y = addSubsectionTitle(doc, t('Report-Sub-Gender'), y);
    const genderData = [
        [t('Stats-Label-Men'), report.genderDistribution.masculino, ((report.genderDistribution.masculino / report.totalCases) * 100).toFixed(1)],
        [t('Stats-Label-Women'), report.genderDistribution.femenino, ((report.genderDistribution.femenino / report.totalCases) * 100).toFixed(1)],
        [t('Stats-Label-NotSpecified'), report.genderDistribution.noEspecificado, ((report.genderDistribution.noEspecificado / report.totalCases) * 100).toFixed(1)],
    ];

    y = checkPageBreak(doc, y, 60);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 3', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text(t('Report-Table-Gender-Title'), MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [[t('Report-Col-Gender'), t('Report-Col-FreqAbs'), t('Report-Col-Percent')]],
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
    doc.text(t('Report-Fig1-Title'), MARGINS.left, y - 1);

    y += 4;

    // Prepare Data
    const chartWidth = 160;
    const genderChartData = [
        { label: t('Stats-Label-Men'), value: report.genderDistribution.masculino, color: [30, 58, 95] as [number, number, number] }, // Blue
        { label: t('Stats-Label-Women'), value: report.genderDistribution.femenino, color: [190, 18, 60] as [number, number, number] }, // Red
        { label: t('Stats-Label-NotSpecified'), value: report.genderDistribution.noEspecificado, color: [150, 150, 150] as [number, number, number] } // Gray
    ].filter(d => d.value > 0);

    drawPartToWholeChart(doc, genderChartData, {
        x: MARGINS.left,
        y: y,
        width: chartWidth,
        height: 40
    });

    // Add APA Note
    y += 35;
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const genderNote = t('Report-Fig1-Note');
    y = printAPAParagraph(doc, genderNote, y);

    y += 15;
    return y;
}

// ============================================
// NATIONALITY ANALYSIS
// ============================================

function addNationalityAnalysis(doc: jsPDF, report: StatisticalReport, startY: number, t: Translator): number {
    let y = startY;

    // Unified check
    if (checkPageBreak(doc, y, 120) !== y) {
        y = MARGINS.top;
    }

    y = addSectionTitle(doc, t('Report-Section-Nationality'), y);
    // Orphan check

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 4', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text(t('Report-Table-Nat-Title'), MARGINS.left, y - 2);

    const nat = report.nationalityDistribution;
    const tableData = [
        [t('Stats-Label-Venezuelans'), nat.nacional.toString(), (nat.nacional / nat.total).toFixed(4), `${((nat.nacional / nat.total) * 100).toFixed(1)}%`],
        [t('Stats-Label-Foreigners'), nat.extranjera.toString(), (nat.extranjera / nat.total).toFixed(4), `${((nat.extranjera / nat.total) * 100).toFixed(1)}%`],
        [t('Stats-Label-NotSpecified'), nat.noEspecificada.toString(), (nat.noEspecificada / nat.total).toFixed(4), `${((nat.noEspecificada / nat.total) * 100).toFixed(1)}%`],
    ];

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [[t('Report-Col-Nationality'), { content: t('Report-Col-FreqAbs'), styles: { halign: 'right' } }, { content: t('Report-Col-FreqRel'), styles: { halign: 'right' } }, { content: t('Report-Col-Percent'), styles: { halign: 'right' } }]],
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
        doc.text(t('Report-Table-Nat-Title') + ' (Detalle)', MARGINS.left, y - 2);

        autoTable(doc, {
            ...APA_TABLE_STYLE,
            startY: y,
            head: [['#', t('Report-Col-Nationality'), { content: t('Report-Col-FreqAbs'), styles: { halign: 'right' } }, { content: t('Report-Col-Percent'), styles: { halign: 'right' } }]],
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

        y = doc.lastAutoTable.finalY + 10;

        y = printAPAParagraph(doc, t('Report-Note-Vienna'), y);
        y += 10;
    }

    return y;
}

// ============================================
// OCCUPATIONAL ANALYSIS
// ============================================

function addOccupationalAnalysis(doc: jsPDF, report: StatisticalReport, startY: number, t: Translator): number {
    let y = startY;

    // Unified check: Title + Subsection + Table (~30 + 100 space)
    if (checkPageBreak(doc, y, 130) !== y) {
        y = MARGINS.top;
    }

    y = addSectionTitle(doc, t('Report-Section-Occupation'), y);
    y = addSubsectionTitle(doc, t('Report-Sub-Professions'), y);

    doc.setFontSize(FONTS.small);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 5', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text(t('Report-Table-Occ-Title'), MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['#', t('Report-Col-Occupation'), { content: t('Report-Col-FreqAbs'), styles: { halign: 'right' } }, { content: t('Report-Col-FreqRel'), styles: { halign: 'right' } }, { content: t('Report-Col-Percent'), styles: { halign: 'right' } }]],
        body: report.topProfessions.map((prof, index) => [
            (index + 1).toString(),
            sanitizeText(prof.value),
            prof.fi.toString(),
            prof.hi.toFixed(4),
            `${prof.pi.toFixed(1)}%`,
        ]),
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
        },
        margin: { left: MARGINS.left, right: MARGINS.right },
    });

    y = doc.lastAutoTable.finalY + 15;

    // --- CHART: OCCUPATIONAL DISTRIBUTION (Horizontal Bar) ---
    y = checkPageBreak(doc, y, 90);
    // Increased spacing to avoid overlap
    y += 5;
    doc.setFont('times', 'bold');
    doc.setFontSize(FONTS.small);
    doc.text('Figura 2', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text(t('Report-Fig2-Title'), MARGINS.left, y - 1);

    // Add extra padding before chart
    y += 4;

    const occupationChartData = report.topProfessions.slice(0, 10).map(p => ({
        label: sanitizeText(p.value),
        value: p.fi,
        percentage: p.pi,
        isHighlight: p.value.toLowerCase().includes('estudiante')
    }));

    // Draw chart and update Y based on its actual height
    y = drawHorizontalBarChart(doc, occupationChartData, {
        x: MARGINS.left,
        y: y + 5, // Add more internal padding just in case
        width: 170,
        height: 60,
    });

    y += 10; // Space between chart and note

    // Add APA Note
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const occNote = t('Report-Fig2-Note');
    y = printAPAParagraph(doc, occNote, y);

    y += 15;
    return y;
}

// ============================================
// GEOGRAPHIC DISTRIBUTION
// ============================================

function addGeographicDistribution(doc: jsPDF, report: StatisticalReport, startY: number, t: Translator): number {
    let y = startY;

    // Unified check
    if (checkPageBreak(doc, y, 120) !== y) {
        y = MARGINS.top;
    }

    y = addSectionTitle(doc, t('Report-Section-Geography'), y);

    // 1. Lugares de Desaparición (Initial Detention/Disappearance)
    y = addSubsectionTitle(doc, t('Report-Sub-Geo-Disap'), y);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 6', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text(t('Report-Table-Geo-Title'), MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['#', t('Report-Col-Location'), { content: t('Report-Col-FreqAbs'), styles: { halign: 'right' } }, { content: t('Report-Col-FreqRel'), styles: { halign: 'right' } }, { content: t('Report-Col-Percent'), styles: { halign: 'right' } }]],
        body: report.topDisappearanceLocations.map((loc, index) => [
            (index + 1).toString(),
            sanitizeText(loc.value),
            loc.fi.toString(),
            loc.hi.toFixed(4),
            `${loc.pi.toFixed(1)}%`,
        ]),
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
        },
        margin: { left: MARGINS.left, right: MARGINS.right },
    });

    y = doc.lastAutoTable.finalY + 15;

    // 2. Centros de Confinamiento (Current Location)
    if (report.topConfinementLocations.length > 0) {
        y = checkPageBreak(doc, y, 90);
        y = addSubsectionTitle(doc, t('Report-Sub-Geo-Conf'), y);

        doc.setFontSize(FONTS.small);
        doc.setFont('times', 'bold');
        doc.text('Tabla 7', MARGINS.left, y - 6);
        doc.setFont('times', 'italic');
        doc.text(t('Report-Table-Geo-Title') + ' (Confinamiento)', MARGINS.left, y - 2);

        autoTable(doc, {
            ...APA_TABLE_STYLE,
            startY: y,
            head: [['#', t('Report-Col-Location'), { content: t('Report-Col-FreqAbs'), styles: { halign: 'right' } }, { content: t('Report-Col-FreqRel'), styles: { halign: 'right' } }, { content: t('Report-Col-Percent'), styles: { halign: 'right' } }]],
            body: report.topConfinementLocations.map((loc, index) => [
                (index + 1).toString(),
                sanitizeText(loc.value),
                loc.fi.toString(),
                loc.hi.toFixed(4),
                `${loc.pi.toFixed(1)}%`,
            ]),
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' },
            },
            margin: { left: MARGINS.left, right: MARGINS.right },
        });

        y = doc.lastAutoTable.finalY + 10;

        doc.setFont('times', 'normal');
        doc.setTextColor(0, 0, 0);
        const geoNote = t('Report-Note-Centralization');
        y = printAPAParagraph(doc, geoNote, y);
        y += 10;
    }

    return y;
}

// ============================================
// TEMPORAL ANALYSIS
// ============================================

function addTemporalAnalysis(doc: jsPDF, report: StatisticalReport, startY: number, t: Translator): number {
    let y = startY;

    // Unified check
    if (checkPageBreak(doc, y, 130) !== y) {
        y = MARGINS.top;
    }

    y = addSectionTitle(doc, t('Report-Section-Temporal'), y);
    y = addSubsectionTitle(doc, t('Report-Sub-Time-Trend'), y);

    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'bold');
    doc.text('Tabla 8', MARGINS.left, y - 6);
    doc.setFont('times', 'italic');
    doc.text(t('Report-Table-Temp-Title'), MARGINS.left, y - 2);

    autoTable(doc, {
        ...APA_TABLE_STYLE,
        startY: y,
        head: [['#', t('Report-Col-Month'), { content: t('Report-Col-Cases'), styles: { halign: 'right' } }, { content: t('Report-Col-Percent'), styles: { halign: 'right' } }]],
        body: report.monthlyTrend.map((m, index) => [
            (index + 1).toString(),
            m.month,
            m.count.toString(),
            ((m.count / report.totalCases) * 100).toFixed(1) + '%'
        ]),
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            2: { halign: 'right' },
            3: { halign: 'right' },
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
        doc.text(t('Report-Fig3-Title'), MARGINS.left, y - 1);

        y += 4;

        // Map trend data
        const lineData = report.monthlyTrend.map(m => ({
            label: m.month.split(' ')[0],
            value: m.count
        }));

        drawLineChart(doc, lineData, {
            x: MARGINS.left,
            y: y,
            width: doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right,
            height: 60,
        });

        y += 75;
        // APA Note
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        const trendNote = t('Report-Fig3-Note');
        y = printAPAParagraph(doc, trendNote, y);

        y += 10;
    }

    return y;
}

// ============================================
// CONCLUSIONS
// ============================================

function addConclusions(doc: jsPDF, report: StatisticalReport, startY: number, t: Translator): number {
    let y = startY;

    y = addSectionTitle(doc, t('Report-Section-Conclusions'), y);

    doc.setFontSize(FONTS.body);
    doc.setFont('times', 'normal');
    doc.setTextColor(...COLORS.text);

    // Use dynamic conclusions from the rigorous analysis engine
    report.conclusions.forEach((conclusion) => {
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

    return y;
}

// ============================================
// DISCLAIMER & REFERENCES
// ============================================

function addDisclaimer(doc: jsPDF, t: Translator): void {
    doc.addPage();
    let y = MARGINS.top;

    // References Section
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
        // We try to match standard APA parts to italicize title
        // Pattern: Starts with "Author (Year). Title." or "Author. (Year). Title."

        // Crude but effective parser for standard APA refs
        let tokens: TextToken[] = [{ text: ref, fontStyle: 'normal' }];

        const firstParen = ref.indexOf('(');
        const closingParen = ref.indexOf('). ', firstParen);

        if (closingParen > -1) {
            // Found "(Year). "
            const titleStart = closingParen + 3;
            // Find end of title. Usually next period.
            const titleEnd = ref.indexOf('. ', titleStart);

            if (titleEnd > -1) {
                const authorYear = ref.substring(0, titleStart); // includes ". "
                const title = ref.substring(titleStart, titleEnd + 2); // includes ". "
                const rest = ref.substring(titleEnd + 2);

                tokens = [
                    { text: authorYear, fontStyle: 'normal' },
                    { text: title, fontStyle: 'italic' },
                    { text: rest, fontStyle: 'normal' }
                ];
            }
        }

        y = renderStyledReference(doc, tokens, y);
    });


    // Disclaimer
    y += 20;
    y = checkPageBreak(doc, y, 30);
    doc.setFontSize(FONTS.small);
    doc.setFont('times', 'italic');

    const disclaimer = t('Report-Disclaimer-Text');
    y = printAPAParagraph(doc, disclaimer, y);
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

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Removes emojis and characters that typical PDF fonts can't render correctly
 * without embedding custom fonts.
 */
function sanitizeText(text: string): string {
    if (!text) return '';

    // Whitelist approach: Keep only alphanumeric, Spanish characters, and basic punctuation
    return text
        .replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s\.,:;()!?"'\/\-\+\=%]/g, '')
        .replace(/\s+/g, ' ')
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
        y += 6; // Reduced line height for paragraphs
    }

    return y + 4;
}

// Helper to render mixed style references with robust wrapping
interface TextToken {
    text: string;
    fontStyle: 'normal' | 'italic' | 'bold';
}

function renderStyledReference(doc: jsPDF, tokens: TextToken[], startY: number): number {
    let y = checkPageBreak(doc, startY, 15);
    const maxWidth = doc.internal.pageSize.getWidth() - MARGINS.left - MARGINS.right;
    const indent = 12.7; // Hanging indent

    let currentLineTokens: { text: string; fontStyle: string; x: number }[] = [];
    let currentLineWidth = 0;
    let isFirstLine = true;

    // Process all tokens
    tokens.forEach(token => {
        // Split token into words, preserving spaces ?? No, just split by space
        // We need to handle punctuation attached to words.
        const words = token.text.split(/(\s+)/).filter(w => w.length > 0);

        doc.setFont('times', token.fontStyle);

        words.forEach(word => {
            // Handle long URLs that have no spaces (force break)
            const wordWidth = doc.getTextWidth(word);

            // Check if adding this word exceeds width
            // Max width depends on line: First line = full width? No, hanging indent means:
            // First line starts at Margin. Second line starts at Margin + Indent.
            // Wait, APA Reference is: First line flush left, subsequent indented.

            const availableWidth = maxWidth - (isFirstLine ? 0 : indent);

            if (currentLineWidth + wordWidth > availableWidth) {
                // FLUSH LINE
                const startX = MARGINS.left + (isFirstLine ? 0 : indent);
                currentLineTokens.forEach(t => {
                    doc.setFont('times', t.fontStyle);
                    doc.text(t.text, startX + t.x, y);
                });

                y += 6; // Line height
                y = checkPageBreak(doc, y, 5);

                // Reset for next line
                isFirstLine = false;
                currentLineWidth = 0;
                currentLineTokens = [];

                // If the word ITSELF is wider than the line (e.g. ultra long URL), we must force split it
                // Check against new available width (indented)
                const indWidth = maxWidth - indent;

                if (wordWidth > indWidth) {
                    // Force character split
                    // Iterate chars... simple approximation: splitTextToSize
                    // We need to print it chunk by chunk in correct style.
                    // It's tricky to mix with other tokens.
                    // Simplified: just let it overflow? NO. user complained.

                    // Rudimentary split: 
                    let remaining = word;
                    while (doc.getTextWidth(remaining) > indWidth) {
                        // Find split point
                        let splitIdx = remaining.length;
                        while (doc.getTextWidth(remaining.substring(0, splitIdx)) > indWidth && splitIdx > 0) {
                            splitIdx--;
                        }
                        if (splitIdx === 0) splitIdx = 10; // Failsafe

                        const chunk = remaining.substring(0, splitIdx);
                        doc.setFont('times', token.fontStyle);
                        doc.text(chunk, MARGINS.left + indent, y); // Always indented here

                        y += 6;
                        y = checkPageBreak(doc, y, 5);
                        remaining = remaining.substring(splitIdx);
                    }
                    // Add remaining part to next line buffer (or just print it? No, add to buffer for flow)
                    if (remaining) {
                        currentLineTokens.push({ text: remaining, fontStyle: token.fontStyle, x: 0 });
                        currentLineWidth = doc.getTextWidth(remaining);
                    }
                    return; // Continue to next word
                }
            }

            // Add word to line buffer
            currentLineTokens.push({
                text: word,
                fontStyle: token.fontStyle,
                x: currentLineWidth
            });
            currentLineWidth += wordWidth;
        });
    });

    // Flush last line
    if (currentLineTokens.length > 0) {
        const startX = MARGINS.left + (isFirstLine ? 0 : indent);
        currentLineTokens.forEach(t => {
            doc.setFont('times', t.fontStyle);
            doc.text(t.text, startX + t.x, y);
        });
        y += 6;
    }

    return y + 6; // Space after reference
}
