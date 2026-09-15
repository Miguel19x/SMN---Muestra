import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    AreaChart,
    Area,
    Sector,
} from 'recharts';
import * as RechartsModule from 'recharts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLanguage } from '../additionals/scripts/i18n';

const ChartCell: any = (RechartsModule as any).Cell;

// Solemn, desaturated color palette for human rights dashboard
export const STATS_COLORS = {
    primary: '#1e3a5f',      // Institutional Blue
    critical: '#be123c',      // Rose (desaturated red)
    neutral: '#64748b',       // Slate
    secondary: '#0e7490',     // Cyan Dark
    gray1: '#475569',
    gray2: '#6b7280',
    gray3: '#334155',
    muted: '#94a3b8',         // Gray for labels
};

function useStripRechartsGTabIndex() {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;

        const strip = () => {
            // Remove tabindex from any element that might have it
            root.querySelectorAll('[tabindex]').forEach(el => el.removeAttribute('tabindex'));

            // Specifically target svg elements to prevent focus
            root.querySelectorAll('svg').forEach(svg => {
                svg.setAttribute('focusable', 'false');
                svg.style.outline = 'none';
            });

            // Target any groups or shapes that might be receiving focus
            root.querySelectorAll('g, path, rect, circle, sector').forEach(el => {
                (el as HTMLElement).style.outline = 'none';
                (el as HTMLElement).style.boxShadow = 'none';
            });
        };

        strip();

        const observer = new MutationObserver(() => strip());
        observer.observe(root, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['tabindex'],
        });

        return () => observer.disconnect();
    }, []);

    return ref;
}

export const CHART_PALETTE = [
    STATS_COLORS.primary,
    STATS_COLORS.critical,
    STATS_COLORS.secondary,
    STATS_COLORS.neutral,
    STATS_COLORS.gray1,
    STATS_COLORS.gray2,
    STATS_COLORS.gray3,
];

// ================================================================================
// CUSTOM ENHANCED TOOLTIP COMPONENT WITH I18N
// ================================================================================

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    total?: number;
    isMobile?: boolean;
}

export const EnhancedTooltip = ({ active, payload, label, total, isMobile }: CustomTooltipProps) => {
    const { translate } = useLanguage();

    if (!active || !payload || payload.length === 0) return null;

    const value = payload[0].value;
    const name = label || payload[0].name;
    const percentage = total ? ((value / total) * 100).toFixed(1) : null;

    return (
        <div
            className={`bg-card border border-primary/20 rounded-md shadow-xl backdrop-blur-sm ${isMobile ? 'p-1.5 max-w-[140px]' : 'p-3 max-w-[200px]'}`}
            style={{ pointerEvents: 'none' }}
        >
            <p className={`font-semibold text-foreground mb-1 truncate leading-tight ${isMobile ? 'text-[10px]' : 'text-[13px]'}`}>{name}</p>
            <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
                <span className={`font-bold text-primary ${isMobile ? 'text-sm' : 'text-xl'}`}>{value}</span>
                <span className={`text-muted-foreground ${isMobile ? 'text-[9px]' : 'text-[11px]'}`}>{translate('Chart-Cases')}</span>
            </div>
            {percentage && (
                <p className={`text-muted-foreground mt-1 font-medium leading-tight ${isMobile ? 'text-[9px]' : 'text-[11px]'}`}>
                    {percentage}% {translate('Chart-Of-Total')}
                </p>
            )}
        </div>
    );
};

interface ChartCardProps {
    title: string;
    children: ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export function ChartCard({
    title,
    children,
    className = '',
    fullWidth = false,
}: ChartCardProps) {
    return (
        <div
            className={`bg-card border border-border rounded-xl p-4 sm:p-6 stats-fade-in ${fullWidth ? 'col-span-1 md:col-span-2' : ''} ${className}`}
        >
            <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
            </h3>
            {children}
        </div>
    );
}

interface BarChartData {
    name: string;
    value: number;
}

interface StatsBarChartProps {
    data: BarChartData[];
    height?: number;
    color?: string;
}

// Custom tick component to truncate long labels
const CustomXAxisTick = ({ x, y, payload }: any) => {
    const maxLength = 12;
    const text = payload.value || '';
    const truncated = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dx={-8}
                dy={10}
                textAnchor="end"
                fill="#94a3b8"
                fontSize={8}
                transform="rotate(-35)"
                style={{ fontFamily: 'system-ui, sans-serif' }}
            >
                {truncated}
            </text>
        </g>
    );
};

export function StatsBarChart({
    data,
    height = 250,
    color = STATS_COLORS.primary,
}: StatsBarChartProps) {
    const { translate } = useLanguage();
    // Calculate total for percentage display in tooltip
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const selectedItem = selectedIndex !== null ? data[selectedIndex] : null;
    const selectedPercent = useMemo(() => {
        if (!selectedItem || total === 0) return null;
        return ((selectedItem.value / total) * 100).toFixed(1);
    }, [selectedItem, total]);

    const containerRef = useStripRechartsGTabIndex();

    return (
        <div className="w-full" ref={containerRef}>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 10, left: 0, bottom: 50 }}
                    accessibilityLayer={true}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={<CustomXAxisTick />}
                        tickLine={false}
                        axisLine={{ stroke: '#334155' }}
                        interval={0}
                        height={45}
                    />
                    <YAxis
                        tick={{ fill: STATS_COLORS.muted, fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={35}
                    />
                    <Tooltip
                        allowEscapeViewBox={{ x: true, y: true }}
                        content={<EnhancedTooltip total={total} isMobile={typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches} />}
                        cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                        wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
                        offset={12}
                    />
                    <Bar
                        dataKey="value"
                        fill={color}
                        stroke="transparent"
                        strokeWidth={0}
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={false}
                        onClick={(_, index) => {
                            if (typeof index !== 'number') return;
                            setSelectedIndex(prev => (prev === index ? null : index));
                        }}
                    >
                        {data.map((_, index) => (
                            <ChartCell
                                key={`cell-${index}`}
                                fill={selectedIndex === index ? STATS_COLORS.secondary : color}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {selectedItem && (
                <div className="mt-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="font-semibold text-foreground">{selectedItem.name}</span>
                        <span className="font-bold text-primary">{selectedItem.value}</span>
                    </div>
                    {selectedPercent && (
                        <div className="text-xs text-muted-foreground">
                            {selectedPercent}% {translate('Chart-Of-Total')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

interface DonutChartData {
    name: string;
    value: number;
}

interface StatsDonutChartProps {
    data: DonutChartData[];
    height?: number;
    colors?: string[];
}

export function StatsDonutChart({
    data,
    height = 200,
    colors = CHART_PALETTE,
}: StatsDonutChartProps) {
    const { translate } = useLanguage();
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const selectedItem = selectedIndex !== null ? data[selectedIndex] : null;
    const selectedPercent = useMemo(() => {
        if (!selectedItem || total === 0) return null;
        return ((selectedItem.value / total) * 100).toFixed(1);
    }, [selectedItem, total]);

    const containerRef = useStripRechartsGTabIndex();

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mql = window.matchMedia('(max-width: 640px)');
        const apply = () => setIsMobile(mql.matches);
        apply();
        mql.addEventListener('change', apply);
        return () => mql.removeEventListener('change', apply);
    }, []);

    const selectedIndexRef = useRef(selectedIndex);
    selectedIndexRef.current = selectedIndex;

    const renderPieShape = useCallback((props: any) => {
        const {
            cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            index,
        } = props;

        const isSelected = typeof index === 'number' && index === selectedIndexRef.current;

        return (
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={isSelected ? outerRadius + 4 : outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                stroke="none"
            />
        );
    }, []);

    return (
        <div className="w-full" ref={containerRef}>
            <ResponsiveContainer width="100%" height={height}>
                <PieChart accessibilityLayer={true} margin={{ top: 0, right: isMobile ? 45 : 35, left: isMobile ? 45 : 35, bottom: 0 }}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        shape={renderPieShape}
                        isAnimationActive={false}
                        onClick={(_, index) => {
                            if (typeof index !== 'number') return;
                            setSelectedIndex(prev => (prev === index ? null : index));
                        }}
                        stroke="transparent"
                        strokeWidth={0}
                        label={({ name, value }) => {
                            const percent = ((value / total) * 100).toFixed(0);
                            return isMobile ? `${percent}%` : `${name}: ${percent}%`;
                        }}
                        labelLine={false}
                    >
                        {data.map((_, index) => (
                            <ChartCell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        allowEscapeViewBox={{ x: true, y: true }}
                        content={<EnhancedTooltip total={total} isMobile={isMobile} />}
                        wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
                        offset={12}
                    />
                </PieChart>
            </ResponsiveContainer>

            {selectedItem && (
                <div className="mt-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="font-semibold text-foreground">{selectedItem.name}</span>
                        <span className="font-bold text-primary">{selectedItem.value}</span>
                    </div>
                    {selectedPercent && (
                        <div className="text-xs text-muted-foreground">
                            {selectedPercent}% {translate('Chart-Of-Total')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

interface TimelineData {
    date: string;
    cases: number;
}

interface StatsTimelineChartProps {
    data: TimelineData[];
    height?: number;
}

export function StatsTimelineChart({
    data,
    height = 250,
}: StatsTimelineChartProps) {
    // Calculate total for percentage display in tooltip
    const total = data.reduce((sum, item) => sum + item.cases, 0);

    const containerRef = useStripRechartsGTabIndex();

    return (
        <div ref={containerRef}>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    accessibilityLayer={true}
                >
                    <defs>
                        <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={STATS_COLORS.primary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={STATS_COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.35} vertical={false} className="dark:stroke-slate-700" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: STATS_COLORS.muted, fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fill: STATS_COLORS.muted, fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        allowEscapeViewBox={{ x: true, y: true }}
                        content={<EnhancedTooltip total={total} isMobile={typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches} />}
                        wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
                        offset={12}
                    />
                    <Area
                        type="monotone"
                        dataKey="cases"
                        stroke={STATS_COLORS.primary}
                        strokeWidth={2}
                        fill="url(#colorCases)"
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
