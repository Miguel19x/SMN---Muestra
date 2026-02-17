/**
 * Statistics Calculator Module
 * Implements statistical measures for data analysis and report generation
 */

import type { DesaparecidoData } from '../components/type/types';
import { categorizarProfesion } from './professionCategorizer';

// ============================================
// TYPES
// ============================================

export interface FrequencyItem {
    value: string;
    fi: number;      // Frecuencia absoluta
    hi: number;      // Frecuencia relativa (0-1)
    pi: number;      // Frecuencia porcentual (0-100)
    Fi: number;      // Frecuencia acumulada
}

export interface DescriptiveStats {
    count: number;
    mean: number;
    median: number;
    mode: number | null;
    min: number;
    max: number;
    range: number;
    variance: number;
    stdDev: number;
    cv: number;      // Coeficiente de variación
}

export interface GenderDistribution {
    masculino: number;
    femenino: number;
    noEspecificado: number;
    total: number;
}

export interface AgeGroup {
    label: string;
    count: number;
    percentage: number;
}

export interface NationalityDistribution {
    nacional: number;
    extranjera: number;
    noEspecificada: number;
    total: number;
    topForeignNationalities: FrequencyItem[];
}

export interface StatisticalReport {
    // Metadata
    generatedAt: string;
    periodStart: string | null;
    periodEnd: string | null;

    // General
    totalCases: number;
    casesWithPhoto: number;
    casesWithCompleteData: number;

    // Age statistics
    ageStats: DescriptiveStats | null;
    ageGroups: AgeGroup[];

    // Distributions
    genderDistribution: GenderDistribution;
    nationalityDistribution: NationalityDistribution;
    topProfessions: FrequencyItem[];

    // Segregated locations
    topDisappearanceLocations: FrequencyItem[];  // Lugar de desaparición
    topConfinementLocations: FrequencyItem[];     // Lugar de confinamiento
    monthlyTrend: { month: string; count: number }[];

    // Conclusions
    conclusions: string[];
}

// ============================================
// STATISTICAL FUNCTIONS
// ============================================

/**
 * Calculate arithmetic mean
 */
export function calculateMean(data: number[]): number {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
}

/**
 * Calculate median (central value)
 */
export function calculateMedian(data: number[]): number {
    if (data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
}

/**
 * Calculate mode (most frequent value)
 */
export function calculateMode<T>(data: T[]): T | null {
    if (data.length === 0) return null;

    const frequency: Map<T, number> = new Map();
    let maxFreq = 0;
    let mode: T | null = null;

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

/**
 * Calculate variance (σ²)
 */
export function calculateVariance(data: number[]): number {
    if (data.length === 0) return 0;
    const mean = calculateMean(data);
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((acc, val) => acc + val, 0) / data.length;
}

/**
 * Calculate standard deviation (σ)
 */
export function calculateStdDev(data: number[]): number {
    return Math.sqrt(calculateVariance(data));
}

/**
 * Calculate range statistics
 */
export function calculateRange(data: number[]): { min: number; max: number; range: number } {
    if (data.length === 0) return { min: 0, max: 0, range: 0 };
    const min = Math.min(...data);
    const max = Math.max(...data);
    return { min, max, range: max - min };
}

/**
 * Calculate coefficient of variation (CV = σ/μ × 100)
 */
export function calculateCV(data: number[]): number {
    const mean = calculateMean(data);
    if (mean === 0) return 0;
    const stdDev = calculateStdDev(data);
    return (stdDev / mean) * 100;
}

/**
 * Build frequency distribution table
 */
export function buildFrequencyTable(data: string[]): FrequencyItem[] {
    const n = data.length;
    if (n === 0) return [];

    // Count frequencies
    const counts: Map<string, number> = new Map();
    for (const item of data) {
        counts.set(item, (counts.get(item) || 0) + 1);
    }

    // Build table sorted by frequency
    const items = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([value, fi], index, arr) => {
            const hi = fi / n;
            const pi = hi * 100;
            // Cumulative frequency
            const Fi = arr.slice(0, index + 1).reduce((acc, [, f]) => acc + f, 0);
            return { value, fi, hi, pi, Fi };
        });

    return items;
}

/**
 * Calculate complete descriptive statistics for numeric data
 */
export function calculateDescriptiveStats(data: number[]): DescriptiveStats | null {
    const validData = data.filter(d => !isNaN(d) && d !== null && d !== undefined);

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
        cv: calculateCV(validData),
    };
}

// ============================================
// CONCLUSION GENERATOR
// ============================================

// ============================================
// DYNAMIC ANALYSIS HELPERS
// ============================================

/**
 * Calculates the percentage representation of a specific subgroup
 */
function calculateSubgroupPercentage(data: DesaparecidoData[], filterFn: (d: DesaparecidoData) => boolean): number {
    if (data.length === 0) return 0;
    const count = data.filter(filterFn).length;
    return (count / data.length) * 100;
}

/**
 * Detects significant temporal spikes or drops
 */
function analyzeTemporalTrends(monthlyTrend: { month: string; count: number }[]): string | null {
    if (monthlyTrend.length < 4) return null;

    const recent = monthlyTrend.slice(-3);
    const previous = monthlyTrend.slice(-6, -3);

    const avgRecent = calculateMean(recent.map(m => m.count));
    const avgPrevious = calculateMean(previous.map(m => m.count));

    if (avgPrevious === 0) return null;

    const change = ((avgRecent - avgPrevious) / avgPrevious) * 100;

    if (change > 50) return `Alerta de escalada: Se ha detectado un incremento del ${change.toFixed(1)}% en el promedio de detenciones del último trimestre respecto al anterior, lo que sugiere un recrudecimiento sistemático de la persecución.`;
    if (change < -50) return `Se observa una disminución del ${Math.abs(change).toFixed(1)}% en el registro de casos recientes, lo cual requiere verificación para determinar si obedece a un cese real de hostilidades o a un "apagón informativo" por temor a denunciar.`;

    return null;
}

/**
 * Identify most vulnerable demographic intersection
 */
function identifyVulnerableGroup(data: DesaparecidoData[]): string | null {
    const youngMales = calculateSubgroupPercentage(data, d => {
        const ag = d.edad;
        const sx = normalizeGender(d.sexo);
        return (ag !== undefined && ag >= 18 && ag <= 35 && sx === 'M');
    });

    if (youngMales > 40) return `El perfil demográfico predominante corresponde a hombres jóvenes (18-35 años), quienes representan el ${youngMales.toFixed(1)}% del total. Esto sugiere un patrón de neutralización de la fuerza social productiva y de protesta activa.`;

    const women = calculateSubgroupPercentage(data, d => normalizeGender(d.sexo) === 'F');
    if (women > 30) return `La alta incidencia de registros femeninos (${women.toFixed(1)}%) evidencia una distribución transversal en la base de datos, afectando diversos segmentos demográficos.`;

    return null;
}

// ============================================
// CONCLUSION GENERATOR
// ============================================

/**
 * Generate automatic, rigorous conclusions based on data analysis
 * Context: Political prisoners / Presos políticos en Venezuela
 */
export function generateConclusions(report: Omit<StatisticalReport, 'conclusions'>, rawData: DesaparecidoData[] = []): string[] {
    const conclusions: string[] = [];

    // 1. MACRO ANALYSIS (The "Big Picture")
    // 1. MACRO ANALYSIS (The "Big Picture")
    const formatDateSpan = (d: string) => {
        const date = new Date(d);
        return date.toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    conclusions.push(`Universo de estudio: El presente informe se sustenta en el análisis de ${report.totalCases} registros documentados${report.periodStart ? ` desde el ${formatDateSpan(report.periodStart)}` : ''}. La magnitud de la muestra permite inferir patrones sistemáticos y no aislados.`);

    // 2. DEMOGRAPHIC IMPACT & VULNERABILITY
    const vulnerabilityFinding = identifyVulnerableGroup(rawData);
    if (vulnerabilityFinding) {
        conclusions.push(`Perfil de la víctima: ${vulnerabilityFinding}`);
    }

    // Minors Analysis - High Rigor
    const minorsGroup = report.ageGroups.find(g => g.label.includes('Menores'));
    if (minorsGroup && minorsGroup.percentage > 0) {
        const severity = minorsGroup.count > 10 ? "Crímenes de lesa humanidad" : "Violación grave";
        conclusions.push(`${severity}: Se han documentado ${minorsGroup.count} casos de niños y adolescentes detenidos (representando el ${minorsGroup.percentage.toFixed(1)}% del total). La privación de libertad de menores en contextos políticos contraviene taxativamente el interés superior del niño (Convención sobre los Derechos del Niño) y agrava la responsabilidad penal del Estado.`);
    }

    // 3. TARGETED PERSECUTION (Professions)
    if (report.topProfessions.length > 0) {
        const topProf = report.topProfessions[0];
        const studentProf = report.topProfessions.find(p => p.value.includes('Estudiante'));
        const securityProf = report.topProfessions.find(p => p.value.includes('Militar') || p.value.includes('Policía') || p.value.includes('Seguridad'));

        let persecutionText = `Sectores objetivo: El análisis de profesión / ocupación revela una focalización sistemática en el sector ${topProf.value} (${topProf.pi.toFixed(1)}%).`;

        if (studentProf && studentProf.pi > 10 && topProf.value !== studentProf.value) {
            persecutionText += ` Asimismo, la persecución contra estudiantes (${studentProf.pi.toFixed(1)}%) busca desarticular el activismo juvenil y la protesta universitaria.`;
        } else if (studentProf && topProf.value === studentProf.value) {
            persecutionText += ` Esta concentración evidencia una estrategia dirigida a desarticular grupos específicos de la sociedad civil, más allá de detenciones aleatorias.`;
        }
        if (securityProf && securityProf.pi > 5) {
            persecutionText += ` Es notable la purga interna dentro de las fuerzas de seguridad (${securityProf.pi.toFixed(1)}%), indicativo de fracturas en la lealtad institucional.`;
        }
        conclusions.push(persecutionText);
    }

    // 4. GEOGRAPHIC PATTERNS & CENTRALIZATION
    if (report.topConfinementLocations.length > 0) {
        const topLoc = report.topConfinementLocations[0];
        const concentrationIndex = topLoc.pi;

        if (concentrationIndex > 20) {
            conclusions.push(`Centralización de la represión: Existe una marcada concentración del ${concentrationIndex.toFixed(1)}% de los detenidos en ${topLoc.value}. Esto demuestra una política de traslado de detenidos desde sus jurisdicciones naturales hacia centros de control centralizado, dificultando la defensa jurídica y el contacto familiar (violación de las Reglas Mandela).`);
        } else {
            conclusions.push(`Dispersión penitenciaria: La distribución de los detenidos en múltiples centros de reclusión sugiere una estrategia de dispersión para evitar la consolidación de grupos de resistencia carcelaria y dificultar el monitoreo unificado de DDHH.`);
        }
    }

    // 5. TEMPORAL DYNAMICS
    const trendAnalysis = analyzeTemporalTrends(report.monthlyTrend);
    if (trendAnalysis) {
        conclusions.push(trendAnalysis);
    }

    // 6. EVIDENTIARY QUALITY (Meta-analysis)
    const photoPct = (report.casesWithPhoto / report.totalCases) * 100;
    const completenessPct = (report.casesWithCompleteData / report.totalCases) * 100;

    if (photoPct < 50 || completenessPct < 50) {
        conclusions.push(`Opacidad de datos: Solo el ${completenessPct.toFixed(1)}% de los casos cuenta con ficha técnica completa y el ${photoPct.toFixed(1)}% con evidencia fotográfica. Esta precariedad documental es consustancial a la política de desaparición forzada temporal y ocultamiento de información por parte de los órganos de seguridad.`);
    }

    // 7. FINAL VERDICT
    // 7. FINAL VERDICT
    conclusions.push(`Dictamen final: La transversalidad de la represión (edad, género, ocupación) y la sistematicidad de los patrones aquí expuestos, confirman que no se trata de excesos policiales aislados, sino de una política de Estado que podría constituir Crimen de Lesa Humanidad según el Artículo 7 del Estatuto de Roma.`);

    return conclusions;
}

// ============================================
// MAIN REPORT GENERATOR
// ============================================

// ============================================
// NORMALIZATION HELPERS
// ============================================

/**
 * Normalizes gender strings to a standard format
 */
export const normalizeGender = (sex: string | undefined): 'M' | 'F' | 'U' => {
    if (!sex) return 'U';
    const s = sex.toLowerCase().trim();
    if (s === 'masculino' || s === 'hombre' || s === 'm') return 'M';
    if (s === 'femenino' || s === 'mujer' || s === 'f') return 'F';
    return 'U';
};

/**
 * Normalizes nationalities to a standard format
 */
export const normalizeNationality = (nat: string | undefined): string => {
    if (!nat) return 'No especificada';
    const n = nat.toLowerCase().trim();
    if (n === 'nacional' || n === 'venezuela' || n === 'vzla' || n === 've' || n === 'venezolana') return 'Nacional';
    return nat.trim(); // Return original for foreign nationalities
};

/**
 * Normalizes location names based on identifying key institutions or regions
 */
export const normalizeLocation = (loc: string): string => {
    if (!loc) return '';
    const l = loc.toLowerCase().trim();

    // CRITICAL: Filter out narrative descriptions that are NOT locations
    if (l.includes('saliendo') || l.includes('ingresando') || l.includes('camino a') ||
        l.includes('cerca de') || l.includes('frente a') || l.length > 80) {
        // Extract actual location from narrative if possible
        if (l.includes('pnb') && l.includes('barcelona')) return 'Barcelona (Anzoátegui) - PNB';
        if (l.includes('barcelona')) return 'C.P. Agroproductivo Barcelona (Anzoátegui)';
        // Otherwise, skip this entry
        return '';
    }

    // ============================================
    // CATEGORY 1: SEBIN FACILITIES (Political Detention)
    // ============================================
    if (l.includes('helicoide')) return 'El Helicoide (SEBIN - Caracas)';
    if (l.includes('dgcim') && l.includes('boleita')) return 'DGCIM Boleíta (Zona 7 - Caracas)';
    if (l.includes('zona 7') || (l.includes('pnb') && l.includes('boleíta'))) return 'DGCIM Boleíta (Zona 7 - Caracas)';
    if (l.includes('la tumba')) return 'La Tumba (SEBIN - Plaza Venezuela)';
    if (l.includes('sebin') && l.includes('maracaibo')) return 'SEBIN Maracaibo (Zulia)';
    if (l.includes('sebin') && l.includes('naguanagua')) return 'SEBIN Naguanagua (Carabobo)';
    if (l.includes('sebin') && l.includes('caroní') || l.includes('sebin') && l.includes('caroni')) return 'SEBIN Caroní (Bolívar)';

    // ============================================
    // CATEGORY 2: MAJOR PENITENTIARY CENTERS
    // ============================================

    // Carabobo
    if (l.includes('tocuyito') || (l.includes('internado') && l.includes('carabobo'))) {
        return 'Internado Judicial Carabobo - Tocuyito (Valencia)';
    }
    if (l.includes('hombre nuevo') && l.includes('libertador')) return 'C.P. Hombre Nuevo "El Libertador" - Tocuyito (Carabobo)';

    // Aragua
    if (l.includes('tocorón') || l.includes('tocoron')) return 'C.P. Tocorón (Aragua)';
    if (l.includes('alayón') || l.includes('alayon')) return 'Retén de Alayón - Maracay (Aragua)';

    // Miranda
    if (l.includes('ramo verde')) return 'C.P. Ramo Verde - Los Teques (Miranda)';
    if (l.includes('yare')) return 'C.P. Yare I, II y III - San Fco. de Yare (Miranda)';
    if (l.includes('rodeo')) return 'C.P. El Rodeo - Guatire (Miranda)';
    if (l.includes('inof') && l.includes('mujeres')) return 'INOF (Mujeres) - Los Teques (Miranda)';
    if (l.includes('cenaprofemil') || l.includes('cenaprof')) return 'CENAPROFEMIL - Los Teques (Miranda)';

    // Lara
    if (l.includes('uribana') || l.includes('david viloria')) return 'C.P. David Viloria - Uribana (Lara)';
    if (l.includes('fénix') || l.includes('fenix')) return 'Fénix Lara - Barquisimeto (Lara)';

    // Zulia
    if (l.includes('sabaneta')) return 'Cárcel de Sabaneta - Maracaibo (Zulia)';

    // Táchira
    if (l.includes('santa ana') || l.includes('cpo') || l.includes('occidente')) {
        return 'C.P. de Occidente (CPO) - Santa Ana (Táchira)';
    }
    // CORRECTION: "Santa Inés" is likely a typo for "Santa Ana (Táchira)"
    if (l.includes('santa inés') || l.includes('santa ines')) {
        // Check if context suggests Barinas vs Táchira
        if (l.includes('barinas')) return 'Santa Inés (Barinas) - Destacamento Policial';
        // Default to the more common prison for political prisoners
        return 'C.P. de Occidente (CPO) - Santa Ana (Táchira)';
    }

    // Bolívar
    if (l.includes('dorado') && l.includes('el')) return 'Cárcel de El Dorado (Bolívar)';
    if (l.includes('vista hermosa')) return 'Vista Hermosa - Ciudad Bolívar (Bolívar)';

    // Monagas
    if (l.includes('la pica') || l.includes('nelson mandela')) return 'La Pica (Hombre Nuevo "Nelson Mandela") - Maturín';

    // Mérida
    if (l.includes('cepra')) return 'CEPRA - Mérida (Región Andina)';

    // Guárico
    if (l.includes('26 de julio') || (l.includes('san juan') && l.includes('morros'))) {
        return 'C.P. 26 de Julio - San Juan de los Morros (Guárico)';
    }

    // Trujillo
    if (l.includes('internado') && l.includes('trujillo')) return 'Internado Judicial de Trujillo';

    // Falcón
    if (l.includes('coro')) return 'Comunidad Penitenciaria de Coro (Falcón)';

    // Sucre
    if (l.includes('cumaná') || l.includes('cumana')) return 'Internado Judicial de Cumaná (Sucre)';

    // Nueva Esparta
    if (l.includes('san antonio') && l.includes('internado')) return 'Internado Judicial San Antonio (Nueva Esparta)';

    // Anzoátegui
    if (l.includes('agroproductivo') && l.includes('barcelona')) return 'C.P. Agroproductivo Barcelona (Anzoátegui)';

    // ============================================
    // CATEGORY 3: POLICE STATIONS (PNB, CICPC)
    // ============================================

    // Caracas (Distrito Capital)
    if (l.includes('el valle') && !l.includes('tocuyito')) return 'Caracas (D.C.) - PNB El Valle';
    if (l.includes('la yaguara') || l.includes('yaguara')) return 'Caracas (D.C.) - PNB La Yaguara';
    if (l.includes('cicpc') && l.includes('parque carabobo')) return 'Caracas (D.C.) - CICPC Parque Carabobo';
    if (l.includes('cicpc') && l.includes('rosal')) return 'Caracas (D.C.) - CICPC El Rosal';

    // Other PNB stations
    if (l.includes('pnb') && l.includes('barcelona')) return 'Barcelona (Anzoátegui) - PNB';

    // ============================================
    // CATEGORY 4: MILITARY DETACHMENTS (GNB, Brigades)
    // ============================================

    if (l.includes('destacamento 33') || (l.includes('gnb') && l.includes('barinas'))) {
        return 'Destacamento 33 GNB - Barinas';
    }
    if (l.includes('destacamento 15') || (l.includes('gnb') && l.includes('valera'))) {
        return 'Destacamento 15 GNB - Valera (Trujillo)';
    }
    if (l.includes('brigada 41') || l.includes('blindada')) return 'Brigada 41 Blindada - Naguanagua (Carabobo)';

    // ============================================
    // CATEGORY 5: CITIES (Disambiguation for broader locations)
    // ============================================

    if (l.includes('caracas') || l.includes('distrito capital') || l.includes('libertador')) {
        return 'Caracas (Distrito Capital)';
    }
    if (l.includes('maracay')) return 'Maracay (Aragua)';
    if (l.includes('valencia') && !l.includes('tocuyito')) return 'Valencia (Carabobo)';
    if (l.includes('barquisimeto')) return 'Barquisimeto (Lara)';
    if (l.includes('maracaibo')) return 'Maracaibo (Zulia)';
    if (l.includes('san cristóbal') || l.includes('san cristobal')) return 'San Cristóbal (Táchira)';
    if (l.includes('maturín') || l.includes('maturin')) return 'Maturín (Monagas)';
    if (l.includes('barcelona') && !l.includes('agroproductivo')) return 'Barcelona (Anzoátegui)';
    if (l.includes('mérida') || l === 'merida') return 'Mérida (Mérida)';
    if (l.includes('valera')) return 'Valera (Trujillo)';
    if (l.includes('guanare')) return 'Guanare (Portuguesa)';
    if (l.includes('barinas') && !l.includes('santa')) return 'Barinas (Barinas)';
    if (l.includes('los teques')) return 'Los Teques (Miranda)';
    if (l.includes('ciudad bolívar') || l.includes('ciudad bolivar')) return 'Ciudad Bolívar (Bolívar)';
    if (l.includes('coro')) return 'Coro (Falcón)';

    // Caracas Parishes/Municipalities
    if (l.includes('catia')) return 'Catia (Caracas)';
    if (l.includes('petare')) return 'Petare (Miranda)';
    if (l.includes('chacao')) return 'Chacao (Miranda)';

    // ============================================
    // CATEGORY 6: STATES (Generic Fallback)
    // ============================================

    if (l.includes('carabobo')) return 'Edo. Carabobo';
    if (l.includes('zulia')) return 'Edo. Zulia';
    if (l.includes('miranda')) return 'Edo. Miranda';
    if (l.includes('táchira') || l.includes('tachira')) return 'Edo. Táchira';
    if (l.includes('bolívar') || l.includes('bolivar') && !l.includes('bolivariano')) return 'Edo. Bolívar';
    if (l.includes('aragua')) return 'Edo. Aragua';
    if (l.includes('lara')) return 'Edo. Lara';
    if (l.includes('anzoátegui') || l.includes('anzoategui')) return 'Edo. Anzoátegui';
    if (l.includes('monagas')) return 'Edo. Monagas';
    if (l.includes('sucre') && !l.includes('jose')) return 'Edo. Sucre';
    if (l.includes('falcón') || l.includes('falcon')) return 'Edo. Falcón';
    if (l.includes('apure')) return 'Edo. Apure';
    if (l.includes('guárico') || l.includes('guarico')) return 'Edo. Guárico';
    if (l.includes('portuguesa')) return 'Edo. Portuguesa';
    // Location specific overrides
    if (l.includes('carúpano') || l.includes('carupano')) return 'Carúpano (Sucre) - Centro de Coordinación Policial';
    if (l.includes('el valle') || l.includes('ei valle') || l.includes('e/ valle')) return 'PNB El Valle';

    // State prefixes (Ensure "Edo." is capitalized)
    if (l.startsWith('edo ') || l.startsWith('edo. ')) {
        const parts = l.split(' ');
        if (parts.length > 1) {
            const stateName = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
            return `Edo. ${stateName}`;
        }
    }

    if (l.includes('nueva esparta')) return 'Edo. Nueva Esparta';

    return loc.trim();
};

/**
 * Generate complete statistical report from data
 */
export function generateStatisticalReport(data: DesaparecidoData[]): StatisticalReport {
    const now = new Date();

    // General stats
    const totalCases = data.length;
    const casesWithPhoto = data.filter(d => d.imagen && d.imagen.length > 0).length;
    const casesWithCompleteData = data.filter(d => d.nombre && d.edad && d.sexo).length;

    // Period
    const dates = data
        .map(d => d.fecha)
        .filter((f): f is string => f !== undefined && f !== null && f.length > 0)
        .sort();
    const periodStart: string | null = dates.length > 0 ? dates[0] : null;
    const periodEnd: string | null = dates.length > 0 ? dates[dates.length - 1] : null;

    // Age statistics
    const ages = data
        .map(d => d.edad)
        .filter((age): age is number => age !== undefined && age !== null && age > 0 && age <= 120);
    const ageStats = calculateDescriptiveStats(ages);

    // Age groups
    const minors = data.filter(d => d.edad !== undefined && d.edad < 18).length;
    const adults = data.filter(d => d.edad !== undefined && d.edad >= 18 && d.edad < 65).length;
    const seniors = data.filter(d => d.edad !== undefined && d.edad >= 65).length;
    const ageUnknown = data.filter(d => d.edad === undefined || d.edad === null).length;

    const ageGroups: AgeGroup[] = [
        { label: 'Menores de 18', count: minors, percentage: (minors / totalCases) * 100 },
        { label: 'Adultos (18-64)', count: adults, percentage: (adults / totalCases) * 100 },
        { label: 'Mayores de 65', count: seniors, percentage: (seniors / totalCases) * 100 },
        { label: 'Edad no especificada', count: ageUnknown, percentage: (ageUnknown / totalCases) * 100 },
    ];

    // Gender distribution (Robust & Normalized)
    const genders = data.map(d => normalizeGender(d.sexo));
    const masculino = genders.filter(g => g === 'M').length;
    const femenino = genders.filter(g => g === 'F').length;

    const genderDistribution: GenderDistribution = {
        masculino,
        femenino,
        noEspecificado: totalCases - masculino - femenino,
        total: totalCases,
    };

    // Top professions
    const professions = data
        .filter(d => d.profesion && d.profesion.trim())
        .map(d => categorizarProfesion(d.profesion!));
    const topProfessions = buildFrequencyTable(professions).slice(0, 10);

    // Nationality distribution
    const nationalities = data.map(d => normalizeNationality(d.nacionalidad));
    const nacional = nationalities.filter(n => n === 'Nacional').length;
    const noEspecificada = nationalities.filter(n => n === 'No especificada').length;
    const extranjera = totalCases - nacional - noEspecificada;

    // Build frequency table for foreign nationalities only
    const foreignNationalities = data
        .filter(d => d.nacionalidad && normalizeNationality(d.nacionalidad) !== 'Nacional' && normalizeNationality(d.nacionalidad) !== 'No especificada')
        .map(d => normalizeNationality(d.nacionalidad));

    const nationalityDistribution: NationalityDistribution = {
        nacional,
        extranjera,
        noEspecificada,
        total: totalCases,
        topForeignNationalities: buildFrequencyTable(foreignNationalities).slice(0, 5),
    };

    // SEGREGATED LOCATIONS: Disappearance vs. Confinement

    // 1. Lugares de Desaparición
    const disappearanceLocations = data
        .filter(d => d.lugar_de_desaparicion && d.lugar_de_desaparicion.trim())
        .map(d => {
            const lugar = d.lugar_de_desaparicion!;
            const parts = lugar.split(',');
            const baseLugar = parts.length > 1 ? parts[parts.length - 1].trim() : lugar.trim();
            return normalizeLocation(baseLugar);
        })
        .filter(l => l && l.length > 0);
    const topDisappearanceLocations = buildFrequencyTable(disappearanceLocations).slice(0, 10);

    // 2. Lugares de Confinamiento
    const confinementLocations = data
        .filter(d => d.lugar_de_confinamiento && d.lugar_de_confinamiento.trim())
        .map(d => {
            const lugar = d.lugar_de_confinamiento!;
            const parts = lugar.split(',');
            const baseLugar = parts.length > 1 ? parts[parts.length - 1].trim() : lugar.trim();
            return normalizeLocation(baseLugar);
        })
        .filter(l => l && l.length > 0);
    const topConfinementLocations = buildFrequencyTable(confinementLocations).slice(0, 10);

    // Monthly trend
    const monthlyMap: Map<string, number> = new Map();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    data.forEach(d => {
        if (d.fecha) {
            const parts = d.fecha.split('-');
            if (parts.length >= 2) {
                const key = `${parts[0]}-${parts[1]}`;
                monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
            }
        }
    });

    const monthlyTrend = Array.from(monthlyMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12)
        .map(([key, count]) => {
            const [year, month] = key.split('-');
            return {
                month: `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`,
                count
            };
        });

    // Build report without conclusions first
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
        monthlyTrend,
    };

    // Generate conclusions with raw data access for cross-filtering
    const conclusions = generateConclusions(partialReport, data);

    return {
        ...partialReport,
        conclusions,
    };
}
