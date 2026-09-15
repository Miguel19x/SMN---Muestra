
import jsPDF from 'jspdf';

// --- Constants & Types ---
interface ChartDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ChartTheme {
    primary: [number, number, number];   // R, G, B
    accent: [number, number, number];    // R, G, B (e.g., for emphasis like "Student")
    grid: [number, number, number];
    text: [number, number, number];
    background: [number, number, number];
}

const DEFAULT_THEME: ChartTheme = {
    primary: [30, 58, 95],     // Institutional Blue #1e3a5f
    accent: [190, 18, 60],     // Red for critical items #be123c
    grid: [200, 200, 200],     // Light gray
    text: [0, 0, 0],           // Black
    background: [255, 255, 255] // White
};

// --- Helper Functions ---
const setFillColor = (doc: jsPDF, color: [number, number, number]) => {
    doc.setFillColor(color[0], color[1], color[2]);
};
const setDrawColor = (doc: jsPDF, color: [number, number, number]) => {
    doc.setDrawColor(color[0], color[1], color[2]);
};
const setTextColor = (doc: jsPDF, color: [number, number, number]) => {
    doc.setTextColor(color[0], color[1], color[2]);
};

/**
 * Removes emojis and non-standard characters that break standard PDF fonts.
 * Keeps alphanumeric, punctuation, accent marks, and common symbols.
 */
function sanitizeChartText(text: string): string {
    // Remove typical emoji ranges and non-printable chars.
    // This regex keeps Latin chars, combining diacritics, numbers, punctuation.
    return text
        .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
        .replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s\.,:;()!?"'\/\-\+\=%]/g, '') // Strict whitelist fallback
        .trim();
}

// ============================================
// 1. HORIZONTAL BAR CHART (for Occupations)
// ============================================
export interface BarData {
    label: string;
    value: number;
    percentage: number;
    isHighlight?: boolean; // e.g. "Estudiante"
}

export function drawHorizontalBarChart(
    doc: jsPDF,
    data: BarData[],
    dims: ChartDimensions,
    title?: string
) {
    const { x, y, width, height } = dims;
    const chartBottom = y + height;

    // Config
    const labelWidth = 50; // Space for labels on left
    const valueWidth = 15; // Space for values on right
    const chartAreaWidth = width - labelWidth - valueWidth;
    const barHeight = 6;
    const gap = 4;

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value)) || 1;

    // Draw Title if not handled externally (APA usually handles externally but optional here)
    if (title) {
        doc.setFontSize(10);
        doc.setFont('times', 'bold');
        doc.text(title, x, y - 4);
    }

    // Draw Axis Line
    setDrawColor(doc, DEFAULT_THEME.grid);
    doc.line(x + labelWidth, y, x + labelWidth, chartBottom); // Vertical axis

    // Render Bars
    let currentY = y + 2;

    data.forEach(item => {
        // Label (Left aligned, truncated if too long)
        doc.setFontSize(9);
        doc.setFont('times', 'normal');
        setTextColor(doc, DEFAULT_THEME.text);

        let label = sanitizeChartText(item.label);

        // Better truncation logic
        const maxLabelW = labelWidth - 3; // buffer
        if (doc.getTextWidth(label) > maxLabelW) {
            let truncated = label;
            while (doc.getTextWidth(truncated + "...") > maxLabelW && truncated.length > 0) {
                truncated = truncated.slice(0, -1);
            }
            label = truncated + "...";
        }

        // Right align to the axis line
        doc.text(label, x + labelWidth - 2, currentY + barHeight - 1.5, { align: 'right' });

        // Bar Calculation
        const barWidth = (item.value / maxValue) * chartAreaWidth;
        const color = item.isHighlight ? DEFAULT_THEME.accent : DEFAULT_THEME.primary;

        // Draw Bar
        setFillColor(doc, color);
        doc.rect(x + labelWidth, currentY, barWidth, barHeight, 'F');

        // Value Label (Right of bar)
        doc.setFontSize(8);
        setTextColor(doc, DEFAULT_THEME.text);
        // Show count and percent
        const valText = `${item.value} (${item.percentage.toFixed(1)}%)`;
        doc.text(valText, x + labelWidth + barWidth + 2, currentY + barHeight - 1);

        currentY += barHeight + gap;
    });

    return currentY; // Return bottom Y for flow
}

// ============================================
// 2. LINE CHART (for Timeline)
// ============================================
export interface PointData {
    label: string; // The date/month string
    value: number;
}

export function drawLineChart(
    doc: jsPDF,
    data: PointData[],
    dims: ChartDimensions
) {
    const { x, y, width, height } = dims;
    const chartBottom = y + height;

    // Config
    const padding = { left: 10, bottom: 10, top: 5, right: 5 };
    const plotX = x + padding.left;
    const plotY = y + padding.top;
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.bottom - padding.top;

    // Scales
    const maxValue = Math.max(...data.map(d => d.value)) * 1.1; // +10% headroom
    const stepX = plotWidth / (data.length - 1 || 1);

    // Draw Axes
    setDrawColor(doc, DEFAULT_THEME.text);
    doc.setLineWidth(0.3);
    doc.line(plotX, plotY, plotX, plotY + plotHeight); // Y Axis
    doc.line(plotX, plotY + plotHeight, plotX + plotWidth, plotY + plotHeight); // X Axis

    // Grid lines (Horizontal)
    const gridSteps = 4;
    setDrawColor(doc, DEFAULT_THEME.grid);
    doc.setLineWidth(0.1);
    doc.setFontSize(7);
    setTextColor(doc, DEFAULT_THEME.text);

    for (let i = 0; i <= gridSteps; i++) {
        const val = (maxValue / gridSteps) * i;
        const lineY = plotY + plotHeight - ((val / maxValue) * plotHeight);

        doc.line(plotX, lineY, plotX + plotWidth, lineY);
        // Y Axis Label
        doc.text(Math.round(val).toString(), plotX - 2, lineY + 1, { align: 'right' });
    }

    // Plot Line
    const points: [number, number][] = data.map((d, i) => {
        const px = plotX + (i * stepX);
        const py = plotY + plotHeight - ((d.value / maxValue) * plotHeight);
        return [px, py];
    });

    // Draw connecting lines
    setDrawColor(doc, DEFAULT_THEME.primary);
    doc.setLineWidth(0.5);
    for (let i = 0; i < points.length - 1; i++) {
        doc.line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
    }

    // Draw points & X Labels
    setFillColor(doc, DEFAULT_THEME.primary);
    points.forEach((p, i) => {
        // Point
        doc.circle(p[0], p[1], 1, 'F');

        // X Axis Label (Skip some if too many to prevent overlap)
        // Show 1st, Last, and maybe every 3rd
        // show 1st, Last, and maybe every 3rd
        if (i === 0 || i === data.length - 1 || i % 3 === 0) {
            const safeLabel = sanitizeChartText(data[i].label);
            doc.text(safeLabel, p[0], chartBottom + 4, { align: 'center', angle: 0 }); // Angle 0 is better for readability if short
        }
    });
}

// ============================================
// 3. DONUT CHART (Semi-Arc Approximation)
// ============================================
export interface PieData {
    label: string;
    value: number;
    color?: [number, number, number];
}

// Replacing Donut with "Part-to-Whole Bar" for reliability in manual implementation
// It functions visually similar to a donut linearized.
export function drawPartToWholeChart(
    doc: jsPDF,
    data: PieData[],
    dims: ChartDimensions
) {
    const { x, y, width } = dims;
    const total = data.reduce((s, i) => s + i.value, 0);
    let currentX = x;
    const barH = 15;

    // Draw the segments
    data.forEach((item) => {
        const segWidth = (item.value / total) * width;
        const color = item.color || DEFAULT_THEME.primary;

        setFillColor(doc, color);
        doc.rect(currentX, y, segWidth, barH, 'F');
        currentX += segWidth;
    });

    // Draw Legend below
    let legendY = y + barH + 5;
    const legendXStart = x;
    let currentLegendX = legendXStart;

    data.forEach((item) => {
        const color = item.color || DEFAULT_THEME.primary;
        const percent = ((item.value / total) * 100).toFixed(1) + '%';
        const labelText = `${sanitizeChartText(item.label)} (${percent})`;

        // Color box
        setFillColor(doc, color);
        doc.rect(currentLegendX, legendY, 3, 3, 'F');

        // Text
        doc.setFontSize(8);
        setTextColor(doc, DEFAULT_THEME.text);
        doc.text(labelText, currentLegendX + 4, legendY + 2.5);

        // Advance
        const textW = doc.getTextWidth(labelText);
        currentLegendX += textW + 10;

        // Wrap if needed
        if (currentLegendX > x + width) {
            currentLegendX = legendXStart;
            legendY += 4;
        }
    });
}
